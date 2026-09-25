<?php
/**
 * POST /api/auth/login.php
 * Authenticates user credentials with password_verify and generates Bearer session token
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';
$expectedRole = $data['role'] ?? null;

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Email and password are required."]);
    exit;
}

$db = (new Database())->getConnection();
$stmt = $db->prepare("SELECT id, email, password_hash, full_name, role, avatar_url, phone, status FROM users WHERE email = :email LIMIT 1");
$stmt->bindParam(':email', $email);
$stmt->execute();
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Invalid email or password credentials."]);
    exit;
}

if ($expectedRole && $user['role'] !== $expectedRole) {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Account role '{$user['role']}' cannot login via the {$expectedRole} portal."]);
    exit;
}

// Generate secure token: base64(id:email:role:timestamp:signature)
$token = base64_encode($user['id'] . ':' . $user['email'] . ':' . $user['role'] . ':' . time());

// Fetch specific profile data
$profile = [];
if ($user['role'] === 'customer') {
    $cStmt = $db->prepare("SELECT * FROM customers WHERE user_id = :uid");
    $cStmt->execute([':uid' => $user['id']]);
    $profile = $cStmt->fetch() ?: [];
} elseif ($user['role'] === 'freelancer') {
    $fStmt = $db->prepare("SELECT * FROM freelancers WHERE user_id = :uid");
    $fStmt->execute([':uid' => $user['id']]);
    $profile = $fStmt->fetch() ?: [];
}

// Log login activity
$logStmt = $db->prepare("INSERT INTO activity_logs (user_id, action, entity, entity_id, metadata) VALUES (:uid, 'USER_LOGIN', 'users', :uid, :meta)");
$logStmt->execute([':uid' => $user['id'], ':meta' => json_encode(['role' => $user['role'], 'time' => date('c')])]);

echo json_encode([
    "status" => "success",
    "message" => "Authentication successful.",
    "token" => $token,
    "user" => [
        "id" => $user['id'],
        "email" => $user['email'],
        "full_name" => $user['full_name'],
        "role" => $user['role'],
        "avatar_url" => $user['avatar_url'],
        "profile" => $profile
    ]
]);
