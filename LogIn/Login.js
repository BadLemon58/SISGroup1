document.addEventListener('DOMContentLoaded', () => {
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const loginForm = document.getElementById('loginForm');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');

    // Toggle Password Visibility
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle icon color to indicate active state
            if (type === 'text') {
                togglePasswordBtn.style.color = 'var(--primary-color)';
            } else {
                togglePasswordBtn.style.color = '';
            }
        });
    }

    // Form Submission Handling
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // In a real app, this is where you'd validate and send data to a server
            const username = document.getElementById('username').value;
            
            alert(`Login attempted for user: ${username}\nThis is a demonstration!`);
        });
    }

    // Forgot Password Handling
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Password recovery process initiated.\nThis is a placeholder for the recovery flow.');
        });
    }
});
