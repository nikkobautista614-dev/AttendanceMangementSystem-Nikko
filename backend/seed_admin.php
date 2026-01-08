<?php
// backend/seed_admin.php
require_once 'db.php';

$username = 'admin';
$password = password_hash('admin123', PASSWORD_DEFAULT);

$stmt = $conn->prepare('INSERT INTO admins (username, password) VALUES (?, ?)');
$stmt->bind_param('ss', $username, $password);
if ($stmt->execute()) {
    echo "Admin user created successfully.";
} else {
    echo "Error: " . $stmt->error;
}
$stmt->close();
$conn->close();
?>