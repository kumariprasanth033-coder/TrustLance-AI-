<?php
/**
 * GET /api/notifications/list.php
 * POST /api/notifications/read.php
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/database.php';

$user = AuthMiddleware::authenticate();
$db = (new Database())->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $notifId = $data['notification_id'] ?? null;

    if ($notifId === 'all') {
        $upd = $db->prepare("UPDATE notifications SET is_read = 1 WHERE user_id = :uid");
        $upd->execute([':uid' => $user['id']]);
    } elseif ($notifId) {
        $upd = $db->prepare("UPDATE notifications SET is_read = 1 WHERE id = :id AND user_id = :uid");
        $upd->execute([':id' => $notifId, ':uid' => $user['id']]);
    }
    echo json_encode(["status" => "success", "message" => "Notification marked as read."]);
    exit;
}

$stmt = $db->prepare("SELECT * FROM notifications WHERE user_id = :uid ORDER BY id DESC LIMIT 50");
$stmt->execute([':uid' => $user['id']]);
$notifs = $stmt->fetchAll();

echo json_encode(["status" => "success", "count" => count($notifs), "data" => $notifs]);
