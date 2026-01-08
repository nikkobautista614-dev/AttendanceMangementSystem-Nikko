<?php
// backend/seed_fake_data.php
require_once 'db.php';

// Ensure class_students table exists
$conn->query("CREATE TABLE IF NOT EXISTS class_students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT NOT NULL,
    student_id INT NOT NULL,
    UNIQUE KEY unique_class_student (class_id, student_id),
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
)");

// Fake teachers
$teachers = [
    ['Alice Johnson', 'alice.johnson@example.com'],
    ['Bob Smith', 'bob.smith@example.com'],
    ['Carol Lee', 'carol.lee@example.com']
];
foreach ($teachers as $t) {
    $stmt = $conn->prepare('INSERT IGNORE INTO teachers (name, email) VALUES (?, ?)');
    $stmt->bind_param('ss', $t[0], $t[1]);
    $stmt->execute();
}

// Get teacher IDs
$teacher_ids = [];
$result = $conn->query('SELECT id FROM teachers');
while ($row = $result->fetch_assoc()) {
    $teacher_ids[] = $row['id'];
}

// Fake classes
$classes = [
    ['Math 101', $teacher_ids[0] ?? 1],
    ['Science 201', $teacher_ids[1] ?? 1],
    ['History 301', $teacher_ids[2] ?? 1]
];
foreach ($classes as $c) {
    $stmt = $conn->prepare('INSERT IGNORE INTO classes (name, teacher_id) VALUES (?, ?)');
    $stmt->bind_param('si', $c[0], $c[1]);
    $stmt->execute();
}

// Fake students

$first_names = ['John', 'Jane', 'Mike', 'Emily', 'Chris', 'Alex', 'Sam', 'Taylor', 'Jordan', 'Morgan', 'Casey', 'Drew', 'Jamie', 'Robin', 'Pat', 'Lee', 'Dana', 'Cameron', 'Avery', 'Riley'];
$last_names = ['Doe', 'Smith', 'Brown', 'White', 'Green', 'Black', 'Gray', 'Moore', 'King', 'Wright', 'Hill', 'Scott', 'Young', 'Allen', 'Adams', 'Baker', 'Clark', 'Evans', 'Hall', 'Lewis'];
for ($i = 1; $i <= 200; $i++) {
    $fname = $first_names[array_rand($first_names)];
    $lname = $last_names[array_rand($last_names)];
    $name = "$fname $lname";
    $email = strtolower($fname . "." . $lname . $i . "@example.com");
    $stmt = $conn->prepare('INSERT IGNORE INTO students (name, email) VALUES (?, ?)');
    $stmt->bind_param('ss', $name, $email);
    $stmt->execute();
    // Assign student to a random class
    $student_id = $conn->insert_id;
    if ($student_id == 0) {
        // If IGNORE, get the existing student id
        $res = $conn->query("SELECT id FROM students WHERE email='$email' LIMIT 1");
        $row = $res->fetch_assoc();
        $student_id = $row['id'];
    }
    $class_index = array_rand($classes);
    $class_id = $classes[$class_index][1];
    $stmt2 = $conn->prepare('INSERT IGNORE INTO class_students (class_id, student_id) VALUES (?, ?)');
    $stmt2->bind_param('ii', $class_id, $student_id);
    $stmt2->execute();
}

$conn->close();
echo "Fake data seeded successfully.";
?>