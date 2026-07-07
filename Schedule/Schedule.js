// Schedule page functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeSchedulePage();
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

// Search/Filter functionality
function filterSchedule(searchTerm) {
    const rows = document.querySelectorAll('.schedule-table tbody tr');
    const term = searchTerm.toLowerCase();
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
    });
}
