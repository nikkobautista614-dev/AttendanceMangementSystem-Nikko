<?php
// backend/attendance.php
require_once 'db.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // List attendance records, optionally filter by class or date
        $class_id = $_GET['class_id'] ?? null;
        $date = $_GET['date'] ?? null;
        $query = 'SELECT attendance_records.id, students.name AS student_name, classes.name AS class_name, attendance_records.date, attendance_records.status FROM attendance_records JOIN students ON attendance_records.student_id = students.id JOIN classes ON attendance_records.class_id = classes.id';
        $params = [];
        if ($class_id) {
            $query .= ' WHERE attendance_records.class_id = ?';
            $params[] = $class_id;
        }
        if ($date) {
            $query .= $class_id ? ' AND' : ' WHERE';
            $query .= ' attendance_records.date = ?';
            $params[] = $date;
        }
        $stmt = $conn->prepare($query . ' ORDER BY attendance_records.date DESC');
        if (count($params) === 1) {
            $stmt->bind_param('s', $params[0]);
        } elseif (count($params) === 2) {
            $stmt->bind_param('ss', $params[0], $params[1]);
        }
        $stmt->execute();
        $result = $stmt->get_result();
        $records = [];
        while ($row = $result->fetch_assoc()) {
            $records[] = $row;
        }
        echo json_encode($records);
        break;
    case 'POST':
        // Add attendance record
        $data = json_decode(file_get_contents('php://input'), true);
        $student_id = $data['student_id'] ?? 0;
        $class_id = $data['class_id'] ?? 0;
        $date = $data['date'] ?? date('Y-m-d');
        $status = $data['status'] ?? 'Present';
        $stmt = $conn->prepare('INSERT INTO attendance_records (student_id, class_id, date, status) VALUES (?, ?, ?, ?)');
        $stmt->bind_param('iiss', $student_id, $class_id, $date, $status);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'id' => $stmt->insert_id]);
        } else {
            echo json_encode(['success' => false, 'error' => $stmt->error]);
        }
        break;
    case 'PUT':
        // Update attendance record
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'] ?? 0;
        $status = $data['status'] ?? '';
        $stmt = $conn->prepare('UPDATE attendance_records SET status=? WHERE id=?');
        $stmt->bind_param('si', $status, $id);
        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => $stmt->error]);
        }
        break;
    case 'DELETE':
        // Delete attendance record
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'] ?? 0;
        $stmt = $conn->prepare('DELETE FROM attendance_records WHERE id=?');
        $stmt->bind_param('i', $id);
        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => $stmt->error]);
        }
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method Not Allowed']);
}
$conn->close();
?>