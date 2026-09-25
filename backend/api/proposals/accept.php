<?php
/**
 * POST /api/proposals/accept.php
 * Customer hires freelancer: updates proposal status, assigns freelancer, and readies escrow funding
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/database.php';

$user = AuthMiddleware::requireRole(['customer']);
$db = (new Database())->getConnection();

$data = json_decode(file_get_contents("php://input"), true);
$proposalId = (int)($data['proposal_id'] ?? 0);

if (!$proposalId) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Proposal ID is required."]);
    exit;
}

$db->beginTransaction();
try {
    // 1. Fetch proposal and project
    $pStmt = $db->prepare("
        SELECT pr.*, p.id as project_id, p.customer_id, p.title as project_title, c.user_id as customer_user_id, f.user_id as freelancer_user_id
        FROM proposals pr
        JOIN projects p ON pr.project_id = p.id
        JOIN customers c ON p.customer_id = c.id
        JOIN freelancers f ON pr.freelancer_id = f.id
        WHERE pr.id = :prid AND c.user_id = :uid
    ");
    $pStmt->execute([':prid' => $proposalId, ':uid' => $user['id']]);
    $record = $pStmt->fetch();

    if (!$record) {
        throw new Exception("Proposal not found or unauthorized.");
    }

    $projectId = $record['project_id'];
    $freelancerId = $record['freelancer_id'];
    $agreedPrice = $record['proposed_price'];

    // 2. Mark proposal accepted
    $updPr = $db->prepare("UPDATE proposals SET status = 'accepted' WHERE id = :prid");
    $updPr->execute([':prid' => $proposalId]);

    // Reject other proposals
    $rejPr = $db->prepare("UPDATE proposals SET status = 'rejected' WHERE project_id = :pid AND id != :prid");
    $rejPr->execute([':pid' => $projectId, ':prid' => $proposalId]);

    // 3. Assign freelancer to project
    $updProj = $db->prepare("UPDATE projects SET selected_freelancer_id = :fid, budget = :price WHERE id = :pid");
    $updProj->execute([':fid' => $freelancerId, ':price' => $agreedPrice, ':pid' => $projectId]);

    // 4. Create or update escrow record in pending_funding state
    $esc = $db->prepare("
        INSERT INTO escrow_accounts (project_id, customer_id, freelancer_id, total_amount, held_amount, status)
        VALUES (:pid, :cid, :fid, :amt, 0.00, 'pending_funding')
        ON DUPLICATE KEY UPDATE freelancer_id = :fid2, total_amount = :amt2
    ");
    $esc->execute([
        ':pid' => $projectId,
        ':cid' => $record['customer_id'],
        ':fid' => $freelancerId,
        ':amt' => $agreedPrice,
        ':fid2' => $freelancerId,
        ':amt2' => $agreedPrice
    ]);

    // 5. Notify Freelancer
    $notif = $db->prepare("
        INSERT INTO notifications (user_id, title, message, type, link)
        VALUES (:uid, 'Proposal Accepted! You are Hired', CONCAT('Your proposal for \"', :ptitle, '\" has been accepted! Please wait for escrow funding to start work.'), 'proposal', CONCAT('/freelancer/projects/', :pid))
    ");
    $notif->execute([
        ':uid' => $record['freelancer_user_id'],
        ':ptitle' => $record['project_title'],
        ':pid' => $projectId
    ]);

    // 6. Audit log
    $audit = $db->prepare("INSERT INTO activity_logs (user_id, action, entity, entity_id, metadata) VALUES (:uid, 'ACCEPT_PROPOSAL', 'proposals', :prid, :meta)");
    $audit->execute([
        ':uid' => $user['id'],
        ':prid' => $proposalId,
        ':meta' => json_encode(['project_id' => $projectId, 'freelancer_id' => $freelancerId, 'price' => $agreedPrice])
    ]);

    $db->commit();
    echo json_encode([
        "status" => "success",
        "message" => "Proposal accepted. Freelancer successfully hired. Next step: Fund Escrow to activate workspace.",
        "project_id" => $projectId
    ]);
} catch (Exception $e) {
    $db->rollBack();
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to accept proposal: " . $e->getMessage()]);
}
