document.addEventListener('DOMContentLoaded', () => {
    
    // Sidebar active state is handled statically in each HTML file


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

// Global Table Utility for Pagination and Empty State
window.setupTablePagination = function(tableSelector, rowsPerPage = 5) {
    const table = document.querySelector(tableSelector);
    if (!table) return;

    const tbody = table.querySelector('tbody');
    if (!tbody) return;

    let allRows = Array.from(tbody.querySelectorAll('tr:not(.table-empty-state)'));
    let currentPage = 1;

    function updateEmptyState() {
        allRows = Array.from(tbody.querySelectorAll('tr:not(.table-empty-state)'));
        const visibleRows = allRows.filter(r => !r.hasAttribute('data-filtered-out'));
        let emptyRow = tbody.querySelector('.table-empty-state');
        
        if (visibleRows.length === 0) {
            if (!emptyRow) {
                const colCount = table.querySelector('thead tr') ? table.querySelector('thead tr').children.length : 100;
                emptyRow = document.createElement('tr');
                emptyRow.className = 'table-empty-state';
                emptyRow.innerHTML = `<td colspan="${colCount}">No data available to display.</td>`;
                tbody.appendChild(emptyRow);
            }
            emptyRow.style.display = '';
        } else if (emptyRow) {
            emptyRow.style.display = 'none';
        }
        return visibleRows;
    }

    let paginationContainer = table.nextElementSibling;
    if (!paginationContainer || !paginationContainer.classList.contains('pagination-controls')) {
        paginationContainer = document.createElement('div');
        paginationContainer.className = 'pagination-controls';
        // Append after the table (or its responsive wrapper)
        if (table.parentElement.classList.contains('table-responsive')) {
            table.parentElement.parentElement.appendChild(paginationContainer);
        } else {
            table.parentElement.appendChild(paginationContainer);
        }
    }

    function renderPagination() {
        const visibleRows = updateEmptyState();
        const totalPages = Math.ceil(visibleRows.length / rowsPerPage);
        
        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
            visibleRows.forEach(r => r.style.display = '');
            return;
        }

        paginationContainer.style.display = 'flex';
        
        // Ensure currentPage is valid
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        paginationContainer.innerHTML = `
            <button class="prev-btn" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
            <span class="pagination-info">Page ${currentPage} of ${totalPages}</span>
            <button class="next-btn" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
        `;

        // Hide all visible rows, then only display current page
        visibleRows.forEach((row, index) => {
            if (index >= (currentPage - 1) * rowsPerPage && index < currentPage * rowsPerPage) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });

        paginationContainer.querySelector('.prev-btn').addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderPagination();
            }
        });

        paginationContainer.querySelector('.next-btn').addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderPagination();
            }
        });
    }

    // Expose a refresh method to re-render when filtering changes
    table.refreshPagination = function() {
        currentPage = 1; // Reset to page 1 on filter change
        renderPagination();
    };

    // Initial render
    renderPagination();
};
