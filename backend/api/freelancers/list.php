<?php
/**
 * GET /api/freelancers/list.php
 * GET /api/freelancers/detail.php?id={id}
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../config/database.php';

$db = (new Database())->getConnection();

$freelancerId = $_GET['id'] ?? null;
if ($freelancerId) {
    $stmt = $db->prepare("
        SELECT 
            f.*,
            u.full_name,
            u.avatar_url,
            u.email,
            u.phone,
            s.tier_level,
            s.completion_factor,
            s.on_time_factor,
            s.rating_factor,
            s.response_factor,
            s.repeat_client_factor,
            s.dispute_penalty
        FROM freelancers f
        JOIN users u ON f.user_id = u.id
        LEFT JOIN ai_scores s ON s.freelancer_id = f.id
        WHERE f.id = :id
    ");
    $stmt->execute([':id' => $freelancerId]);
    $freelancer = $stmt->fetch();

    if (!$freelancer) {
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Freelancer not found."]);
        exit;
    }

    // Skills
    $skStmt = $db->prepare("
        SELECT sk.name, fs.proficiency
        FROM freelancer_skills fs
        JOIN skills sk ON fs.skill_id = sk.id
        WHERE fs.freelancer_id = :fid
    ");
    $skStmt->execute([':fid' => $freelancerId]);
    $freelancer['skills'] = $skStmt->fetchAll();

    // Reviews
    $revStmt = $db->prepare("
        SELECT r.*, u.full_name as reviewer_name, u.avatar_url as reviewer_avatar
        FROM reviews r
        JOIN users u ON r.reviewer_id = u.id
        WHERE r.reviewee_id = :uid
        ORDER BY r.id DESC
    ");
    $revStmt->execute([':uid' => $freelancer['user_id']]);
    $freelancer['reviews'] = $revStmt->fetchAll();

    echo json_encode(["status" => "success", "data" => $freelancer]);
    exit;
}

// Search and filters
$query = "
    SELECT 
        f.*,
        u.full_name,
        u.avatar_url,
        s.tier_level,
        (SELECT GROUP_CONCAT(sk.name SEPARATOR ', ') 
         FROM freelancer_skills fs 
         JOIN skills sk ON fs.skill_id = sk.id 
         WHERE fs.freelancer_id = f.id) as skills_list
    FROM freelancers f
    JOIN users u ON f.user_id = u.id
    LEFT JOIN ai_scores s ON s.freelancer_id = f.id
    WHERE u.status = 'active'
";

$params = [];
$minScore = $_GET['min_score'] ?? null;
$search = $_GET['search'] ?? null;

if ($minScore) {
    $query .= " AND f.trust_score >= :min";
    $params[':min'] = (float)$minScore;
}

if ($search) {
    $query .= " AND (u.full_name LIKE :s OR f.headline LIKE :s OR f.bio LIKE :s)";
    $params[':s'] = "%" . $search . "%";
}

$query .= " ORDER BY f.trust_score DESC, f.rating DESC";
$stmt = $db->prepare($query);
$stmt->execute($params);
$freelancers = $stmt->fetchAll();

echo json_encode(["status" => "success", "count" => count($freelancers), "data" => $freelancers]);
