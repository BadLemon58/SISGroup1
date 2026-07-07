document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profileForm');
    const cancelBtn = document.getElementById('cancelBtn');
    
    // Inputs
    const fullNameInput = document.getElementById('fullName');
    const studentIdInput = document.getElementById('studentId');
    const courseInput = document.getElementById('course');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const avatarInitials = document.getElementById('avatarInitials');

    // Load existing data from localStorage if available
    function loadProfileData() {
        const storedProfile = localStorage.getItem('studentProfile');
        if (storedProfile) {
            const profile = JSON.parse(storedProfile);
            fullNameInput.value = profile.fullName || '';
            studentIdInput.value = profile.studentId || '2023-0145-XX';
            courseInput.value = profile.course || '';
            emailInput.value = profile.email || '';
            phoneInput.value = profile.phone || '';
            updateAvatar(profile.fullName);
        }
    }

    // Helper to generate avatar initials (e.g., "Juan Dela Cruz" -> "JC")
    function updateAvatar(name) {
        if (!name) return;
        const parts = name.trim().split(/\s+/);
        let initials = '';
        if (parts.length >= 2) {
            initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        } else if (parts.length === 1) {
            initials = parts[0].substring(0, 2).toUpperCase();
        }
        avatarInitials.textContent = initials;
    }

    // Update avatar on name change live
    fullNameInput.addEventListener('input', (e) => {
        updateAvatar(e.target.value);
    });

    // Form submission
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const updatedProfile = {
            fullName: fullNameInput.value.trim(),
            studentId: studentIdInput.value.trim(),
            course: courseInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim()
        };

        // Save to localStorage
        localStorage.setItem('studentProfile', JSON.stringify(updatedProfile));

        // Show mock toast/alert for success
        alert('Profile saved successfully!');
        
        // Navigate back to MainDash (or previous page)
        window.location.href = '../MainDash/Main.html';
    });

    // Cancel button
    cancelBtn.addEventListener('click', () => {
        window.location.href = '../MainDash/Main.html';
    });

    // Initial load
    loadProfileData();
});
