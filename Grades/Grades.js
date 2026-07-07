
document.addEventListener('DOMContentLoaded', () => {
    // Populate sample averages and equivalents for each row
    const rows = document.querySelectorAll('.grades-table tbody tr');

    // deterministic-ish sample generator based on row index
    function sampleScore(index, offset = 0) {
        // simple pseudo-random but deterministic using sine
        const seed = (index + 1) * 987.654 + offset;
        const x = Math.abs(Math.sin(seed) * 10000);
        // produce a score between 75 and 95
        return Math.round((75 + (x % 21)) * 100) / 100;
    }

    function toEquivalent(score) {
        if (score >= 90) return 'A';
        if (score >= 85) return 'B+';
        if (score >= 80) return 'B';
        if (score >= 75) return 'C+';
        return 'D';
    }

    rows.forEach((tr, i) => {
        const cells = tr.querySelectorAll('td');
        if (cells.length < 12) return;

        const avg1 = sampleScore(i, 1);
        const avg2 = sampleScore(i, 2);
        cells[8].textContent = avg1.toFixed(2);
        cells[9].textContent = toEquivalent(avg1);
        cells[10].textContent = avg2.toFixed(2);
        cells[11].textContent = toEquivalent(avg2);
    });

    // Calculate totals and General Weighted Average (GWA)
    (function computeGWA() {
        const rows = document.querySelectorAll('.grades-table tbody tr');
        let totalUnits = 0;
        let sumWeighted = 0;
        let subjects = 0;

        rows.forEach(tr => {
            const cells = tr.querySelectorAll('td');
            if (!cells || cells.length < 11) return;
            // prefer the first units column (index 2), fallback to index 6
            let units = parseFloat(cells[2].textContent) || parseFloat(cells[6].textContent) || 0;
            // use the second average (index 10) if present, else first (index 😎
            let avg = parseFloat(cells[10].textContent) || parseFloat(cells[8].textContent) || 0;
            if (units > 0 && !isNaN(avg)) {
                totalUnits += units;
                sumWeighted += avg * units;
                subjects += 1;
            }
        });

        const gwa = totalUnits > 0 ? (sumWeighted / totalUnits) : 0;

        // Insert summary block inside the dedicated container if present, otherwise after notes or at end
        const notes = document.querySelector('.grade-notes-card');
        const summaryContainer = document.querySelector('.grade-summary-container');
        const container = document.querySelector('.feed-scrollable');
        if (!container) return;

        const summary = document.createElement('section');
        summary.className = 'page-card grade-summary';
        summary.innerHTML = `
            <div style="text-align:center;">
                <h2 class="gwa-title">General Weighted Average : <span class="gwa-value">${gwa.toFixed(2)}</span></h2>
            </div>
            <div style="margin-top:12px;text-align:center;color:#475569;">
                Total Units: <strong>${totalUnits}</strong> &nbsp;•&nbsp; Subjects: <strong>${subjects}</strong>
            </div>
        `;

        // Prefer injecting into the dedicated summary container (keeps it centered next to notes)
        if (summaryContainer) {
            summaryContainer.appendChild(summary);
        } else if (notes) {
            notes.insertAdjacentElement('afterend', summary);
        } else {
            container.appendChild(summary);
        }
    })();

    // Add an Export CSV button next to the page title for convenience
    (function addExportButton() {
        const header = document.querySelector('.feed-header h2');
        if (!header) return;
        const btn = document.createElement('button');
        btn.textContent = 'Export CSV';
        btn.className = 'btn-primary';
        btn.style.marginLeft = '12px';
        header.appendChild(btn);

        btn.addEventListener('click', () => {
            const rows = document.querySelectorAll('.grades-table tbody tr');
            const csv = [
                ['Code', 'Descriptive Title', 'Units', 'Schedule', 'Instructor', 'Program', 'Section', 'Average1', 'Equivalent1', 'Average2', 'Equivalent2'].join(',')
            ];
            rows.forEach(tr => {
                const cols = Array.from(tr.querySelectorAll('td')).map(td => '"' + td.textContent.replace(/"/g, '""').trim() + '"');
                csv.push(cols.join(','));
            });

            const blob = new Blob([csv.join('\n')], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'grades.csv';
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        });
    })();


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
        window.setupTablePagination('.grades-table', 5);
    }
});