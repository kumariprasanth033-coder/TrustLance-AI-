<?php
/**
 * GET /api/services/list.php
 * Lists all active freelance services stored in MySQL
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../config/database.php';

$db = (new Database())->getConnection();
$category = $_GET['category'] ?? null;
$search = $_GET['search'] ?? null;

$query = "SELECT * FROM services WHERE is_active = 1";
$params = [];

if ($category && $category !== 'All') {
    $query .= " AND category = :cat";
    $params[':cat'] = $category;
}

if ($search) {
    $query .= " AND (name LIKE :s OR description LIKE :s)";
    $params[':s'] = "%" . $search . "%";
}

$query .= " ORDER BY id ASC";
$stmt = $db->prepare($query);
$stmt->execute($params);
$services = $stmt->fetchAll();

echo json_encode([
    "status" => "success",
    "count" => count($services),
    "data" => $services
]);
