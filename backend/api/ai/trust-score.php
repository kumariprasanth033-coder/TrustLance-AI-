<?php
/**
 * GET /api/ai/trust-score.php?freelancer_id={id}
 * POST /api/ai/trust-score.php { freelancer_id: {id} } (Recalculate)
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../services/TrustScoreService.php';

$db = (new Database())->getConnection();
$service = new TrustScoreService();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $freelancerId = (int)($data['freelancer_id'] ?? 0);
    if (!$freelancerId) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Freelancer ID required."]);
        exit;
    }
    $result = $service->calculateScore($freelancerId);
    echo json_encode(["status" => "success", "data" => $result]);
    exit;
}

$freelancerId = (int)($_GET['freelancer_id'] ?? 0);
if (!$freelancerId) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Freelancer ID parameter is required."]);
    exit;
}

$stmt = $db->prepare("
    SELECT s.*, f.headline, u.full_name, u.avatar_url
    FROM ai_scores s
    JOIN freelancers f ON s.freelancer_id = f.id
    JOIN users u ON f.user_id = u.id
    WHERE s.freelancer_id = :fid
");
$stmt->execute([':fid' => $freelancerId]);
$score = $stmt->fetch();

if (!$score) {
    // Calculate fresh
    $fresh = $service->calculateScore($freelancerId);
    echo json_encode(["status" => "success", "data" => $fresh]);
    exit;
}

echo json_encode(["status" => "success", "data" => $score]);
