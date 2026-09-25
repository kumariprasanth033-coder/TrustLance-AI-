<?php
/**
 * POST /api/proposals/create.php
 * Freelancer proposal submission with AI matching calculation and customer notification
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/database.php';

$user = AuthMiddleware::requireRole(['freelancer']);
$db = (new Database())->getConnection();

// Get freelancer record
$fStmt = $db->prepare("SELECT * FROM freelancers WHERE user_id = :uid");
$fStmt->execute([':uid' => $user['id']]);
$freelancer = $fStmt->fetch();

if (!$freelancer) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Freelancer record missing."]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$projectId = (int)($data['project_id'] ?? 0);
$coverLetter = trim($data['cover_letter'] ?? '');
$proposedPrice = (float)($data['proposed_price'] ?? 0);
$deliveryDays = (int)($data['delivery_days'] ?? 7);
$relevantExperience = trim($data['relevant_experience'] ?? '');
$portfolioRefs = trim($data['portfolio_refs'] ?? '');

if (!$projectId || empty($coverLetter) || $proposedPrice <= 0) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Project ID, cover letter, and valid proposed price are required."]);
    exit;
}

// Fetch project
$pStmt = $db->prepare("SELECT p.*, c.user_id as customer_user_id FROM projects p JOIN customers c ON p.customer_id = c.id WHERE p.id = :pid");
$pStmt->execute([':pid' => $projectId]);
$project = $pStmt->fetch();

if (!$project || $project['status'] !== 'open') {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Project is not open for proposals."]);
    exit;
}

// Calculate AI Match Score based on Trust Score and budget compatibility
$budgetRatio = min(1.0, $project['budget'] / max(1.0, $proposedPrice));
$trustFactor = (float)$freelancer['trust_score'] / 100.0;
$rawMatch = 70.0 + ($trustFactor * 20.0) + ($budgetRatio * 8.0);
$aiMatchScore = round(min(98.5, max(65.0, $rawMatch)), 1);
$aiMatchReason = "High compatibility: {$freelancer['trust_score']} AI Trust Score, verified on-time delivery rate ({$freelancer['on_time_delivery_rate']}%), and proposal price fits project budget parameters.";

$db->beginTransaction();
try {
    $ins = $db->prepare("
        INSERT INTO proposals (project_id, freelancer_id, cover_letter, proposed_price, delivery_days, relevant_experience, portfolio_refs, ai_match_score, ai_match_reason, status)
        VALUES (:pid, :fid, :cl, :price, :days, :exp, :port, :score, :reason, 'pending')
    ");
    $ins->execute([
        ':pid' => $projectId,
        ':fid' => $freelancer['id'],
        ':cl' => $coverLetter,
        ':price' => $proposedPrice,
        ':days' => $deliveryDays,
        ':exp' => $relevantExperience,
        ':port' => $portfolioRefs,
        ':score' => $aiMatchScore,
        ':reason' => $aiMatchReason
    ]);
    $proposalId = $db->lastInsertId();

    // Notify customer
    $notif = $db->prepare("
        INSERT INTO notifications (user_id, title, message, type, link)
        VALUES (:uid, 'New Proposal Received', CONCAT('Freelancer ', :fname, ' submitted a proposal for: ', :ptitle), 'proposal', CONCAT('/customer/projects/', :pid))
    ");
    $notif->execute([
        ':uid' => $project['customer_user_id'],
        ':fname' => $user['full_name'],
        ':ptitle' => $project['title'],
        ':pid' => $projectId
    ]);

    // Audit log
    $audit = $db->prepare("INSERT INTO activity_logs (user_id, action, entity, entity_id, metadata) VALUES (:uid, 'SUBMIT_PROPOSAL', 'proposals', :prid, :meta)");
    $audit->execute([
        ':uid' => $user['id'],
        ':prid' => $proposalId,
        ':meta' => json_encode(['project_id' => $projectId, 'price' => $proposedPrice])
    ]);

    $db->commit();
    echo json_encode([
        "status" => "success",
        "message" => "Proposal submitted successfully.",
        "proposal_id" => $proposalId,
        "ai_match_score" => $aiMatchScore,
        "ai_match_reason" => $aiMatchReason
    ]);
} catch (Exception $e) {
    $db->rollBack();
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to submit proposal: " . $e->getMessage()]);
}
