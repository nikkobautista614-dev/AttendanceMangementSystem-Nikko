<?php
// Run this ONCE to create the class_students table
require_once 'db.php';

$sql = "CREATE TABLE IF NOT EXISTS class_students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT NOT NULL,
    student_id INT NOT NULL,
    UNIQUE KEY unique_class_student (class_id, student_id),
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
) ENGINE=InnoDB;";

if ($conn->query($sql) === TRUE) {
    echo "class_students table created successfully.";
} else {
    echo "Error creating table: " . $conn->error;
}

$conn->close();
?>
