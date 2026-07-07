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
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
    });
}
