document.addEventListener('DOMContentLoaded', () => {
    
    // Sidebar active state is handled statically in each HTML file

    // Logout logic
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            // Prevent immediate navigation for demonstration
            e.preventDefault();
            const confirmLogout = confirm("Are you sure you want to log out?");
            if (confirmLogout) {
                // Proceed with navigation to login page
                window.location.href = logoutBtn.getAttribute('href');
            }
        });
    }
});
