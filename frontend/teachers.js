document.addEventListener('DOMContentLoaded', function() {
    const teachersTable = document.querySelector('#teachersTable tbody');
    const addTeacherForm = document.getElementById('addTeacherForm');

    let allTeachers = [];
    function renderTeachers(teachers) {
        teachersTable.innerHTML = '';
        teachers.forEach(teacher => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${teacher.name}</td>
                <td>${teacher.email}</td>
                <td>
                    <button onclick="deleteTeacher(${teacher.id})" class="btn">Delete</button>
                </td>
            `;
            teachersTable.appendChild(row);
        });
    }
    function fetchTeachers() {
        fetch('../backend/teachers.php')
            .then(res => res.json())
            .then(data => {
                allTeachers = data;
                renderTeachers(allTeachers);
            });
    }
    document.getElementById('teacherSearch').addEventListener('input', function(e) {
        const term = e.target.value.toLowerCase();
        const filtered = allTeachers.filter(teacher =>
            teacher.name.toLowerCase().includes(term) ||
            (teacher.email && teacher.email.toLowerCase().includes(term))
        );
        renderTeachers(filtered);
    });

    addTeacherForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('teacherName').value;
        const email = document.getElementById('teacherEmail').value;
        fetch('../backend/teachers.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email })
        })
        .then(res => res.json())
        .then(() => {
            addTeacherForm.reset();
            fetchTeachers();
        });
    });

    let pendingDeleteId = null;
    window.deleteTeacher = function(id) {
        pendingDeleteId = id;
        document.getElementById('confirmModal').style.display = 'flex';
    };
    document.getElementById('modalConfirmBtn').onclick = function() {
        if (pendingDeleteId) {
            fetch('../backend/teachers.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: pendingDeleteId })
            })
            .then(res => res.json())
            .then(() => {
                fetchTeachers();
                document.getElementById('confirmModal').style.display = 'none';
                pendingDeleteId = null;
            });
        }
    };
    document.getElementById('modalCancelBtn').onclick = function() {
        document.getElementById('confirmModal').style.display = 'none';
        pendingDeleteId = null;
    };

    fetchTeachers();
});
