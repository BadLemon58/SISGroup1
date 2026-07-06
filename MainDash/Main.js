document.addEventListener('DOMContentLoaded', () => {
    
    // Sidebar active state logic
    const navItems = document.querySelectorAll('.nav-item:not(.logout)');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            // Remove active class from all
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked
            this.classList.add('active');
            
            // In a real app, this would also navigate or load new content
            const section = this.textContent.trim();
            console.log(`Navigated to ${section}`);
        });
    });

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
