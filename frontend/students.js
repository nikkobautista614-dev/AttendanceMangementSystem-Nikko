document.addEventListener('DOMContentLoaded', function() {
    const studentsTable = document.querySelector('#studentsTable tbody');
    const addStudentForm = document.getElementById('addStudentForm');

    let allStudents = [];
    function renderStudents(students) {
        studentsTable.innerHTML = '';
        students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>
                    <button onclick="deleteStudent(${student.id})" class="btn">Delete</button>
                </td>
            `;
            studentsTable.appendChild(row);
        });
    }
    function fetchStudents() {
        fetch('../backend/students.php')
            .then(res => res.json())
            .then(data => {
                allStudents = data;
                renderStudents(allStudents);
            });
    }
    document.getElementById('studentSearch').addEventListener('input', function(e) {
        const term = e.target.value.toLowerCase();
        const filtered = allStudents.filter(student =>
            student.name.toLowerCase().includes(term) ||
            (student.email && student.email.toLowerCase().includes(term))
        );
        renderStudents(filtered);
    });

    addStudentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('studentName').value;
        const email = document.getElementById('studentEmail').value;
        fetch('../backend/students.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email })
        })
        .then(res => res.json())
        .then(() => {
            addStudentForm.reset();
            fetchStudents();
        });
    });

    let pendingDeleteId = null;
    window.deleteStudent = function(id) {
        pendingDeleteId = id;
        document.getElementById('confirmModal').style.display = 'flex';
    };
    document.getElementById('modalConfirmBtn').onclick = function() {
        if (pendingDeleteId) {
            fetch('../backend/students.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: pendingDeleteId })
            })
            .then(res => res.json())
            .then(() => {
                fetchStudents();
                document.getElementById('confirmModal').style.display = 'none';
                pendingDeleteId = null;
            });
        }
    };
    document.getElementById('modalCancelBtn').onclick = function() {
        document.getElementById('confirmModal').style.display = 'none';
        pendingDeleteId = null;
    };

    fetchStudents();
});
