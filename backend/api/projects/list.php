<?php
/**
 * GET /api/projects/list.php
 * Queries projects from MySQL with filters (service, status, budget, search)
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../config/database.php';

$db = (new Database())->getConnection();

$status = $_GET['status'] ?? null;
$serviceId = $_GET['service_id'] ?? null;
$customerId = $_GET['customer_id'] ?? null;
$freelancerId = $_GET['freelancer_id'] ?? null;
$search = $_GET['search'] ?? null;

$query = "
    SELECT 
        p.*,
        s.name as service_name,
        s.icon as service_icon,
        u.full_name as customer_name,
        u.avatar_url as customer_avatar,
        c.trust_score as customer_trust_score,
        (SELECT COUNT(*) FROM proposals WHERE project_id = p.id) as proposal_count,
        f.id as hired_freelancer_id,
        fu.full_name as hired_freelancer_name,
        e.held_amount as escrow_held_amount,
        e.status as escrow_status
    FROM projects p
    JOIN services s ON p.service_id = s.id
    JOIN customers c ON p.customer_id = c.id
    JOIN users u ON c.user_id = u.id
    LEFT JOIN freelancers f ON p.selected_freelancer_id = f.id
    LEFT JOIN users fu ON f.user_id = fu.id
    LEFT JOIN escrow_accounts e ON e.project_id = p.id
    WHERE 1=1
";

$params = [];

if ($status && $status !== 'all') {
    $query .= " AND p.status = :status";
    $params[':status'] = $status;
}

if ($serviceId) {
    $query .= " AND p.service_id = :sid";
    $params[':sid'] = $serviceId;
}

if ($customerId) {
    $query .= " AND p.customer_id = :cid";
    $params[':cid'] = $customerId;
}

if ($freelancerId) {
    $query .= " AND (p.selected_freelancer_id = :fid OR p.id IN (SELECT project_id FROM proposals WHERE freelancer_id = :fid2))";
    $params[':fid'] = $freelancerId;
    $params[':fid2'] = $freelancerId;
}

if ($search) {
    $query .= " AND (p.title LIKE :s OR p.description LIKE :s OR p.requirements LIKE :s)";
    $params[':s'] = "%" . $search . "%";
}

$query .= " ORDER BY p.id DESC";

$stmt = $db->prepare($query);
$stmt->execute($params);
$projects = $stmt->fetchAll();

echo json_encode([
    "status" => "success",
    "count" => count($projects),
    "data" => $projects
]);
