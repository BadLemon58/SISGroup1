// Schedule page functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeSchedulePage();
    
    // Export to CSV functionality
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', exportTableToCSV);
    }
});

function initializeSchedulePage() {
    // Add any interactive features here
    addTableRowHover();
    addSortingFunctionality();
}

function addTableRowHover() {
    const rows = document.querySelectorAll('.schedule-table tbody tr');
    rows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.opacity = '0.9';
        });
        row.addEventListener('mouseleave', function() {
            this.style.opacity = '1';
        });
    });
}

function addSortingFunctionality() {
    const headers = document.querySelectorAll('.schedule-table thead th');
    
    headers.forEach((header, index) => {
        header.style.cursor = 'pointer';
        header.addEventListener('click', function() {
            sortTable(index);
        });
    });
}

function sortTable(columnIndex) {
    const table = document.querySelector('.schedule-table');
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    const isAscending = table.getAttribute('data-sort-order') === 'asc';
    
    rows.sort((a, b) => {
        const cellA = a.cells[columnIndex].textContent.trim();
        const cellB = b.cells[columnIndex].textContent.trim();
        
        // Try to sort numerically if possible
        const numA = parseFloat(cellA);
        const numB = parseFloat(cellB);
        
        if (!isNaN(numA) && !isNaN(numB)) {
            return isAscending ? numB - numA : numA - numB;
        }
        
        // Otherwise sort alphabetically
        return isAscending ? cellB.localeCompare(cellA) : cellA.localeCompare(cellB);
    });
    
    rows.forEach(row => table.querySelector('tbody').appendChild(row));
    table.setAttribute('data-sort-order', isAscending ? 'desc' : 'asc');
}

function exportTableToCSV() {
    const table = document.querySelector('.schedule-table');
    if (!table) return;
    
    let csvContent = "";
    
    // Get headers
    const headers = Array.from(table.querySelectorAll('thead th')).map(th => `"${th.textContent.trim()}"`);
    csvContent += headers.join(",") + "\r\n";
    
    // Get rows
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    rows.forEach(row => {
        if (row.classList.contains('table-empty-state')) return;
        const rowData = Array.from(row.querySelectorAll('td')).map(td => {
            // Replace inner newlines with spaces and escape quotes
            let text = td.innerText.replace(/\n/g, ' ').replace(/"/g, '""');
            return `"${text}"`;
        });
        csvContent += rowData.join(",") + "\r\n";
    });
    
    // Create a blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "schedule_export.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show toast
    const toast = document.getElementById('toast');
    if (toast) {
        toast.classList.remove('hidden');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }
}

// Search/Filter functionality
function filterSchedule(searchTerm) {
    const rows = document.querySelectorAll('.schedule-table tbody tr');
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
    const table = document.querySelector('.schedule-table');
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
});
