<?php
/**
 * POST /api/auth/register.php
 * Handles Customer and Freelancer registration (No public Admin registration allowed)
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';
$fullName = trim($data['full_name'] ?? '');
$role = $data['role'] ?? 'customer';

if (empty($email) || empty($password) || empty($fullName)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "All required fields must be filled."]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid email address."]);
    exit;
}

if ($role === 'admin') {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Direct public administrative registration is prohibited."]);
    exit;
}

if (!in_array($role, ['customer', 'freelancer'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid role selected."]);
    exit;
}

$db = (new Database())->getConnection();

// Check if email already exists
$chk = $db->prepare("SELECT id FROM users WHERE email = :email LIMIT 1");
$chk->execute([':email' => $email]);
if ($chk->fetch()) {
    http_response_code(409);
    echo json_encode(["status" => "error", "message" => "An account with this email address already exists."]);
    exit;
}

$passwordHash = password_hash($password, PASSWORD_BCRYPT);
$avatarUrl = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';

$db->beginTransaction();
try {
    $stmt = $db->prepare("
        INSERT INTO users (email, password_hash, full_name, role, avatar_url, status)
        VALUES (:email, :hash, :name, :role, :avatar, 'active')
    ");
    $stmt->execute([
        ':email' => $email,
        ':hash' => $passwordHash,
        ':name' => $fullName,
        ':role' => $role,
        ':avatar' => $avatarUrl
    ]);
    $userId = $db->lastInsertId();

    if ($role === 'customer') {
        $cStmt = $db->prepare("INSERT INTO customers (user_id, company_name, industry, trust_score) VALUES (:uid, :comp, 'General', 85.00)");
        $cStmt->execute([':uid' => $userId, ':comp' => $data['company_name'] ?? ($fullName . ' Projects')]);
    } else {
        $fStmt = $db->prepare("INSERT INTO freelancers (user_id, headline, hourly_rate, trust_score, availability) VALUES (:uid, :head, 45.00, 75.00, 'available')");
        $fStmt->execute([':uid' => $userId, ':head' => $data['headline'] ?? 'Full-Stack Developer']);

        // Insert default AI Score
        $aiStmt = $db->prepare("INSERT INTO ai_scores (freelancer_id, total_score, tier_level) VALUES (:fid, 75.00, 'Good')");
        $aiStmt->execute([':fid' => $db->lastInsertId()]);
    }

    // Initialize Wallet
    $walStmt = $db->prepare("INSERT INTO wallets (user_id, balance, pending_balance) VALUES (:uid, 0.00, 0.00)");
    $walStmt->execute([':uid' => $userId]);

    $token = base64_encode($userId . ':' . $email . ':' . $role . ':' . time());
    $db->commit();

    echo json_encode([
        "status" => "success",
        "message" => "Account successfully created.",
        "token" => $token,
        "user" => [
            "id" => $userId,
            "email" => $email,
            "full_name" => $fullName,
            "role" => $role,
            "avatar_url" => $avatarUrl
        ]
    ]);
} catch (Exception $e) {
    $db->rollBack();
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Registration error: " . $e->getMessage()]);
}
