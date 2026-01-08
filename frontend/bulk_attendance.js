document.addEventListener('DOMContentLoaded', function() {
    const classSelect = document.getElementById('bulkClassSelect');
    const dateInput = document.getElementById('bulkAttendanceDate');
    const loadStudentsBtn = document.getElementById('loadStudentsBtn');
    const bulkAttendanceSection = document.getElementById('bulkAttendanceSection');
    const bulkAttendanceTable = document.querySelector('#bulkAttendanceTable tbody');
    const markAllPresentBtn = document.getElementById('markAllPresent');
    const clearAllBtn = document.getElementById('clearAll');
    const submitBulkAttendance = document.getElementById('submitBulkAttendance');

    // Set today's date by default
    dateInput.valueAsDate = new Date();

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

    function loadStudents() {
        const class_id = classSelect.value;
        if (!class_id) return;
        fetch(`../backend/class_students.php?class_id=${class_id}`)
            .then(res => res.json())
            .then(data => {
                bulkAttendanceTable.innerHTML = '';
                data.forEach(student => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${student.name}<input type="hidden" name="student_id[]" value="${student.id}"></td>
                        <td>
                            <select name="status[]">
                                <option value="Present">Present</option>
                                <option value="Absent">Absent</option>
                                <option value="Late">Late</option>
                            </select>
                        </td>
                    `;
                    bulkAttendanceTable.appendChild(row);
                });
                bulkAttendanceSection.style.display = 'block';
            });
    }

    loadStudentsBtn.addEventListener('click', loadStudents);

    markAllPresentBtn.addEventListener('click', function() {
        document.querySelectorAll('#bulkAttendanceTable select').forEach(sel => sel.value = 'Present');
    });
    clearAllBtn.addEventListener('click', function() {
        document.querySelectorAll('#bulkAttendanceTable select').forEach(sel => sel.value = 'Absent');
    });

    submitBulkAttendance.addEventListener('submit', function(e) {
        e.preventDefault();
        const class_id = classSelect.value;
        const date = dateInput.value;
        const student_ids = Array.from(document.getElementsByName('student_id[]')).map(input => input.value);
        const statuses = Array.from(document.getElementsByName('status[]')).map(sel => sel.value);
        const requests = student_ids.map((id, i) => {
            return fetch('../backend/attendance.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ student_id: id, class_id, date, status: statuses[i] })
            });
        });
        Promise.all(requests).then(() => {
            alert('Attendance submitted!');
            submitBulkAttendance.reset();
            bulkAttendanceSection.style.display = 'none';
        });
    });

    fetchClasses();
});
