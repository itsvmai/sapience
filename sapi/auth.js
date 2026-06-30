// Session Management and Authentication
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Check if user is already logged in
        this.currentUser = this.getStoredUser();
        this.updateUI();
    }

    // Store user data in localStorage
    storeUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUser = user;
    }

    // Get stored user data
    getStoredUser() {
        const userData = localStorage.getItem('currentUser');
        return userData ? JSON.parse(userData) : null;
    }

    // Clear user data
    clearUser() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
    }

    // Login function
    login(username, password) {
        // Get stored users
        const users = this.getStoredUsers();
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            this.storeUser(user);
            this.updateUI();
            return { success: true, user: user };
        } else {
            return { success: false, message: "Invalid username or password" };
        }
    }

    // Signup function
    signup(name, email, password, confirmPassword) {
        // Validate password
        const passwordValidation = this.validatePassword(password);
        if (!passwordValidation.isValid) {
            return { success: false, message: passwordValidation.message };
        }

        if (password !== confirmPassword) {
            return { success: false, message: "Passwords do not match" };
        }

        // Check if user already exists
        const users = this.getStoredUsers();
        if (users.find(u => u.email === email || u.username === email)) {
            return { success: false, message: "User already exists" };
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            name: name,
            username: email,
            email: email,
            password: password
        };

        // Store user
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        this.storeUser(newUser);
        this.updateUI();

        return { success: true, user: newUser };
    }

    // Get all stored users
    getStoredUsers() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    }

    // Password validation
    validatePassword(password) {
        const minLength = 8;
        const hasEnglishLetters = /[a-zA-Z]/.test(password);
        const hasSymbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        const hasNoRepeatedChars = !/(.)\1/.test(password);

        if (password.length < minLength) {
            return { isValid: false, message: "Password must be at least 8 characters long" };
        }
        if (!hasEnglishLetters) {
            return { isValid: false, message: "Password must contain English letters" };
        }
        if (!hasSymbols) {
            return { isValid: false, message: "Password must contain symbols" };
        }
        if (!hasNoRepeatedChars) {
            return { isValid: false, message: "Password must not contain repeated characters" };
        }

        return { isValid: true };
    }

    // Logout function
    logout() {
        this.clearUser();
        this.updateUI();
        window.location.href = 'index.html';
    }

    // Update UI based on login status
    updateUI() {
        const loginBtn = document.querySelector('.u-btn-2');
        const signupBtn = document.querySelector('.u-btn-1');
        const userInfo = document.getElementById('user-info');
        
        if (this.currentUser) {
            // User is logged in
            if (loginBtn) loginBtn.style.display = 'none';
            if (signupBtn) signupBtn.style.display = 'none';
            
            // Create user info display
            if (!userInfo) {
                const header = document.querySelector('.u-sheet-1');
                if (header) {
                    const userDiv = document.createElement('div');
                    userDiv.id = 'user-info';
                    userDiv.style.cssText = 'display: flex; align-items: center; gap: 10px;';
                    
                    const welcomeText = document.createElement('span');
                    welcomeText.textContent = `Welcome, ${this.currentUser.name}!`;
                    welcomeText.style.cssText = 'color: #333; font-weight: 500;';
                    
                    const logoutBtn = document.createElement('button');
                    logoutBtn.textContent = 'Logout';
                    logoutBtn.className = 'u-border-2 u-border-custom-color-23 u-btn u-button-style u-custom-color-12';
                    logoutBtn.style.cssText = 'padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;';
                    logoutBtn.onclick = () => this.logout();
                    
                    userDiv.appendChild(welcomeText);
                    userDiv.appendChild(logoutBtn);
                    header.appendChild(userDiv);
                }
            }
        } else {
            // User is not logged in
            if (loginBtn) loginBtn.style.display = 'inline-block';
            if (signupBtn) signupBtn.style.display = 'inline-block';
            if (userInfo) userInfo.remove();
        }
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }
}

// Initialize auth manager
const authManager = new AuthManager();

// Password validation indicators
function updatePasswordValidation(password) {
    const minLength = password.length >= 8;
    const hasEnglishLetters = /[a-zA-Z]/.test(password);
    const hasSymbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const hasNoRepeatedChars = !/(.)\1/.test(password);

    // Update indicators
    const indicators = {
        length: document.getElementById('length-indicator'),
        letters: document.getElementById('letters-indicator'),
        symbols: document.getElementById('symbols-indicator'),
        noRepeat: document.getElementById('norepeat-indicator')
    };

    if (indicators.length) indicators.length.textContent = minLength ? '✓' : '✗';
    if (indicators.letters) indicators.letters.textContent = hasEnglishLetters ? '✓' : '✗';
    if (indicators.symbols) indicators.symbols.textContent = hasSymbols ? '✓' : '✗';
    if (indicators.noRepeat) indicators.noRepeat.textContent = hasNoRepeatedChars ? '✓' : '✗';

    return minLength && hasEnglishLetters && hasSymbols && hasNoRepeatedChars;
}

// Form handlers
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('text-ecf7').value;
    const password = document.getElementById('text-080f').value;

    const result = authManager.login(username, password);
    
    if (result.success) {
        showSuccessMessage(`Welcome, ${result.user.name}!`);
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    } else {
        showErrorMessage('Try again: ' + result.message);
    }
}

function handleSignup(event) {
    event.preventDefault();
    const name = document.getElementById('text-ecf7').value;
    const email = document.getElementById('text-080f').value;
    const password = document.getElementById('text-95b5').value;
    const confirmPassword = document.getElementById('text-68c6').value;

    const result = authManager.signup(name, email, password, confirmPassword);
    
    if (result.success) {
        showSuccessMessage(`Welcome, ${result.user.name}!`);
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    } else {
        showErrorMessage('Signup failed: ' + result.message);
    }
}

// Success and Error Message Functions
function showSuccessMessage(message) {
    // Remove any existing messages
    const existingMessage = document.querySelector('.auth-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create success message
    const messageDiv = document.createElement('div');
    messageDiv.className = 'auth-message success-message';
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1000;
        font-weight: bold;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        max-width: 300px;
    `;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

function showErrorMessage(message) {
    // Remove any existing messages
    const existingMessage = document.querySelector('.auth-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create error message
    const messageDiv = document.createElement('div');
    messageDiv.className = 'auth-message error-message';
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f44336;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1000;
        font-weight: bold;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        max-width: 300px;
    `;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to forms
    const loginForm = document.querySelector('form');
    if (loginForm && window.location.pathname.includes('Log-In')) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (loginForm && window.location.pathname.includes('Sign-Up')) {
        loginForm.addEventListener('submit', handleSignup);
        
        // Add password validation indicators
        const passwordField = document.getElementById('text-95b5');
        if (passwordField) {
            // Create validation indicators
            const validationDiv = document.createElement('div');
            validationDiv.innerHTML = `
                <div style="margin-top: 10px; font-size: 12px;">
                    <div>Minimum 8 characters: <span id="length-indicator">✗</span></div>
                    <div>English letters: <span id="letters-indicator">✗</span></div>
                    <div>Symbols: <span id="symbols-indicator">✗</span></div>
                    <div>No repeated characters: <span id="norepeat-indicator">✗</span></div>
                </div>
            `;
            passwordField.parentNode.appendChild(validationDiv);
            
            passwordField.addEventListener('input', function() {
                updatePasswordValidation(this.value);
            });
        }
    }
});
