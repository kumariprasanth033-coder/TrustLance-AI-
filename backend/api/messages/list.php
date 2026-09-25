<?php
/**
 * GET /api/messages/list.php?project_id={id}
 * POST /api/messages/send.php
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/database.php';

$user = AuthMiddleware::authenticate();
$db = (new Database())->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $projectId = (int)($data['project_id'] ?? 0);
    $recipientId = (int)($data['recipient_id'] ?? 0);
    $text = trim($data['message_text'] ?? '');
    $attachment = $data['attachment_url'] ?? null;

    if (!$projectId || empty($text)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Project ID and message text are required."]);
        exit;
    }

    $ins = $db->prepare("
        INSERT INTO messages (project_id, sender_id, recipient_id, message_text, attachment_url, is_read)
        VALUES (:pid, :sid, :rid, :txt, :att, 0)
    ");
    $ins->execute([
        ':pid' => $projectId,
        ':sid' => $user['id'],
        ':rid' => $recipientId,
        ':txt' => $text,
        ':att' => $attachment
    ]);

    echo json_encode([
        "status" => "success",
        "message_id" => $db->lastInsertId(),
        "created_at" => date('Y-m-d H:i:s')
    ]);
    exit;
}

// GET
$projectId = (int)($_GET['project_id'] ?? 0);
if (!$projectId) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Project ID required."]);
    exit;
}

// Mark messages as read for this user
$upd = $db->prepare("UPDATE messages SET is_read = 1 WHERE project_id = :pid AND recipient_id = :uid");
$upd->execute([':pid' => $projectId, ':uid' => $user['id']]);

$stmt = $db->prepare("
    SELECT m.*, u.full_name as sender_name, u.avatar_url as sender_avatar, u.role as sender_role
    FROM messages m
    JOIN users u ON m.sender_id = u.id
    WHERE m.project_id = :pid
    ORDER BY m.id ASC
");
$stmt->execute([':pid' => $projectId]);
$messages = $stmt->fetchAll();

echo json_encode(["status" => "success", "count" => count($messages), "data" => $messages]);
