<?php
/**
 * GET /api/auth/me.php
 * Returns current authenticated user profile and live role statistics
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/database.php';

$user = AuthMiddleware::authenticate();
$db = (new Database())->getConnection();

$extra = [];
if ($user['role'] === 'customer') {
    $stmt = $db->prepare("SELECT c.*, w.balance as wallet_balance FROM customers c LEFT JOIN wallets w ON w.user_id = c.user_id WHERE c.user_id = :uid");
    $stmt->execute([':uid' => $user['id']]);
    $extra = $stmt->fetch() ?: [];

    // Active project count
    $pCount = $db->prepare("SELECT COUNT(*) FROM projects WHERE customer_id = :cid AND status IN ('open', 'in_progress', 'under_review')");
    $pCount->execute([':cid' => $extra['id'] ?? 0]);
    $extra['active_projects_count'] = (int)$pCount->fetchColumn();

} elseif ($user['role'] === 'freelancer') {
    $stmt = $db->prepare("SELECT f.*, w.balance as wallet_balance, w.pending_balance FROM freelancers f LEFT JOIN wallets w ON w.user_id = f.user_id WHERE f.user_id = :uid");
    $stmt->execute([':uid' => $user['id']]);
    $extra = $stmt->fetch() ?: [];

    // Detailed AI score
    $aiStmt = $db->prepare("SELECT * FROM ai_scores WHERE freelancer_id = :fid");
    $aiStmt->execute([':fid' => $extra['id'] ?? 0]);
    $extra['ai_score_details'] = $aiStmt->fetch() ?: null;
} elseif ($user['role'] === 'admin') {
    $stmt = $db->prepare("SELECT * FROM admins WHERE user_id = :uid");
    $stmt->execute([':uid' => $user['id']]);
    $extra = $stmt->fetch() ?: [];
}

// Unread notifications count
$notifStmt = $db->prepare("SELECT COUNT(*) FROM notifications WHERE user_id = :uid AND is_read = 0");
$notifStmt->execute([':uid' => $user['id']]);
$unreadNotifs = (int)$notifStmt->fetchColumn();

echo json_encode([
    "status" => "success",
    "user" => [
        "id" => $user['id'],
        "email" => $user['email'],
        "full_name" => $user['full_name'],
        "role" => $user['role'],
        "avatar_url" => $user['avatar_url'],
        "phone" => $user['phone'],
        "profile" => $extra,
        "unread_notifications" => $unreadNotifs
    ]
]);
