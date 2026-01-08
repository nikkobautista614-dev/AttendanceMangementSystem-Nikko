document.addEventListener('DOMContentLoaded', function() {
    const classesTable = document.querySelector('#classesTable tbody');
    const addClassForm = document.getElementById('addClassForm');
    const teacherSelect = document.getElementById('teacherSelect');

    function fetchTeachers() {
        fetch('../backend/teachers.php')
            .then(res => res.json())
            .then(data => {
                teacherSelect.innerHTML = '<option value="">Select Teacher</option>';
                data.forEach(teacher => {
                    const option = document.createElement('option');
                    option.value = teacher.id;
                    option.textContent = teacher.name;
                    teacherSelect.appendChild(option);
                });
            });
    }

    let allClasses = [];
    function renderClasses(classes) {
        classesTable.innerHTML = '';
        classes.forEach(cls => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cls.name}</td>
                <td>${cls.teacher_name || ''}</td>
                <td>
                    <button onclick="deleteClass(${cls.id})" class="btn">Delete</button>
                </td>
            `;
            classesTable.appendChild(row);
        });
    }
    function fetchClasses() {
        fetch('../backend/classes.php')
            .then(res => res.json())
            .then(data => {
                allClasses = data;
                renderClasses(allClasses);
            });
    }
    document.getElementById('classSearch').addEventListener('input', function(e) {
        const term = e.target.value.toLowerCase();
        const filtered = allClasses.filter(cls =>
            cls.name.toLowerCase().includes(term) ||
            (cls.teacher_name && cls.teacher_name.toLowerCase().includes(term))
        );
        renderClasses(filtered);
    });

    addClassForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('className').value;
        const teacher_id = teacherSelect.value;
        fetch('../backend/classes.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, teacher_id })
        })
        .then(res => res.json())
        .then(() => {
            addClassForm.reset();
            fetchClasses();
        });
    });

    let pendingDeleteId = null;
    window.deleteClass = function(id) {
        pendingDeleteId = id;
        document.getElementById('confirmModal').style.display = 'flex';
    };
    document.getElementById('modalConfirmBtn').onclick = function() {
        if (pendingDeleteId) {
            fetch('../backend/classes.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: pendingDeleteId })
            })
            .then(res => res.json())
            .then(() => {
                fetchClasses();
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
    fetchClasses();
});
