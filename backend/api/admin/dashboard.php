<?php
/**
 * GET /api/admin/dashboard.php
 * Administrative intelligence & telemetry aggregator
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/database.php';

AuthMiddleware::requireRole(['admin']);
$db = (new Database())->getConnection();

// Core counters
$totalUsers = (int)$db->query("SELECT COUNT(*) FROM users")->fetchColumn();
$totalCustomers = (int)$db->query("SELECT COUNT(*) FROM users WHERE role = 'customer'")->fetchColumn();
$totalFreelancers = (int)$db->query("SELECT COUNT(*) FROM users WHERE role = 'freelancer'")->fetchColumn();
$totalProjects = (int)$db->query("SELECT COUNT(*) FROM projects")->fetchColumn();
$activeProjects = (int)$db->query("SELECT COUNT(*) FROM projects WHERE status IN ('open', 'in_progress', 'under_review')")->fetchColumn();
$completedProjects = (int)$db->query("SELECT COUNT(*) FROM projects WHERE status = 'completed'")->fetchColumn();

// Financial metrics
$escrowHeld = (float)$db->query("SELECT COALESCE(SUM(held_amount), 0) FROM escrow_accounts")->fetchColumn();
$paymentsReleased = (float)$db->query("SELECT COALESCE(SUM(released_amount), 0) FROM escrow_accounts")->fetchColumn();
$refundsTotal = (float)$db->query("SELECT COALESCE(SUM(refunded_amount), 0) FROM escrow_accounts")->fetchColumn();

// Operational health
$openDisputes = (int)$db->query("SELECT COUNT(*) FROM disputes WHERE status IN ('OPEN', 'UNDER_REVIEW')")->fetchColumn();
$avgTrustScore = (float)$db->query("SELECT COALESCE(AVG(trust_score), 85) FROM freelancers")->fetchColumn();
$activeRiskAlerts = (int)$db->query("SELECT COUNT(*) FROM risk_alerts WHERE status = 'active'")->fetchColumn();

// Recent activity
$logs = $db->query("
    SELECT l.*, u.full_name, u.role
    FROM activity_logs l
    LEFT JOIN users u ON l.user_id = u.id
    ORDER BY l.id DESC LIMIT 10
")->fetchAll();

// Recent risk alerts
$alerts = $db->query("
    SELECT r.*, u.full_name, p.title as project_title
    FROM risk_alerts r
    LEFT JOIN users u ON r.user_id = u.id
    LEFT JOIN projects p ON r.project_id = p.id
    ORDER BY r.id DESC LIMIT 5
")->fetchAll();

echo json_encode([
    "status" => "success",
    "metrics" => [
        "total_users" => $totalUsers,
        "customers" => $totalCustomers,
        "freelancers" => $totalFreelancers,
        "total_projects" => $totalProjects,
        "active_projects" => $activeProjects,
        "completed_projects" => $completedProjects,
        "escrow_held" => $escrowHeld,
        "payments_released" => $paymentsReleased,
        "refunds_total" => $refundsTotal,
        "open_disputes" => $openDisputes,
        "avg_trust_score" => round($avgTrustScore, 1),
        "active_risk_alerts" => $activeRiskAlerts
    ],
    "recent_logs" => $logs,
    "risk_alerts" => $alerts
]);
