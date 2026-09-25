<?php
/**
 * POST /api/escrow/fund.php
 * Customer funds project escrow using simulated escrow / future gateway provider
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../services/EscrowService.php';

$user = AuthMiddleware::requireRole(['customer']);
$db = (new Database())->getConnection();

// Get customer ID
$cStmt = $db->prepare("SELECT id FROM customers WHERE user_id = :uid");
$cStmt->execute([':uid' => $user['id']]);
$customerId = $cStmt->fetchColumn();

$data = json_decode(file_get_contents("php://input"), true);
$projectId = (int)($data['project_id'] ?? 0);
$amount = (float)($data['amount'] ?? 0);
$paymentMethod = $data['payment_method'] ?? 'demo_escrow';

if (!$projectId || $amount <= 0) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Valid project ID and positive funding amount required."]);
    exit;
}

try {
    $escrowService = new EscrowService();
    $result = $escrowService->fundEscrow($projectId, $customerId, $amount, $paymentMethod);
    echo json_encode($result);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
