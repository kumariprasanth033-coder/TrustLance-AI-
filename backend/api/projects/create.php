<?php
/**
 * POST /api/projects/create.php
 * Handles multi-step project submission, milestone breakdown, and validation
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/database.php';

$user = AuthMiddleware::requireRole(['customer']);
$db = (new Database())->getConnection();

// Get customer ID
$cStmt = $db->prepare("SELECT id FROM customers WHERE user_id = :uid");
$cStmt->execute([':uid' => $user['id']]);
$customerId = $cStmt->fetchColumn();

if (!$customerId) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Customer profile not initialized."]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$title = trim($data['title'] ?? '');
$serviceId = (int)($data['service_id'] ?? 1);
$description = trim($data['description'] ?? '');
$requirements = trim($data['requirements'] ?? '');
$budget = (float)($data['budget'] ?? 0);
$deadline = $data['deadline'] ?? date('Y-m-d', strtotime('+14 days'));
$revisionExpectations = trim($data['revision_expectations'] ?? 'Up to 2 revision rounds included.');
$referenceWebsites = trim($data['reference_websites'] ?? '');
$status = ($data['save_as_draft'] ?? false) ? 'draft' : 'open';
$milestones = $data['milestones'] ?? [];

if (empty($title) || empty($description) || $budget <= 0) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Title, description, and a valid positive budget are required."]);
    exit;
}

$db->beginTransaction();
try {
    $stmt = $db->prepare("
        INSERT INTO projects (customer_id, service_id, title, description, requirements, budget, deadline, status, revision_expectations, reference_websites)
        VALUES (:cid, :sid, :title, :desc, :req, :budget, :deadline, :status, :rev, :refs)
    ");
    $stmt->execute([
        ':cid' => $customerId,
        ':sid' => $serviceId,
        ':title' => $title,
        ':desc' => $description,
        ':req' => $requirements,
        ':budget' => $budget,
        ':deadline' => $deadline,
        ':status' => $status,
        ':rev' => $revisionExpectations,
        ':refs' => $referenceWebsites
    ]);
    $projectId = $db->lastInsertId();

    // Insert milestones if provided, otherwise create default single or 2 milestones
    if (!empty($milestones) && is_array($milestones)) {
        $mStmt = $db->prepare("INSERT INTO milestones (project_id, title, description, amount, deadline, status, order_index) VALUES (:pid, :title, :desc, :amt, :dl, 'pending', :idx)");
        $idx = 1;
        foreach ($milestones as $m) {
            $mStmt->execute([
                ':pid' => $projectId,
                ':title' => $m['title'] ?? ('Milestone ' . $idx),
                ':desc' => $m['description'] ?? '',
                ':amt' => (float)($m['amount'] ?? ($budget / count($milestones))),
                ':dl' => $m['deadline'] ?? $deadline,
                ':idx' => $idx++
            ]);
        }
    } else {
        // Default 2 milestones
        $mStmt = $db->prepare("INSERT INTO milestones (project_id, title, description, amount, deadline, status, order_index) VALUES (:pid, :title, :desc, :amt, :dl, 'pending', :idx)");
        $mStmt->execute([
            ':pid' => $projectId,
            ':title' => 'Initial Phase & Architecture Deliverables',
            ':desc' => 'Core technical specifications, designs, or setup.',
            ':amt' => round($budget * 0.5, 2),
            ':dl' => date('Y-m-d', strtotime('+7 days')),
            ':idx' => 1
        ]);
        $mStmt->execute([
            ':pid' => $projectId,
            ':title' => 'Final Implementation & Code Handover',
            ':desc' => 'Complete functional delivery, documentation, and review.',
            ':amt' => round($budget * 0.5, 2),
            ':dl' => $deadline,
            ':idx' => 2
        ]);
    }

    // Increment service project count
    $db->prepare("UPDATE services SET project_count = project_count + 1 WHERE id = :sid")->execute([':sid' => $serviceId]);

    // Audit log
    $audit = $db->prepare("INSERT INTO activity_logs (user_id, action, entity, entity_id, metadata) VALUES (:uid, 'CREATE_PROJECT', 'projects', :pid, :meta)");
    $audit->execute([
        ':uid' => $user['id'],
        ':pid' => $projectId,
        ':meta' => json_encode(['title' => $title, 'budget' => $budget, 'status' => $status])
    ]);

    $db->commit();
    echo json_encode([
        "status" => "success",
        "message" => "Project created successfully.",
        "project_id" => $projectId
    ]);
} catch (Exception $e) {
    $db->rollBack();
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Project creation failed: " . $e->getMessage()]);
}
