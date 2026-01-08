<?php
// backend/classes.php
require_once 'db.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $result = $conn->query('SELECT classes.id, classes.name, teachers.name AS teacher_name FROM classes LEFT JOIN teachers ON classes.teacher_id = teachers.id');
        $classes = [];
        while ($row = $result->fetch_assoc()) {
            $classes[] = $row;
        }
        echo json_encode($classes);
        break;
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $name = $data['name'] ?? '';
        $teacher_id = $data['teacher_id'] ?? null;
        $stmt = $conn->prepare('INSERT INTO classes (name, teacher_id) VALUES (?, ?)');
        $stmt->bind_param('si', $name, $teacher_id);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'id' => $stmt->insert_id]);
        } else {
            echo json_encode(['success' => false, 'error' => $stmt->error]);
        }
        break;
    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'] ?? 0;
        $name = $data['name'] ?? '';
        $teacher_id = $data['teacher_id'] ?? null;
        $stmt = $conn->prepare('UPDATE classes SET name=?, teacher_id=? WHERE id=?');
        $stmt->bind_param('sii', $name, $teacher_id, $id);
        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => $stmt->error]);
        }
        break;
    case 'DELETE':
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'] ?? 0;
        $stmt = $conn->prepare('DELETE FROM classes WHERE id=?');
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