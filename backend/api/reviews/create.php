<?php
/**
 * POST /api/reviews/create.php
 * Submits review and triggers automatic AI Trust Score recalculation
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../services/TrustScoreService.php';

$user = AuthMiddleware::requireRole(['customer']);
$db = (new Database())->getConnection();

$data = json_decode(file_get_contents("php://input"), true);
$projectId = (int)($data['project_id'] ?? 0);
$freelancerUserId = (int)($data['freelancer_user_id'] ?? 0);
$rating = (float)($data['rating'] ?? 5.0);
$comment = trim($data['comment'] ?? '');

if (!$projectId || !$freelancerUserId || empty($comment)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Project ID, freelancer user ID, and written review required."]);
    exit;
}

$db->beginTransaction();
try {
    $ins = $db->prepare("
        INSERT INTO reviews (project_id, reviewer_id, reviewee_id, rating, comment)
        VALUES (:pid, :rid, :wid, :rate, :comm)
    ");
    $ins->execute([
        ':pid' => $projectId,
        ':rid' => $user['id'],
        ':wid' => $freelancerUserId,
        ':rate' => $rating,
        ':comm' => $comment
    ]);

    // Fetch freelancer id
    $fStmt = $db->prepare("SELECT id FROM freelancers WHERE user_id = :uid");
    $fStmt->execute([':uid' => $freelancerUserId]);
    $freelancerId = $fStmt->fetchColumn();

    $db->commit();

    // Recalculate score
    $scoreService = new TrustScoreService();
    $newScore = $scoreService->calculateScore($freelancerId);

    echo json_encode([
        "status" => "success",
        "message" => "Review recorded. Freelancer AI Trust Score updated.",
        "new_score" => $newScore
    ]);
} catch (Exception $e) {
    $db->rollBack();
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to submit review: " . $e->getMessage()]);
}
