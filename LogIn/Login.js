document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const usernameInput = document.getElementById('username');
    const loginForm = document.getElementById('loginForm');
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');
    const loginBtn = document.getElementById('loginBtn');
    const loginSpinner = document.getElementById('loginSpinner');
    const clearBtns = document.querySelectorAll('.clear-btn');
    
    // Modal & Toast Elements
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelResetBtn = document.getElementById('cancelResetBtn');
    const submitResetBtn = document.getElementById('submitResetBtn');
    const resetEmailInput = document.getElementById('resetEmail');
    const resetError = document.getElementById('resetError');
    const toast = document.getElementById('toast');

    // --- 1. Form Validation & Real-time Checking ---
    const validateForm = () => {
        const isUsernameValid = usernameInput.value.trim().length > 0;
        const isPasswordValid = passwordInput.value.trim().length > 0;
        
        loginBtn.disabled = !(isUsernameValid && isPasswordValid);
    };

    [usernameInput, passwordInput].forEach(input => {
        if (input) {
            // Check validation and toggle clear button
            input.addEventListener('input', (e) => {
                validateForm();
                const clearBtn = e.target.parentElement.querySelector('.clear-btn');
                if (clearBtn) {
                    if (e.target.value.length > 0) {
                        clearBtn.classList.remove('hidden');
                    } else {
                        clearBtn.classList.add('hidden');
                    }
                }
            });

            // Remove error styling on focus
            input.addEventListener('focus', (e) => {
                e.target.closest('.input-group').classList.remove('error');
                const errorMsg = e.target.closest('.input-wrapper').querySelector('.error-message');
                if (errorMsg) errorMsg.style.display = 'none';
            });
            
            // Show error on blur if empty
            input.addEventListener('blur', (e) => {
                if (e.target.value.trim().length === 0) {
                    e.target.closest('.input-group').classList.add('error');
                    const errorMsg = e.target.closest('.input-wrapper').querySelector('.error-message');
                    if (errorMsg) errorMsg.style.display = 'block';
                }
            });
        }
    });

    // --- 2. Clear Buttons Logic ---
    clearBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const input = e.currentTarget.parentElement.querySelector('input');
            if (input) {
                input.value = '';
                input.focus();
                e.currentTarget.classList.add('hidden');
                validateForm();
            }
        });
    });

    // --- 3. Toggle Password Visibility ---
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            if (type === 'text') {
                togglePasswordBtn.style.color = 'var(--primary-color)';
            } else {
                togglePasswordBtn.style.color = '';
            }
        });
    }

    // --- 4. Form Submission & System Status (Toast) ---
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (loginBtn.disabled) return;

            // Show loading state
            loginBtn.disabled = true;
            loginBtn.querySelector('.btn-text').textContent = 'Processing...';
            loginSpinner.style.display = 'inline-block';
            
            // Simulate network request
            setTimeout(() => {
                // Show Success Toast
                toast.classList.remove('hidden');
                loginBtn.querySelector('.btn-text').textContent = 'Success!';
                loginSpinner.style.display = 'none';
                
                // Redirect after brief delay
                setTimeout(() => {
                    if (usernameInput.value.trim() === 'admin' && passwordInput.value === 'admin123') {
                        window.location.href = '../AdminDash/AdminMain.html';
                    } else {
                        window.location.href = '../MainDash/Main.html';
                    }
                }, 1200);
            }, 1000);
        });
    }

    // --- 5. Modal Management (User Control & Freedom) ---
    const openModal = () => {
        forgotPasswordModal.classList.remove('hidden');
        resetEmailInput.value = '';
        resetEmailInput.focus();
        resetError.style.display = 'none';
    };

    const closeModal = () => {
        forgotPasswordModal.classList.add('hidden');
        usernameInput.focus(); // Return focus to main form
    };

    if (forgotPasswordLink) forgotPasswordLink.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (cancelResetBtn) cancelResetBtn.addEventListener('click', closeModal);

    // Close modal if clicking outside content
    if (forgotPasswordModal) {
        forgotPasswordModal.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-backdrop')) {
                closeModal();
            }
        });
    }

    // Handle Reset Password Submit
    if (submitResetBtn) {
        submitResetBtn.addEventListener('click', () => {
            if (!resetEmailInput.value.trim() || !resetEmailInput.value.includes('@')) {
                resetError.style.display = 'block';
                return;
            }
            submitResetBtn.textContent = 'Sending...';
            setTimeout(() => {
                closeModal();
                submitResetBtn.textContent = 'Send Instructions';
                // Toast for modal success
                const toastMsg = document.getElementById('toastMessage');
                if (toastMsg) toastMsg.textContent = 'Instructions sent to your email.';
                toast.classList.remove('hidden');
                setTimeout(() => toast.classList.add('hidden'), 3000);
            }, 800);
        });
    }

    // --- 6. Global Keyboard Accessibility (Flexibility & Efficiency) ---
    document.addEventListener('keydown', (e) => {
        // Escape key to close modal
        if (e.key === 'Escape' && !forgotPasswordModal.classList.contains('hidden')) {
            closeModal();
        }
    });
});
