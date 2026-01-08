<?php
// backend/reports.php
require_once 'db.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $class_id = $_GET['class_id'] ?? null;
    $student_id = $_GET['student_id'] ?? null;
    $where = [];
    $params = [];
    $types = '';
    if ($class_id) {
        $where[] = 'attendance_records.class_id = ?';
        $params[] = $class_id;
        $types .= 'i';
    }
    if ($student_id) {
        $where[] = 'attendance_records.student_id = ?';
        $params[] = $student_id;
        $types .= 'i';
    }
    $query = 'SELECT students.name AS student_name, classes.name AS class_name, COUNT(*) AS total, SUM(status = "Present") AS presents, SUM(status = "Absent") AS absents, SUM(status = "Late") AS lates FROM attendance_records JOIN students ON attendance_records.student_id = students.id JOIN classes ON attendance_records.class_id = classes.id';
    if ($where) {
        $query .= ' WHERE ' . implode(' AND ', $where);
    }
    $query .= ' GROUP BY attendance_records.student_id, attendance_records.class_id';
    $stmt = $conn->prepare($query);
    if ($params) {
        $stmt->bind_param($types, ...$params);
    }
    $stmt->execute();
    $result = $stmt->get_result();
    $reports = [];
    while ($row = $result->fetch_assoc()) {
        $reports[] = $row;
    }
    echo json_encode($reports);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
}
$conn->close();
?>