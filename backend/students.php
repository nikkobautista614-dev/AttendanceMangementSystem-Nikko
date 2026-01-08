<?php
// backend/students.php
require_once 'db.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // List all students
        $result = $conn->query('SELECT * FROM students');
        $students = [];
        while ($row = $result->fetch_assoc()) {
            $students[] = $row;
        }
        echo json_encode($students);
        break;
    case 'POST':
        // Add a new student
        $data = json_decode(file_get_contents('php://input'), true);
        $name = $data['name'] ?? '';
        $email = $data['email'] ?? '';
        $stmt = $conn->prepare('INSERT INTO students (name, email) VALUES (?, ?)');
        $stmt->bind_param('ss', $name, $email);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'id' => $stmt->insert_id]);
        } else {
            echo json_encode(['success' => false, 'error' => $stmt->error]);
        }
        break;
    case 'PUT':
        // Update a student
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'] ?? 0;
        $name = $data['name'] ?? '';
        $email = $data['email'] ?? '';
        $stmt = $conn->prepare('UPDATE students SET name=?, email=? WHERE id=?');
        $stmt->bind_param('ssi', $name, $email, $id);
        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => $stmt->error]);
        }
        break;
    case 'DELETE':
        // Delete a student
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'] ?? 0;
        $stmt = $conn->prepare('DELETE FROM students WHERE id=?');
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