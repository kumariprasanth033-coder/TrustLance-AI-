<?php
/**
 * POST /api/escrow/release.php
 * Customer approves deliverable or milestone: releases escrow funds to freelancer wallet
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
$milestoneId = isset($data['milestone_id']) ? (int)$data['milestone_id'] : null;

if (!$projectId || $amount <= 0) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Valid project ID and positive release amount required."]);
    exit;
}

try {
    $escrowService = new EscrowService();
    $result = $escrowService->releaseEscrow($projectId, $customerId, $amount, $milestoneId);
    echo json_encode($result);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
