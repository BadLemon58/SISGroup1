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
