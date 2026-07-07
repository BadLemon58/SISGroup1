// Clearance page functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeClearancePage();
});

function initializeClearancePage() {
    // Handle dropdown filters
    setupFilterHandlers();
    // Add table row interactivity
    addTableRowHover();
}

function setupFilterHandlers() {
    const schoolYearSelect = document.getElementById('schoolYear');
    const semesterSelect = document.getElementById('semester');

    if (schoolYearSelect) {
        schoolYearSelect.addEventListener('change', function() {
            filterClearanceData();
        });
    }

    if (semesterSelect) {
        semesterSelect.addEventListener('change', function() {
            filterClearanceData();
        });
    }
}

function filterClearanceData() {
    const schoolYear = document.getElementById('schoolYear').value;
    const semester = document.getElementById('semester').value;
    
    console.log('Filtering by School Year:', schoolYear);
    console.log('Filtering by Semester:', semester);
    
    // You can add actual filtering logic here to show/hide rows
    // based on the selected values
}

function addTableRowHover() {
    const rows = document.querySelectorAll('.clearance-table tbody tr');
    rows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.opacity = '0.95';
        });
        row.addEventListener('mouseleave', function() {
            this.style.opacity = '1';
        });
    });
}

// Search functionality
function searchClearance(searchTerm) {
    const rows = document.querySelectorAll('.clearance-table tbody tr');
    const term = searchTerm.toLowerCase();

    rows.forEach(row => {
        if (row.classList.contains('table-empty-state')) return;
        const text = row.textContent.toLowerCase();
        if (text.includes(term)) {
            row.removeAttribute('data-filtered-out');
        } else {
            row.setAttribute('data-filtered-out', 'true');
        }
    });
    const table = document.querySelector('.clearance-table');
    if (table && typeof table.refreshPagination === 'function') {
        table.refreshPagination();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Load Profile from LocalStorage
    const storedProfile = localStorage.getItem('studentProfile');
    if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        const nameEl = document.querySelector('.profile-name');
        const idEl = document.querySelector('.profile-id');
        const courseEl = document.querySelector('.profile-course');
        const avatarEl = document.querySelector('.profile-avatar span');
        
        if (nameEl) nameEl.textContent = profile.fullName;
        if (idEl) idEl.textContent = 'ID: ' + profile.studentId;
        if (courseEl) courseEl.textContent = profile.course;
        
        if (avatarEl && profile.fullName) {
            const parts = profile.fullName.trim().split(/\s+/);
            let initials = '';
            if (parts.length >= 2) {
                initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
            } else if (parts.length === 1) {
                initials = parts[0].substring(0, 2).toUpperCase();
            }
            avatarEl.textContent = initials;
        }
    }

    if (typeof window.setupTablePagination === 'function') {
        window.setupTablePagination('.clearance-table', 5);
    }
});
