document.addEventListener('DOMContentLoaded', function() {
    const attendanceTable = document.querySelector('#attendanceTable tbody');
    const addAttendanceForm = document.getElementById('addAttendanceForm');
    const classSelect = document.getElementById('attendanceClassSelect');
    const studentSelect = document.getElementById('attendanceStudentSelect');
    const dateInput = document.getElementById('attendanceDate');

    function fetchClasses() {
        fetch('../backend/classes.php')
            .then(res => res.json())
            .then(data => {
                classSelect.innerHTML = '<option value="">Select Class</option>';
                data.forEach(cls => {
                    const option = document.createElement('option');
                    option.value = cls.id;
                    option.textContent = cls.name;
                    classSelect.appendChild(option);
                });
            });
    }

    function fetchStudents() {
        fetch('../backend/students.php')
            .then(res => res.json())
            .then(data => {
                studentSelect.innerHTML = '<option value="">Select Student</option>';
                data.forEach(student => {
                    const option = document.createElement('option');
                    option.value = student.id;
                    option.textContent = student.name;
                    studentSelect.appendChild(option);
                });
            });
    }

    function fetchAttendance() {
        fetch('../backend/attendance.php')
            .then(res => res.json())
            .then(data => {
                attendanceTable.innerHTML = '';
                data.forEach(record => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${record.student_name}</td>
                        <td>${record.class_name}</td>
                        <td>${record.date}</td>
                        <td>${record.status}</td>
                        <td>
                            <button onclick="deleteAttendance(${record.id})" class="btn">Delete</button>
                        </td>
                    `;
                    attendanceTable.appendChild(row);
                });
            });
    }

    addAttendanceForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const student_id = studentSelect.value;
        const class_id = classSelect.value;
        const date = dateInput.value;
        const status = document.getElementById('attendanceStatus').value;
        fetch('../backend/attendance.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ student_id, class_id, date, status })
        })
        .then(res => res.json())
        .then(() => {
            addAttendanceForm.reset();
            fetchAttendance();
        });
    });

    window.deleteAttendance = function(id) {
        if (confirm('Are you sure you want to delete this record?')) {
            fetch('../backend/attendance.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            })
            .then(res => res.json())
            .then(() => fetchAttendance());
        }
    };

    fetchClasses();
    fetchStudents();
    fetchAttendance();
});
