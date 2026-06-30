// Checkout Page Functionality
class CheckoutManager {
    constructor() {
        this.cart = this.getCartFromStorage();
        this.selectedDelivery = 'same-day';
        this.selectedPayment = 'pay';
        this.init();
    }

    init() {
        this.renderOrderSummary();
        this.bindEvents();
        this.updateTotals();
        this.setupCartSync();
    }

    // Get cart from localStorage
    getCartFromStorage() {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    }

    // Setup cart synchronization
    setupCartSync() {
        // Listen for storage changes (when cart is updated from other pages)
        window.addEventListener('storage', (e) => {
            if (e.key === 'cart') {
                this.cart = this.getCartFromStorage();
                this.renderOrderSummary();
                this.updateTotals();
            }
        });

        // Also check for cart changes periodically (for same-page updates)
        setInterval(() => {
            const currentCart = this.getCartFromStorage();
            if (JSON.stringify(currentCart) !== JSON.stringify(this.cart)) {
                this.cart = currentCart;
                this.renderOrderSummary();
                this.updateTotals();
            }
        }, 1000);
    }

    // Render order summary
    renderOrderSummary() {
        const itemCount = this.cart.reduce((total, item) => total + item.quantity, 0);
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        // Update item count
        const summaryTitle = document.querySelector('.summary-title');
        if (summaryTitle) {
            if (itemCount === 0) {
                summaryTitle.textContent = 'Your cart is empty';
            } else {
                summaryTitle.textContent = `${itemCount} items`;
            }
        }

        // Update subtotal
        const subtotalEl = document.getElementById('subtotal');
        if (subtotalEl) {
            if (subtotal === 0) {
                subtotalEl.textContent = '0 SAR';
            } else {
                subtotalEl.textContent = `${subtotal} SAR`;
            }
        }

        // Calculate total with delivery
        let deliveryFee = 0;
        let total = 0;
        
        if (subtotal > 0) {
            deliveryFee = 30;
            total = subtotal + deliveryFee;
        }


        // Update delivery display
        const deliveryEl = document.querySelector('.summary-row:nth-child(2) span:last-child');
        if (deliveryEl) {
            if (subtotal === 0) {
                deliveryEl.textContent = '0 SAR';
            } else {
                deliveryEl.textContent = `+${deliveryFee} SAR`;
            }
        }

        // Update total
        const totalEl = document.getElementById('total');
        if (totalEl) {
            if (total === 0) {
                totalEl.textContent = '0 SAR';
            } else {
                totalEl.textContent = `${total} SAR`;
            }
        }
    }

    // Update totals
    updateTotals() {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        let deliveryFee = 0;
        let total = 0;
        
        if (subtotal > 0) {
            deliveryFee = 30;
            total = subtotal + deliveryFee;
        }

        // Update display
        const subtotalEl = document.getElementById('subtotal');
        const totalEl = document.getElementById('total');
        
        if (subtotalEl) {
            if (subtotal === 0) {
                subtotalEl.textContent = '0 SAR';
            } else {
                subtotalEl.textContent = `${subtotal} SAR`;
            }
        }


        // Update delivery display
        const deliveryEl = document.querySelector('.summary-row:nth-child(2) span:last-child');
        if (deliveryEl) {
            if (subtotal === 0) {
                deliveryEl.textContent = '0 SAR';
            } else {
                deliveryEl.textContent = `+${deliveryFee} SAR`;
            }
        }
        
        if (totalEl) {
            if (total === 0) {
                totalEl.textContent = '0 SAR';
            } else {
                totalEl.textContent = `${total} SAR`;
            }
        }
    }

    // Bind events
    bindEvents() {
        // Delivery options
        const deliveryOptions = document.querySelectorAll('.delivery-option');
        deliveryOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                // Remove selected class from all options
                deliveryOptions.forEach(opt => opt.classList.remove('selected'));
                // Add selected class to clicked option
                e.currentTarget.classList.add('selected');
                
                // Update selected delivery
                const text = e.currentTarget.querySelector('.option-text').textContent;
                this.selectedDelivery = text.toLowerCase().replace('-', '');
            });
        });

        // Payment options
        const paymentOptions = document.querySelectorAll('.payment-option');
        paymentOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                // Remove selected class from all options
                paymentOptions.forEach(opt => opt.classList.remove('selected'));
                // Add selected class to clicked option
                e.currentTarget.classList.add('selected');
                
                // Update selected payment
                const text = e.currentTarget.querySelector('.option-text').textContent;
                this.selectedPayment = text.toLowerCase();
            });
        });

        // Form validation (exclude textarea for Special Instructions)
        const formInputs = document.querySelectorAll('.form-input:not(textarea)');
        formInputs.forEach(input => {
            input.addEventListener('blur', () => this.validateInput(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    // Validate input
    validateInput(input) {
        const value = input.value.trim();
        const type = input.type;
        
        if (!value) {
            this.showError(input, 'This field is required');
            return false;
        }

        if (type === 'email' && !this.isValidEmail(value)) {
            this.showError(input, 'Please enter a valid email');
            return false;
        }

        if (type === 'tel' && !this.isValidPhone(value)) {
            this.showError(input, 'Please enter a valid phone number');
            return false;
        }

        this.clearError(input);
        return true;
    }

    // Show error
    showError(input, message) {
        this.clearError(input);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = 'color: #f44336; font-size: 12px; margin-top: 5px;';
        
        input.parentNode.appendChild(errorDiv);
        input.style.borderColor = '#f44336';
    }

    // Clear error
    clearError(input) {
        const errorDiv = input.parentNode.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
        input.style.borderColor = '#e0e0e0';
    }

    // Validate email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validate phone
    isValidPhone(phone) {
        // Accept Saudi phone numbers with or without +966 prefix
        const phoneRegex = /^(\+966\s?)?\d{9}$/;
        return phoneRegex.test(phone);
    }

    // Process payment
    processPayment() {
        // Check if cart is empty
        if (this.cart.length === 0) {
            alert('Your cart is empty. Please add items to your cart before checkout.');
            return;
        }

        // Validate all form fields (exclude textarea for Special Instructions)
        const formInputs = document.querySelectorAll('.form-input:not(textarea)');
        let isValid = true;

        formInputs.forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            alert('Please fill in all required fields correctly');
            return;
        }

        // Show loading state
        const payButton = document.querySelector('.pay-button');
        payButton.classList.add('loading');
        payButton.textContent = 'Processing...';

        // Simulate payment processing
        setTimeout(() => {
            // Clear cart
            localStorage.removeItem('cart');
            
            // Show success message
            alert('Payment successful! Your order has been placed.');
            
            // Redirect to home page
            window.location.href = 'index.html';
        }, 2000);
    }

    // Get form data
    getFormData() {
        return {
            firstName: document.querySelector('input[placeholder="First Name"]').value,
            lastName: document.querySelector('input[placeholder="Last Name"]').value,
            phone: document.querySelector('input[type="tel"]').value,
            email: document.querySelector('input[type="email"]').value,
            zipCode: document.querySelector('input[placeholder="Zip code"]').value,
            delivery: this.selectedDelivery,
            payment: this.selectedPayment
        };
    }
}

// Initialize checkout manager
const checkoutManager = new CheckoutManager();

// Global function for pay button
function processPayment() {
    checkoutManager.processPayment();
}

// Add some additional styling for error messages
const style = document.createElement('style');
style.textContent = `
    .error-message {
        color: #f44336;
        font-size: 12px;
        margin-top: 5px;
        display: block;
    }
    
    .form-input.error {
        border-color: #f44336 !important;
    }
    
    .input-group.error {
        border-color: #f44336 !important;
    }
`;
document.head.appendChild(style);
