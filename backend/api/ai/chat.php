<?php
/**
 * POST /api/ai/chat.php
 * TrustLance AI Assistant — contextual Gemini API proxy grounded in live MySQL data
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../services/GeminiAIService.php';
require_once __DIR__ . '/../../config/database.php';

$user = AuthMiddleware::authenticate();
$db = (new Database())->getConnection();

$data = json_decode(file_get_contents("php://input"), true);
$userMessage = trim($data['message'] ?? '');

if (empty($userMessage)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Message prompt cannot be empty."]);
    exit;
}

// Build role-specific context directly from MySQL
$context = [
    "user_id" => $user['id'],
    "user_name" => $user['full_name'],
    "role" => $user['role']
];

if ($user['role'] === 'customer') {
    // Fetch active customer projects & escrow balances
    $pStmt = $db->prepare("
        SELECT p.id, p.title, p.status, p.budget, p.deadline, e.held_amount, e.status as escrow_status,
               (SELECT COUNT(*) FROM proposals WHERE project_id = p.id) as proposal_count
        FROM projects p
        JOIN customers c ON p.customer_id = c.id
        LEFT JOIN escrow_accounts e ON e.project_id = p.id
        WHERE c.user_id = :uid
    ");
    $pStmt->execute([':uid' => $user['id']]);
    $context['customer_projects'] = $pStmt->fetchAll();

} elseif ($user['role'] === 'freelancer') {
    // Fetch freelancer trust score and project deadlines
    $fStmt = $db->prepare("
        SELECT f.trust_score, f.rating, f.completed_projects, f.on_time_delivery_rate, f.response_time_hours,
               s.tier_level, s.completion_factor, s.on_time_factor, s.rating_factor, s.response_factor, s.dispute_penalty,
               w.balance as wallet_balance, w.pending_balance
        FROM freelancers f
        LEFT JOIN ai_scores s ON s.freelancer_id = f.id
        LEFT JOIN wallets w ON w.user_id = f.user_id
        WHERE f.user_id = :uid
    ");
    $fStmt->execute([':uid' => $user['id']]);
    $context['freelancer_profile'] = $fStmt->fetch();

    $pStmt = $db->prepare("
        SELECT p.id, p.title, p.status, p.budget, p.deadline, e.held_amount as secured_escrow
        FROM projects p
        JOIN freelancers f ON p.selected_freelancer_id = f.id
        LEFT JOIN escrow_accounts e ON e.project_id = p.id
        WHERE f.user_id = :uid
    ");
    $pStmt->execute([':uid' => $user['id']]);
    $context['assigned_projects'] = $pStmt->fetchAll();

} elseif ($user['role'] === 'admin') {
    // Aggregate platform metrics
    $stats = [];
    $stats['total_users'] = $db->query("SELECT COUNT(*) FROM users")->fetchColumn();
    $stats['total_projects'] = $db->query("SELECT COUNT(*) FROM projects")->fetchColumn();
    $stats['active_escrow_held'] = $db->query("SELECT COALESCE(SUM(held_amount), 0) FROM escrow_accounts")->fetchColumn();
    $stats['open_disputes'] = $db->query("SELECT COUNT(*) FROM disputes WHERE status IN ('OPEN', 'UNDER_REVIEW')")->fetchColumn();
    $stats['active_risk_alerts'] = $db->query("SELECT COUNT(*) FROM risk_alerts WHERE status = 'active'")->fetchColumn();
    $context['admin_platform_telemetry'] = $stats;
}

try {
    $aiService = new GeminiAIService();
    $aiResponse = $aiService->generateChatResponse($userMessage, $user['role'], $context);

    echo json_encode([
        "status" => "success",
        "reply" => $aiResponse,
        "context_synced" => true,
        "timestamp" => date('c')
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "AI Assistant communication error: " . $e->getMessage()
    ]);
}
