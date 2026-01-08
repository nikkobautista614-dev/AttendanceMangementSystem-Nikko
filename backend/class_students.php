<?php
// backend/class_students.php
require_once 'db.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // List all students enrolled in a class
        $class_id = $_GET['class_id'] ?? null;
        if ($class_id) {
            $stmt = $conn->prepare('SELECT students.id, students.name, students.email FROM class_students JOIN students ON class_students.student_id = students.id WHERE class_students.class_id = ?');
            $stmt->bind_param('i', $class_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $students = [];
            while ($row = $result->fetch_assoc()) {
                $students[] = $row;
            }
            echo json_encode($students);
        } else {
            echo json_encode([]);
        }
        break;
    case 'POST':
        // Enroll a student in a class
        $data = json_decode(file_get_contents('php://input'), true);
        $class_id = $data['class_id'] ?? 0;
        $student_id = $data['student_id'] ?? 0;
        $stmt = $conn->prepare('INSERT IGNORE INTO class_students (class_id, student_id) VALUES (?, ?)');
        $stmt->bind_param('ii', $class_id, $student_id);
        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => $stmt->error]);
        }
        break;
    case 'DELETE':
        // Remove a student from a class
        $data = json_decode(file_get_contents('php://input'), true);
        $class_id = $data['class_id'] ?? 0;
        $student_id = $data['student_id'] ?? 0;
        $stmt = $conn->prepare('DELETE FROM class_students WHERE class_id=? AND student_id=?');
        $stmt->bind_param('ii', $class_id, $student_id);
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