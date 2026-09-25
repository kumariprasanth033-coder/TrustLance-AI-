<?php
/**
 * GET /api/projects/detail.php?id={id}
 * Retrieves comprehensive project workspace state including milestones, escrow, deliverables & revisions
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../config/database.php';

$projectId = (int)($_GET['id'] ?? 0);
if (!$projectId) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Project ID is required."]);
    exit;
}

$db = (new Database())->getConnection();

$pStmt = $db->prepare("
    SELECT 
        p.*,
        s.name as service_name,
        s.slug as service_slug,
        u.id as customer_user_id,
        u.full_name as customer_name,
        u.avatar_url as customer_avatar,
        c.company_name,
        c.trust_score as customer_trust_score,
        fu.id as freelancer_user_id,
        fu.full_name as freelancer_name,
        fu.avatar_url as freelancer_avatar,
        f.headline as freelancer_headline,
        f.trust_score as freelancer_trust_score
    FROM projects p
    JOIN services s ON p.service_id = s.id
    JOIN customers c ON p.customer_id = c.id
    JOIN users u ON c.user_id = u.id
    LEFT JOIN freelancers f ON p.selected_freelancer_id = f.id
    LEFT JOIN users fu ON f.user_id = fu.id
    WHERE p.id = :id
");
$pStmt->execute([':id' => $projectId]);
$project = $pStmt->fetch();

if (!$project) {
    http_response_code(404);
    echo json_encode(["status" => "error", "message" => "Project not found."]);
    exit;
}

// Milestones
$mStmt = $db->prepare("SELECT * FROM milestones WHERE project_id = :pid ORDER BY order_index ASC");
$mStmt->execute([':pid' => $projectId]);
$milestones = $mStmt->fetchAll();

// Deliverables
$dStmt = $db->prepare("SELECT * FROM deliverables WHERE project_id = :pid ORDER BY id DESC");
$dStmt->execute([':pid' => $projectId]);
$deliverables = $dStmt->fetchAll();

// Escrow account & transactions
$eStmt = $db->prepare("SELECT * FROM escrow_accounts WHERE project_id = :pid LIMIT 1");
$eStmt->execute([':pid' => $projectId]);
$escrow = $eStmt->fetch();

$escrowTransactions = [];
if ($escrow) {
    $tStmt = $db->prepare("SELECT * FROM escrow_transactions WHERE escrow_id = :eid ORDER BY id DESC");
    $tStmt->execute([':eid' => $escrow['id']]);
    $escrowTransactions = $tStmt->fetchAll();
}

// Proposals for this project
$prStmt = $db->prepare("
    SELECT 
        pr.*,
        u.full_name as freelancer_name,
        u.avatar_url as freelancer_avatar,
        f.headline,
        f.trust_score,
        f.rating,
        f.completed_projects
    FROM proposals pr
    JOIN freelancers f ON pr.freelancer_id = f.id
    JOIN users u ON f.user_id = u.id
    WHERE pr.project_id = :pid
    ORDER BY pr.id DESC
");
$prStmt->execute([':pid' => $projectId]);
$proposals = $prStmt->fetchAll();

// Disputes if any
$dispStmt = $db->prepare("SELECT * FROM disputes WHERE project_id = :pid ORDER BY id DESC");
$dispStmt->execute([':pid' => $projectId]);
$disputes = $dispStmt->fetchAll();

echo json_encode([
    "status" => "success",
    "project" => $project,
    "milestones" => $milestones,
    "deliverables" => $deliverables,
    "escrow" => $escrow,
    "escrow_transactions" => $escrowTransactions,
    "proposals" => $proposals,
    "disputes" => $disputes
]);
