<?php
/**
 * GET /api/admin/disputes.php
 * POST /api/admin/disputes.php (Admin resolution)
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/database.php';

$user = AuthMiddleware::requireRole(['admin']);
$db = (new Database())->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $disputeId = (int)($data['dispute_id'] ?? 0);
    $action = $data['action'] ?? 'resolve'; // 'release_to_freelancer', 'refund_to_customer', 'split'
    $resolutionNotes = trim($data['resolution_notes'] ?? '');

    if (!$disputeId || empty($resolutionNotes)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Dispute ID and resolution notes are required."]);
        exit;
    }

    $db->beginTransaction();
    try {
        $stmt = $db->prepare("SELECT * FROM disputes WHERE id = :id");
        $stmt->execute([':id' => $disputeId]);
        $dispute = $stmt->fetch();

        if (!$dispute) {
            throw new Exception("Dispute record not found.");
        }

        $upd = $db->prepare("
            UPDATE disputes 
            SET status = 'RESOLVED', resolution_notes = :notes, resolved_by = :admin, updated_at = NOW()
            WHERE id = :id
        ");
        $upd->execute([':notes' => $resolutionNotes, ':admin' => $user['id'], ':id' => $disputeId]);

        // Audit resolution
        $audit = $db->prepare("INSERT INTO activity_logs (user_id, action, entity, entity_id, metadata) VALUES (:uid, 'RESOLVE_DISPUTE', 'disputes', :did, :meta)");
        $audit->execute([
            ':uid' => $user['id'],
            ':did' => $disputeId,
            ':meta' => json_encode(['action' => $action, 'notes' => $resolutionNotes])
        ]);

        $db->commit();
        echo json_encode(["status" => "success", "message" => "Dispute successfully adjudicated and recorded."]);
    } catch (Exception $e) {
        $db->rollBack();
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
    exit;
}

$stmt = $db->query("
    SELECT 
        d.*,
        p.title as project_title,
        p.budget as project_budget,
        u.full_name as raised_by_name,
        u.role as raised_by_role,
        e.held_amount as escrow_held
    FROM disputes d
    JOIN projects p ON d.project_id = p.id
    JOIN users u ON d.raised_by = u.id
    LEFT JOIN escrow_accounts e ON e.project_id = p.id
    ORDER BY d.id DESC
");
$disputes = $stmt->fetchAll();

echo json_encode(["status" => "success", "count" => count($disputes), "data" => $disputes]);
