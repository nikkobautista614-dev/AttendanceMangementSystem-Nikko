// enroll.js - Handles class enrollment UI logic

document.addEventListener('DOMContentLoaded', () => {
    const classSelect = document.getElementById('classSelect');
    const allStudentsList = document.getElementById('allStudents');
    const enrolledStudentsList = document.getElementById('enrolledStudents');
    const studentSearch = document.getElementById('studentSearch');
    const enrolledSearch = document.getElementById('enrolledSearch');

    let allStudents = [];
    let enrolledStudents = [];
    let currentClassId = null;

    // Fetch all classes
    fetch('../backend/classes.php')
        .then(res => res.json())
        .then(classes => {
            classSelect.innerHTML = '';
            classes.forEach(cls => {
                const opt = document.createElement('option');
                opt.value = cls.id;
                opt.textContent = `${cls.name} (${cls.teacher_name})`;
                classSelect.appendChild(opt);
            });
            if (classes.length > 0) {
                currentClassId = classes[0].id;
                loadEnrolled();
            }
        });

    // Fetch all students
    fetch('../backend/students.php')
        .then(res => res.json())
        .then(students => {
            allStudents = students;
            renderAllStudents();
        });

    // When class changes
    classSelect.addEventListener('change', () => {
        currentClassId = classSelect.value;
        loadEnrolled();
    });

    function loadEnrolled() {
        fetch(`../backend/class_students.php?class_id=${currentClassId}`)
            .then(res => res.json())
            .then(students => {
                enrolledStudents = students;
                renderAllStudents();
                renderEnrolledStudents();
            });
    }

    function renderAllStudents() {
        const filter = studentSearch.value.toLowerCase();
        allStudentsList.innerHTML = '';
        allStudents
            .filter(s => !enrolledStudents.some(e => e.id == s.id))
            .filter(s => s.name.toLowerCase().includes(filter) || s.email.toLowerCase().includes(filter))
            .forEach(s => {
                const li = document.createElement('li');
                li.textContent = `${s.name} (${s.email})`;
                li.className = 'enroll-item';
                li.title = 'Click to enroll';
                li.addEventListener('click', () => enrollStudent(s.id));
                allStudentsList.appendChild(li);
            });
    }

    function renderEnrolledStudents() {
        const filter = enrolledSearch.value.toLowerCase();
        enrolledStudentsList.innerHTML = '';
        enrolledStudents
            .filter(s => s.name.toLowerCase().includes(filter) || s.email.toLowerCase().includes(filter))
            .forEach(s => {
                const li = document.createElement('li');
                li.textContent = `${s.name} (${s.email})`;
                li.className = 'enroll-item enrolled';
                li.title = 'Click to remove';
                li.addEventListener('click', () => removeStudent(s.id));
                enrolledStudentsList.appendChild(li);
            });
    }

    function enrollStudent(studentId) {
        fetch('../backend/class_students.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ class_id: currentClassId, student_id: studentId })
        }).then(() => loadEnrolled());
    }

    function removeStudent(studentId) {
        fetch('../backend/class_students.php', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ class_id: currentClassId, student_id: studentId })
        }).then(() => loadEnrolled());
    }

    studentSearch.addEventListener('input', renderAllStudents);
    enrolledSearch.addEventListener('input', renderEnrolledStudents);
});
