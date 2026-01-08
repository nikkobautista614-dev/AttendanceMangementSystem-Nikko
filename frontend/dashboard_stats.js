// Fetch and display quick stats for dashboard
function fetchStat(url, elId) {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            document.getElementById(elId).textContent = data.length;
        });
}

document.addEventListener('DOMContentLoaded', function() {
    fetchStat('../backend/students.php', 'statStudents');
    fetchStat('../backend/teachers.php', 'statTeachers');
    fetchStat('../backend/classes.php', 'statClasses');
    fetchStat('../backend/attendance.php', 'statAttendance');
});
