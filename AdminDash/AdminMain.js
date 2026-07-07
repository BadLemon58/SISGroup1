document.addEventListener('DOMContentLoaded', () => {
    // --- State Management ---
    let students = [
        { id: 'S-1001', name: 'Alice Smith', email: 'alice@jsu.edu', course: 'BS Computer Science' },
        { id: 'S-1002', name: 'Bob Johnson', email: 'bob@jsu.edu', course: 'BS Information Tech' }
    ];

    let pendingEnrollments = [
        { id: 'E-001', name: 'Charlie Brown', email: 'charlie@gmail.com', course: 'BS Computer Science', date: '2026-07-01' },
        { id: 'E-002', name: 'Diana Prince', email: 'diana@yahoo.com', course: 'BS Information Tech', date: '2026-07-02' }
    ];

    let courses = [
        { id: 'C-101', name: 'Intro to Programming', instructor: 'Dr. Alan Turing', capacity: 30, days: 'Mon/Wed/Fri', startTime: '09:00', endTime: '10:30' },
        { id: 'C-102', name: 'Data Structures', instructor: 'Prof. Ada Lovelace', capacity: 25, days: 'Tue/Thu', startTime: '11:00', endTime: '13:00' }
    ];

    let studentCurrentPage = 1;
    const studentRowsPerPage = 5;

    // --- DOM Elements ---
    const navLinks = document.querySelectorAll('.nav-links li:not(.logout-link)');
    const dashboardSections = document.querySelectorAll('.dashboard-section');
    const pendingBadge = document.getElementById('pendingBadge');

    const studentsTableBody = document.querySelector('#studentsTable tbody');
    const enrollmentList = document.getElementById('enrollmentList');
    const coursesGrid = document.getElementById('coursesGrid');

    // Modals
    const studentModal = document.getElementById('studentModal');
    const courseModal = document.getElementById('courseModal');
    const closeBtns = document.querySelectorAll('.close-modal, .close-modal-btn');

    // Forms
    const studentForm = document.getElementById('studentForm');
    const courseForm = document.getElementById('courseForm');

    // Buttons
    const addStudentBtn = document.getElementById('addStudentBtn');
    const addCourseBtn = document.getElementById('addCourseBtn');

    // --- Initialization ---
    init();

    function init() {
        renderStudents();
        renderPendingEnrollments();
        renderCourses();
        setupEventListeners();
    }

    // --- Navigation Logic ---
    function setupEventListeners() {
        // Sidebar Navigation
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                // Remove active class from all
                navLinks.forEach(l => l.classList.remove('active'));
                dashboardSections.forEach(s => s.classList.remove('active-section'));
                
                // Add active class to clicked
                link.classList.add('active');
                const targetId = link.getAttribute('data-target');
                document.getElementById(targetId).classList.add('active-section');
            });
        });

        // Modal Close logic
        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const modalId = btn.getAttribute('data-modal');
                if(modalId) {
                    closeModal(document.getElementById(modalId));
                } else {
                    // Fallback for icons without data attribute directly
                    btn.closest('.modal-overlay').classList.remove('active');
                }
            });
        });

        // Add Buttons
        addStudentBtn.addEventListener('click', () => openStudentModal());
        addCourseBtn.addEventListener('click', () => openCourseModal());

        // Form Submissions
        studentForm.addEventListener('submit', handleStudentSubmit);
        courseForm.addEventListener('submit', handleCourseSubmit);

        // Day Selector Logic
        document.querySelectorAll('.day-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.currentTarget.classList.toggle('selected');
                updateHiddenDaysInput();
            });
        });
    }

    function updateHiddenDaysInput() {
        const selected = Array.from(document.querySelectorAll('.day-btn.selected'))
                              .map(btn => btn.getAttribute('data-day'));
        document.getElementById('courseDays').value = selected.join('/');
    }

    // --- Render Functions ---
    function renderStudents() {
        studentsTableBody.innerHTML = '';
        const tableContainer = document.querySelector('.table-card');
        
        // Remove existing pagination if any
        const existingPagination = tableContainer.querySelector('.pagination-controls');
        if (existingPagination) {
            existingPagination.remove();
        }

        if (students.length === 0) {
            studentsTableBody.innerHTML = `<tr class="table-empty-state"><td colspan="5">No students found.</td></tr>`;
            return;
        }

        const totalPages = Math.ceil(students.length / studentRowsPerPage);
        if (studentCurrentPage > totalPages) studentCurrentPage = totalPages;
        if (studentCurrentPage < 1) studentCurrentPage = 1;

        const startIndex = (studentCurrentPage - 1) * studentRowsPerPage;
        const endIndex = startIndex + studentRowsPerPage;
        const paginatedStudents = students.slice(startIndex, endIndex);

        paginatedStudents.forEach(student => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${student.id}</td>
                <td><strong>${student.name}</strong></td>
                <td>${student.email}</td>
                <td><span class="badge" style="background-color: var(--bg-hover); color: var(--text-primary); font-weight: normal; padding: 4px 10px;">${student.course}</span></td>
                <td class="actions">
                    <button class="btn-icon edit-student-btn" data-id="${student.id}" title="Edit"><i class='bx bx-edit'></i></button>
                    <button class="btn-icon remove-student-btn" data-id="${student.id}" title="Remove"><i class='bx bx-trash' style="color: var(--accent-danger);"></i></button>
                </td>
            `;
            studentsTableBody.appendChild(tr);
        });

        if (totalPages > 1) {
            const paginationContainer = document.createElement('div');
            paginationContainer.className = 'pagination-controls';
            paginationContainer.innerHTML = `
                <button class="prev-btn" ${studentCurrentPage === 1 ? 'disabled' : ''}>Previous</button>
                <span class="pagination-info">Page ${studentCurrentPage} of ${totalPages}</span>
                <button class="next-btn" ${studentCurrentPage === totalPages ? 'disabled' : ''}>Next</button>
            `;
            
            tableContainer.appendChild(paginationContainer);

            paginationContainer.querySelector('.prev-btn').addEventListener('click', () => {
                if (studentCurrentPage > 1) {
                    studentCurrentPage--;
                    renderStudents();
                }
            });

            paginationContainer.querySelector('.next-btn').addEventListener('click', () => {
                if (studentCurrentPage < totalPages) {
                    studentCurrentPage++;
                    renderStudents();
                }
            });
        }

        // Attach action listeners
        document.querySelectorAll('.edit-student-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                openStudentModal(id);
            });
        });

        document.querySelectorAll('.remove-student-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                if(confirm('Are you sure you want to remove this student?')) {
                    students = students.filter(s => s.id !== id);
                    renderStudents();
                }
            });
        });
    }

    function renderPendingEnrollments() {
        enrollmentList.innerHTML = '';
        pendingBadge.textContent = pendingEnrollments.length;

        if (pendingEnrollments.length === 0) {
            enrollmentList.innerHTML = `<div class="empty-state"><i class='bx bx-check-circle'></i><p>All caught up! No pending enrollments.</p></div>`;
            return;
        }

        pendingEnrollments.forEach(app => {
            const div = document.createElement('div');
            div.className = 'enrollment-item';
            div.innerHTML = `
                <div class="applicant-info">
                    <span class="applicant-name">${app.name}</span>
                    <span class="applicant-details">${app.email} • ${app.course}</span>
                    <span class="applicant-details" style="font-size: 0.8rem;">Applied on: ${app.date}</span>
                </div>
                <div class="applicant-actions">
                    <button class="btn-danger reject-btn" data-id="${app.id}">Reject</button>
                    <button class="btn-success accept-btn" data-id="${app.id}">Accept</button>
                </div>
            `;
            enrollmentList.appendChild(div);
        });

        // Attach action listeners
        document.querySelectorAll('.accept-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                acceptEnrollment(id);
            });
        });

        document.querySelectorAll('.reject-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                pendingEnrollments = pendingEnrollments.filter(p => p.id !== id);
                renderPendingEnrollments();
            });
        });
    }

    function formatTime(timeStr) {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':');
        const h = parseInt(hours, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const formattedH = h % 12 || 12;
        return `${formattedH}:${minutes} ${ampm}`;
    }

    function renderCourses() {
        coursesGrid.innerHTML = '';
        if (courses.length === 0) {
            coursesGrid.innerHTML = `<div class="empty-state" style="grid-column: 1/-1;"><p>No courses created yet.</p></div>`;
            return;
        }

        courses.forEach(course => {
            const div = document.createElement('div');
            div.className = 'course-card';
            div.innerHTML = `
                <div class="course-header">
                    <div>
                        <h3 class="course-title">${course.name}</h3>
                        <span class="course-instructor"><i class='bx bx-user-voice'></i> ${course.instructor}</span>
                    </div>
                    <button class="btn-icon edit-course-btn" data-id="${course.id}" title="Edit Schedule"><i class='bx bx-edit'></i></button>
                </div>
                <div class="course-schedule">
                    <div class="schedule-item">
                        <i class='bx bx-group'></i>
                        <span>Capacity: ${course.capacity}</span>
                    </div>
                    <div class="schedule-item">
                        <i class='bx bx-calendar'></i>
                        <span>${course.days}</span>
                    </div>
                    <div class="schedule-item">
                        <i class='bx bx-time'></i>
                        <span>${formatTime(course.startTime)} - ${formatTime(course.endTime)}</span>
                    </div>
                </div>
            `;
            coursesGrid.appendChild(div);
        });

        // Attach action listeners
        document.querySelectorAll('.edit-course-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                openCourseModal(id);
            });
        });
    }

    // --- Student Logic ---
    function openStudentModal(id = null) {
        const title = document.getElementById('studentModalTitle');
        if (id) {
            const student = students.find(s => s.id === id);
            title.textContent = 'Edit Student';
            document.getElementById('studentId').value = student.id;
            document.getElementById('studentName').value = student.name;
            document.getElementById('studentEmail').value = student.email;
            document.getElementById('studentCourse').value = student.course;
        } else {
            title.textContent = 'Add New Student';
            studentForm.reset();
            document.getElementById('studentId').value = '';
        }
        studentModal.classList.add('active');
    }

    function handleStudentSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('studentId').value;
        const name = document.getElementById('studentName').value;
        const email = document.getElementById('studentEmail').value;
        const course = document.getElementById('studentCourse').value;

        if (id) {
            // Edit
            const index = students.findIndex(s => s.id === id);
            students[index] = { id, name, email, course };
        } else {
            // Add
            const newId = 'S-' + Math.floor(1000 + Math.random() * 9000);
            students.push({ id: newId, name, email, course });
        }

        renderStudents();
        closeModal(studentModal);
    }

    // --- Enrollment Logic ---
    function acceptEnrollment(id) {
        const app = pendingEnrollments.find(p => p.id === id);
        if (app) {
            // Move to students
            const newId = 'S-' + Math.floor(1000 + Math.random() * 9000);
            students.push({
                id: newId,
                name: app.name,
                email: app.email,
                course: app.course
            });
            
            // Remove from pending
            pendingEnrollments = pendingEnrollments.filter(p => p.id !== id);
            
            // Re-render
            renderStudents();
            renderPendingEnrollments();
            
            // Optional: alert or toast
            // alert(`${app.name} has been enrolled successfully!`);
        }
    }

    // --- Course Logic ---
    function openCourseModal(id = null) {
        const title = document.getElementById('courseModalTitle');
        // Clear all selected days first
        document.querySelectorAll('.day-btn').forEach(btn => btn.classList.remove('selected'));
        
        if (id) {
            const course = courses.find(c => c.id === id);
            title.textContent = 'Edit Course Schedule';
            document.getElementById('courseId').value = course.id;
            document.getElementById('courseName').value = course.name;
            document.getElementById('courseInstructor').value = course.instructor;
            document.getElementById('courseCapacity').value = course.capacity;
            document.getElementById('courseDays').value = course.days;
            document.getElementById('courseStartTime').value = course.startTime || '';
            document.getElementById('courseEndTime').value = course.endTime || '';
            
            // Highlight selected days
            const daysArr = course.days.split('/');
            document.querySelectorAll('.day-btn').forEach(btn => {
                if (daysArr.includes(btn.getAttribute('data-day'))) {
                    btn.classList.add('selected');
                }
            });
        } else {
            title.textContent = 'Create New Course';
            courseForm.reset();
            document.getElementById('courseId').value = '';
            document.getElementById('courseDays').value = '';
            document.getElementById('courseStartTime').value = '';
            document.getElementById('courseEndTime').value = '';
        }
        courseModal.classList.add('active');
    }

    function handleCourseSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('courseId').value;
        const name = document.getElementById('courseName').value;
        const instructor = document.getElementById('courseInstructor').value;
        const capacity = document.getElementById('courseCapacity').value;
        const days = document.getElementById('courseDays').value;
        const startTime = document.getElementById('courseStartTime').value;
        const endTime = document.getElementById('courseEndTime').value;

        if (!days) {
            alert('Please select at least one schedule day.');
            return;
        }

        if (id) {
            // Edit
            const index = courses.findIndex(c => c.id === id);
            courses[index] = { id, name, instructor, capacity, days, startTime, endTime };
        } else {
            // Add
            const newId = 'C-' + Math.floor(100 + Math.random() * 900);
            courses.push({ id: newId, name, instructor, capacity, days, startTime, endTime });
        }

        renderCourses();
        closeModal(courseModal);
    }

    // --- Utility ---
    function closeModal(modal) {
        modal.classList.remove('active');
    }
});
