document.addEventListener('DOMContentLoaded', () => {
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const usernameInput = document.getElementById('username');
    const loginForm = document.getElementById('loginForm');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');
    const loginBtn = document.getElementById('loginBtn');
    const loginSpinner = document.getElementById('loginSpinner');

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

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Reset errors
            usernameInput.closest('.input-group').classList.remove('error');
            passwordInput.closest('.input-group').classList.remove('error');
            usernameError.style.display = 'none';
            passwordError.style.display = 'none';

            let isValid = true;
            
            if (!usernameInput.value.trim()) {
                usernameInput.closest('.input-group').classList.add('error');
                usernameError.style.display = 'block';
                isValid = false;
            }

            if (!passwordInput.value.trim()) {
                passwordInput.closest('.input-group').classList.add('error');
                passwordError.style.display = 'block';
                isValid = false;
            }

            if (!isValid) return;

            // Show loading state
            loginBtn.disabled = true;
            loginBtn.querySelector('.btn-text').textContent = 'Processing...';
            loginSpinner.style.display = 'inline-block';
            
            // Simulate network request
            setTimeout(() => {
                // Redirect to the appropriate dashboard based on credentials
                if (usernameInput.value.trim() === 'admin' && passwordInput.value === 'admin123') {
                    window.location.href = '../AdminDash/AdminMain.html';
                } else {
                    window.location.href = '../MainDash/Main.html';
                }
            }, 1500);
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
