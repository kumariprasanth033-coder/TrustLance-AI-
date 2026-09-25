<?php
/**
 * POST /api/deliverables/revision.php
 * Customer requests a revision on a submitted deliverable
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/database.php';

$user = AuthMiddleware::requireRole(['customer']);
$db = (new Database())->getConnection();

// Get customer ID
$cStmt = $db->prepare("SELECT id FROM customers WHERE user_id = :uid");
$cStmt->execute([':uid' => $user['id']]);
$customerId = $cStmt->fetchColumn();

$data = json_decode(file_get_contents("php://input"), true);
$deliverableId = (int)($data['deliverable_id'] ?? 0);
$reason = trim($data['reason'] ?? 'Requested adjustments');
$details = trim($data['details'] ?? '');

if (!$deliverableId || empty($details)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Deliverable ID and revision feedback details required."]);
    exit;
}

$db->beginTransaction();
try {
    $ins = $db->prepare("
        INSERT INTO revisions (deliverable_id, customer_id, reason, details, status)
        VALUES (:did, :cid, :reason, :det, 'open')
    ");
    $ins->execute([
        ':did' => $deliverableId,
        ':cid' => $customerId,
        ':reason' => $reason,
        ':det' => $details
    ]);

    // Update deliverable status
    $db->prepare("UPDATE deliverables SET status = 'revision_requested' WHERE id = :did")->execute([':did' => $deliverableId]);

    // Notify freelancer
    $dStmt = $db->prepare("SELECT d.project_id, f.user_id as freelancer_user_id, p.title as project_title FROM deliverables d JOIN freelancers f ON d.freelancer_id = f.id JOIN projects p ON d.project_id = p.id WHERE d.id = :did");
    $dStmt->execute([':did' => $deliverableId]);
    $info = $dStmt->fetch();

    if ($info) {
        $notif = $db->prepare("
            INSERT INTO notifications (user_id, title, message, type, link)
            VALUES (:uid, 'Revision Requested', CONCAT('Client requested a revision on ', :ptitle, ': \"', :reason, '\"'), 'revision', CONCAT('/freelancer/projects/', :pid))
        ");
        $notif->execute([
            ':uid' => $info['freelancer_user_id'],
            ':ptitle' => $info['project_title'],
            ':reason' => $reason,
            ':pid' => $info['project_id']
        ]);
    }

    $db->commit();
    echo json_encode([
        "status" => "success",
        "message" => "Revision request submitted to freelancer."
    ]);
} catch (Exception $e) {
    $db->rollBack();
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
