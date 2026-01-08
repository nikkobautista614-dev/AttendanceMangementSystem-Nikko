document.addEventListener('DOMContentLoaded', function() {
    const reportTable = document.querySelector('#reportTable tbody');
    const reportFilterForm = document.getElementById('reportFilterForm');
    const classSelect = document.getElementById('reportClassSelect');
    const studentSelect = document.getElementById('reportStudentSelect');

    function fetchClasses() {
        fetch('../backend/classes.php')
            .then(res => res.json())
            .then(data => {
                classSelect.innerHTML = '<option value="">All Classes</option>';
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
                studentSelect.innerHTML = '<option value="">All Students</option>';
                data.forEach(student => {
                    const option = document.createElement('option');
                    option.value = student.id;
                    option.textContent = student.name;
                    studentSelect.appendChild(option);
                });
            });
    }

    function fetchReports(class_id = '', student_id = '') {
        let url = '../backend/reports.php?';
        if (class_id) url += 'class_id=' + class_id + '&';
        if (student_id) url += 'student_id=' + student_id;
        fetch(url)
            .then(res => res.json())
            .then(data => {
                reportTable.innerHTML = '';
                data.forEach(row => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${row.student_name}</td>
                        <td>${row.class_name}</td>
                        <td>${row.total}</td>
                        <td>${row.presents}</td>
                        <td>${row.absents}</td>
                        <td>${row.lates}</td>
                    `;
                    reportTable.appendChild(tr);
                });
            });
    }

    reportFilterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const class_id = classSelect.value;
        const student_id = studentSelect.value;
        fetchReports(class_id, student_id);
    });

    fetchClasses();
    fetchStudents();
    fetchReports();
});
