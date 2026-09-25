<?php
/**
 * POST /api/disputes/create.php
 * Opens a dispute, holds escrow in 'disputed' status, and alerts admin
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/database.php';

$user = AuthMiddleware::authenticate();
$db = (new Database())->getConnection();

$data = json_decode(file_get_contents("php://input"), true);
$projectId = (int)($data['project_id'] ?? 0);
$reason = trim($data['reason'] ?? '');
$description = trim($data['description'] ?? '');
$evidenceUrl = $data['evidence_url'] ?? null;

if (!$projectId || empty($reason) || empty($description)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Project ID, dispute reason, and evidence description required."]);
    exit;
}

$db->beginTransaction();
try {
    $ins = $db->prepare("
        INSERT INTO disputes (project_id, raised_by, reason, description, evidence_url, status)
        VALUES (:pid, :uid, :reason, :desc, :ev, 'OPEN')
    ");
    $ins->execute([
        ':pid' => $projectId,
        ':uid' => $user['id'],
        ':reason' => $reason,
        ':desc' => $description,
        ':ev' => $evidenceUrl
    ]);
    $disputeId = $db->lastInsertId();

    // Mark project and escrow status as disputed
    $db->prepare("UPDATE projects SET status = 'disputed' WHERE id = :pid")->execute([':pid' => $projectId]);
    $db->prepare("UPDATE escrow_accounts SET status = 'disputed' WHERE project_id = :pid")->execute([':pid' => $projectId]);

    // Create risk alert
    $alert = $db->prepare("INSERT INTO risk_alerts (user_id, project_id, risk_level, reason, status) VALUES (:uid, :pid, 'High Risk', CONCAT('Dispute opened: ', :reason), 'active')");
    $alert->execute([':uid' => $user['id'], ':pid' => $projectId, ':reason' => $reason]);

    $db->commit();
    echo json_encode([
        "status" => "success",
        "message" => "Dispute formally registered. Escrow funds locked. An admin will review evidence.",
        "dispute_id" => $disputeId
    ]);
} catch (Exception $e) {
    $db->rollBack();
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to open dispute: " . $e->getMessage()]);
}
