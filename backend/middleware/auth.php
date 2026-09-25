<?php
/**
 * TRUSTLANCE AI — Authentication Middleware
 * Validates Authorization tokens and verifies Role-Based Access Control (RBAC)
 */

require_once __DIR__ . '/../config/database.php';

class AuthMiddleware {
    public static function authenticate() {
        $headers = getallheaders();
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';

        if (!$authHeader && isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
        }

        if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            // Check session fallback
            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }
            if (isset($_SESSION['user_id'])) {
                return self::getUserById($_SESSION['user_id']);
            }
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Unauthorized access: Bearer token missing."]);
            exit;
        }

        $token = $matches[1];
        // Decodes simple base64 token or JWT structure: base64(userId:email:role:timestamp)
        $decoded = base64_decode($token);
        $parts = explode(':', $decoded);

        if (count($parts) < 3) {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Invalid authorization token format."]);
            exit;
        }

        $userId = (int)$parts[0];
        $user = self::getUserById($userId);

        if (!$user) {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "User account not found or session expired."]);
            exit;
        }

        return $user;
    }

    public static function requireRole($allowedRoles = []) {
        $user = self::authenticate();
        if (!in_array($user['role'], $allowedRoles)) {
            http_response_code(403);
            echo json_encode([
                "status" => "error",
                "message" => "Forbidden: Insufficient privileges for role '" . $user['role'] . "'."
            ]);
            exit;
        }
        return $user;
    }

    private static function getUserById($id) {
        $db = (new Database())->getConnection();
        $stmt = $db->prepare("SELECT id, email, full_name, role, avatar_url, phone, status FROM users WHERE id = :id LIMIT 1");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch();
    }
}
