# Class Attendance Monitoring System

## Introduction
This project is a web-based Class Attendance Monitoring System designed to help schools and teachers efficiently track, manage, and report student attendance. The system provides an easy-to-use interface for administrators to manage students, teachers, classes, and attendance records, as well as to enroll students in classes and generate attendance reports.

## Database Design

### ER Diagram
- **Student** (student_id, name, email)
- **Teacher** (teacher_id, name, email)
- **Class** (class_id, name, teacher_id)
- **Class_Students** (id, class_id, student_id)
- **Attendance** (attendance_id, class_id, student_id, date, status)

**Relationships:**
- Each class is taught by one teacher (one-to-many: Teacher → Class).
- Each class can have many students, and each student can be enrolled in many classes (many-to-many: Class ↔ Student via Class_Students).
- Attendance records link students to classes on specific dates (many-to-one: Attendance → Class, Attendance → Student).

### Table Descriptions
- **students**: Stores student information.
- **teachers**: Stores teacher information.
- **classes**: Stores class details and the assigned teacher.
- **class_students**: Maps students to classes (enrollments).
- **attendance**: Records attendance status (Present, Absent, Late) for each student in each class on each date.

## Web Interface

### Key Pages & Functionalities
- **Admin Login**: Secure login for administrators.
- **Dashboard**: Overview of system stats (students, teachers, classes, attendance records).
- **Students/Teachers/Classes**: CRUD management for each entity.
- **Enroll**: Dual-list UI to enroll/remove students from classes.
- **Bulk Attendance**: Mark attendance for all students in a class on a given date.
- **Attendance Records**: View, add, and manage individual attendance entries.
- **Reports**: Filterable attendance reports by class and student.

## Challenges and Learning
The most challenging part was connecting the database to the project folder and ensuring the PHP backend could reliably communicate with MySQL. This required careful configuration of database credentials, file paths, and permissions. Through this, I learned the importance of environment setup and troubleshooting database connection issues in web development.

---

**Thank you for reviewing this project!**
Attendance Monitoring System

Simple web-based class attendance system (HTML/CSS/JS + PHP backend + MySQL).

Quick setup (XAMPP on Windows):

1. Place this folder inside htdocs (example: `C:\xampp\htdocs\attendance-system`).
2. Start Apache & MySQL from XAMPP Control Panel.
3. Create a database named `attendance` in MySQL (or change settings in `backend/config.php`).
4. Import `db/schema.sql` in MySQL Workbench or run `backend/setup.php` from your browser to create tables and seed an admin account (password `admin123`).
5. Open `http://localhost/attendance-system/public/` in your browser.

Admin login: `http://localhost/attendance-system/public/login.html` (seed admin: `admin` / `admin123`).

Files of interest:
- `backend/` : PHP API, config & setup
- `db/schema.sql` : SQL schema
- `public/` : frontend pages, CSS, JS

Security notes: This is a starter template for learning. For production, enable HTTPS, stronger auth tokens, CSRF protections, and validate every input server-side.
