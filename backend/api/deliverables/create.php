<?php
/**
 * POST /api/deliverables/create.php
 * Freelancer submits milestone work deliverable
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/database.php';

$user = AuthMiddleware::requireRole(['freelancer']);
$db = (new Database())->getConnection();

// Get freelancer ID
$fStmt = $db->prepare("SELECT id FROM freelancers WHERE user_id = :uid");
$fStmt->execute([':uid' => $user['id']]);
$freelancerId = $fStmt->fetchColumn();

$data = json_decode(file_get_contents("php://input"), true);
$projectId = (int)($data['project_id'] ?? 0);
$milestoneId = isset($data['milestone_id']) ? (int)$data['milestone_id'] : null;
$title = trim($data['title'] ?? '');
$notes = trim($data['notes'] ?? '');
$filePath = $data['file_path'] ?? '/uploads/deliverables/deliverable_bundle.zip';

if (!$projectId || empty($title)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Project ID and deliverable title are required."]);
    exit;
}

$db->beginTransaction();
try {
    $ins = $db->prepare("
        INSERT INTO deliverables (project_id, milestone_id, freelancer_id, title, notes, file_path, status)
        VALUES (:pid, :mid, :fid, :title, :notes, :file, 'submitted')
    ");
    $ins->execute([
        ':pid' => $projectId,
        ':mid' => $milestoneId,
        ':fid' => $freelancerId,
        ':title' => $title,
        ':notes' => $notes,
        ':file' => $filePath
    ]);
    $delivId = $db->lastInsertId();

    if ($milestoneId) {
        $db->prepare("UPDATE milestones SET status = 'submitted' WHERE id = :mid")->execute([':mid' => $milestoneId]);
    }
    $db->prepare("UPDATE projects SET status = 'under_review' WHERE id = :pid")->execute([':pid' => $projectId]);

    // Notify customer
    $cStmt = $db->prepare("SELECT c.user_id, p.title as project_title FROM projects p JOIN customers c ON p.customer_id = c.id WHERE p.id = :pid");
    $cStmt->execute([':pid' => $projectId]);
    $cust = $cStmt->fetch();

    if ($cust) {
        $notif = $db->prepare("
            INSERT INTO notifications (user_id, title, message, type, link)
            VALUES (:uid, 'Deliverable Submitted for Review', CONCAT('Freelancer submitted: \"', :dtitle, '\" on ', :ptitle), 'deliverable', CONCAT('/customer/projects/', :pid))
        ");
        $notif->execute([
            ':uid' => $cust['user_id'],
            ':dtitle' => $title,
            ':ptitle' => $cust['project_title'],
            ':pid' => $projectId
        ]);
    }

    $db->commit();
    echo json_encode([
        "status" => "success",
        "message" => "Deliverable submitted. Customer notified to review.",
        "deliverable_id" => $delivId
    ]);
} catch (Exception $e) {
    $db->rollBack();
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
