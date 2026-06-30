// Cart Management System
class CartManager {
    constructor() {
        this.cart = this.getStoredCart();
        this.products = this.getProductData();
        this.init();
    }

    init() {
        this.updateCartDisplay();
        this.bindEvents();
    }

    // Product data with SAR prices
    getProductData() {
        return {
            'caramelized-banana-latte': {
                id: 'caramelized-banana-latte',
                name: 'Caramelized Banana Iced Latte',
                price: 22,
                image: 'images/BrownSugarBananaCreamLatte.jpg',
                description: 'Creamy iced latte with caramelized banana flavor and smooth espresso.'
            },
            'brown-sugar-cinnamon-latte': {
                id: 'brown-sugar-cinnamon-latte',
                name: 'Brown Sugar Cinnamon Iced Latte',
                price: 22,
                image: 'images/TIFFANY.jpg',
                description: 'Iced latte with brown sugar sweetness and a dash of cinnamon.'
            },
            'vanilla-bean-latte': {
                id: 'vanilla-bean-latte',
                name: 'Iced Vanilla Bean Latte',
                price: 22,
                image: 'images/download12.jpg',
                description: 'Chilled espresso blended with milk and sweet vanilla syrup over ice.'
            },
            'cookie-dough-latte': {
                id: 'cookie-dough-latte',
                name: 'Iced Cookie Dough Latte',
                price: 22,
                image: 'images/DeliciousandEasyBiscoffCookieButterLatte.jpg',
                description: 'Iced latte with cookie dough flavor and a touch of Biscoff, smooth and refreshing.'
            },
            'iced-americano': {
                id: 'iced-americano',
                name: 'Iced Americano',
                price: 15,
                image: 'images/IMG_1572.jpeg',
                description: 'Bold espresso shots poured over cold water and ice for a crisp, strong taste.'
            },
            'affogato': {
                id: 'affogato',
                name: 'Affogato',
                price: 22,
                image: 'images/download11.jpg',
                description: 'A scoop of vanilla ice cream drenched with a shot of freshly brewed espresso.'
            },
            'cinnamon-brown-sugar-cookies': {
                id: 'cinnamon-brown-sugar-cookies',
                name: 'Cinnamon brown sugar cookies',
                price: 15,
                image: 'images/IMG_1569.jpeg',
                description: 'Soft and chewy cookies infused with warm cinnamon and rich brown sugar.'
            },
            'belgian-chocolate-cookies': {
                id: 'belgian-chocolate-cookies',
                name: 'Belgian chocolate cookies',
                price: 15,
                image: 'images/IMG_1570.jpeg',
                description: 'Decadent cookies loaded with premium Belgian chocolate.'
            },
            'blueberry-cheesecake': {
                id: 'blueberry-cheesecake',
                name: 'Blueberry cheesecake',
                price: 21,
                image: 'images/Blueberry-ToppedCheesecake-BakefromScratch.jpg',
                description: 'A creamy, velvety cheesecake topped with fresh blueberries.'
            },
            'blueberry-muffins': {
                id: 'blueberry-muffins',
                name: 'Blueberry muffins',
                price: 21,
                image: 'images/download13.jpg',
                description: 'Moist and fluffy muffins bursting with fresh blueberries.'
            }
        };
    }

    // Get stored cart from localStorage
    getStoredCart() {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    }

    // Store cart in localStorage
    storeCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    // Clear cart
    clearCart() {
        this.cart = [];
        localStorage.removeItem('cart');
    }

    // Add product to cart
    addToCart(productId) {
        const product = this.products[productId];
        if (!product) return false;

        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }

        this.storeCart();
        this.updateCartDisplay();
        this.showAddToCartMessage(product.name);
        return true;
    }

    // Remove product from cart
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.storeCart();
        this.updateCartDisplay();
    }

    // Update product quantity
    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.storeCart();
                this.updateCartDisplay();
            }
        }
    }

    // Get cart total
    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Get cart item count
    getCartItemCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    // Show add to cart message
    showAddToCartMessage(productName) {
        // Create or update message element
        let messageEl = document.getElementById('cart-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'cart-message';
            messageEl.style.cssText = `
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
            `;
            document.body.appendChild(messageEl);
        }

        messageEl.textContent = `Item added to cart: ${productName}`;
        messageEl.style.display = 'block';

        // Hide message after 3 seconds
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 3000);
    }

    // Update cart display
    updateCartDisplay() {
        // Update cart page if we're on it
        if (window.location.pathname.includes('Cart.html') || window.location.pathname.includes('cart')) {
            this.renderCartPage();
        }

        // Update cart count in header (if exists)
        const cartCountEl = document.getElementById('cart-count');
        if (cartCountEl) {
            cartCountEl.textContent = this.getCartItemCount();
        }
    }

    // Force clear cart (for testing)
    forceClearCart() {
        this.cart = [];
        localStorage.removeItem('cart');
        this.updateCartDisplay();
        console.log('Cart cleared');
    }

    // Render cart page
    renderCartPage() {
        const cartTable = document.querySelector('.u-cart-products-table tbody');
        if (!cartTable) {
            console.log('Cart table not found, retrying...');
            // Retry after a short delay
            setTimeout(() => {
                this.renderCartPage();
            }, 100);
            return;
        }

        // Clear existing rows
        cartTable.innerHTML = '';

        if (this.cart.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="4" style="text-align: center; padding: 40px;">
                    <h3>Your cart is empty</h3>
                    <p>Add some delicious items to get started!</p>
                </td>
            `;
            cartTable.appendChild(emptyRow);
            // Update totals to show 0 when cart is empty
            this.updateCartTotals();
            return;
        }

        // Render cart items with consistent styling
        this.cart.forEach((item, index) => {
            const row = document.createElement('tr');
            row.style.height = '168px';
            row.innerHTML = `
                <td class="u-border-1 u-border-grey-dark-1 u-table-cell">
                    <span class="u-cart-remove-item u-icon u-icon-${index + 1}" onclick="cartManager.removeFromCart('${item.id}')" style="cursor: pointer;">
                        <svg class="u-svg-content" viewBox="0 0 52 52" x="0px" y="0px" style="width: 1em; height: 1em;">
                            <g>
                                <path d="M26,0C11.664,0,0,11.663,0,26s11.664,26,26,26s26-11.663,26-26S40.336,0,26,0z M26,50C12.767,50,2,39.233,2,26S12.767,2,26,2s24,10.767,24,24S39.233,50,26,50z"></path>
                                <path d="M35.707,16.293c-0.391-0.391-1.023-0.391-1.414,0L26,24.586l-8.293-8.293c-0.391-0.391-1.023-0.391-1.414,0s-0.391,1.023,0,1.414L24.586,26l-8.293,8.293c-0.391,0.391-0.391,1.023,0,1.414C16.488,35.902,16.744,36,17,36s0.512-0.098,0.707-0.293L26,27.414l8.293,8.293C34.488,35.902,34.744,36,35,36s0.512-0.098,0.707-0.293c0.391-0.391,0.391-1.023,0-1.414L27.414,26l8.293-8.293C36.098,17.316,36.098,16.684,35.707,16.293z"></path>
                            </g>
                        </svg>
                    </span>
                    <img class="u-cart-product-image u-image u-image-default u-product-control u-image-${index + 1}" src="${item.image}" data-image-width="512" data-image-height="1024" style="width: 100px; height: 120px; object-fit: cover; border-radius: 8px;">
                    <h2 class="u-cart-product-title u-product-control u-text u-text-${index + 1}" style="font-size: 16px; font-weight: 500; margin: 10px 0;">
                        <a class="u-product-title-link" href="#" style="color: #333; text-decoration: none;">${item.name}</a>
                    </h2>
                </td>
                <td class="u-border-1 u-border-grey-dark-1 u-table-cell">
                    <div class="u-cart-product-price u-product-control u-product-price" data-add-zero-cents="false">
                        <div class="u-price-wrapper">
                            <div class="u-old-price" style="text-decoration: line-through !important;"></div>
                            <div class="u-price" style="font-size: 16px; font-weight: 500;">${item.price} SAR</div>
                        </div>
                    </div>
                </td>
                <td class="u-border-1 u-border-grey-dark-1 u-table-cell">
                    <div class="u-cart-product-quantity u-product-control u-product-quantity u-product-quantity-${index + 1}">
                        <div class="u-hidden u-quantity-label"> Quantity </div>
                        <div class="u-border-1 u-border-grey-25 u-quantity-input" style="display: flex; align-items: center; justify-content: center; gap: 5px; border: 1px solid #ddd; border-radius: 4px; padding: 5px;">
                            <button class="minus u-button-style" onclick="cartManager.updateQuantity('${item.id}', ${item.quantity - 1})" style="padding: 5px; cursor: pointer; border: none; background: transparent; display: flex; align-items: center; justify-content: center;">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" style="width: 16px; height: 16px;"><path d="m 4 8 h 8" fill="none" stroke="currentColor" stroke-width="1" fill-rule="evenodd"></path></svg>
                            </button>
                            <input class="u-border-2 u-border-grey-30 u-input" type="number" value="${item.quantity}" min="1" onchange="cartManager.updateQuantity('${item.id}', parseInt(this.value))" style="width: 50px; text-align: center; padding: 5px; border: 1px solid #ddd; border-radius: 3px;">
                            <button class="plus u-button-style" onclick="cartManager.updateQuantity('${item.id}', ${item.quantity + 1})" style="padding: 5px; cursor: pointer; border: none; background: transparent; display: flex; align-items: center; justify-content: center;">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" style="width: 16px; height: 16px;"><path d="m 4 8 h 8 M 8 4 v 8" fill="none" stroke="currentColor" stroke-width="1" fill-rule="evenodd"></path></svg>
                            </button>
                        </div>
                    </div>
                </td>
                <td class="u-border-1 u-border-grey-dark-1 u-table-cell">
                    <div class="u-cart-product-subtotal u-product-control u-product-price" data-add-zero-cents="false">
                        <div class="u-price-wrapper">
                            <div class="u-old-price" style="text-decoration: line-through !important;"></div>
                            <div class="u-price" style="font-weight: 700; font-size: 16px;">${item.price * item.quantity} SAR</div>
                        </div>
                    </div>
                </td>
            `;
            cartTable.appendChild(row);
        });

        // Update totals
        this.updateCartTotals();
    }

    // Update cart totals
    updateCartTotals() {
        const subtotalEl = document.querySelector('.u-cart-totals-table tbody tr:first-child td:last-child');
        const totalEl = document.querySelector('.u-cart-totals-table tbody tr:last-child td:last-child');
        
        if (!subtotalEl || !totalEl) {
            console.log('Cart totals elements not found, retrying...');
            setTimeout(() => {
                this.updateCartTotals();
            }, 100);
            return;
        }
        
        const subtotal = this.getCartTotal();
        
        if (this.cart.length === 0) {
            // Show 0 when cart is empty
            if (subtotalEl) subtotalEl.textContent = '0 SAR';
            if (totalEl) totalEl.textContent = '0 SAR';
        } else {
            // Show totals when cart has items
            if (subtotalEl) subtotalEl.textContent = `${subtotal} SAR`;
            if (totalEl) totalEl.textContent = `${subtotal} SAR`;
        }
    }

    // Bind events
    bindEvents() {
        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('u-btn-1') || 
                e.target.classList.contains('u-btn-2') || 
                e.target.classList.contains('u-btn-3') || 
                e.target.classList.contains('u-btn-4') || 
                e.target.classList.contains('u-btn-5') || 
                e.target.classList.contains('u-btn-6') || 
                e.target.classList.contains('u-btn-7') || 
                e.target.classList.contains('u-btn-8') || 
                e.target.classList.contains('u-btn-9') || 
                e.target.classList.contains('u-btn-10')) {
                
                const button = e.target;
                const productCard = button.closest('.u-list-item');
                if (productCard) {
                    const productId = this.getProductIdFromCard(productCard);
                    if (productId) {
                        e.preventDefault();
                        this.addToCart(productId);
                    }
                }
            }
        });

        // Continue shopping button
        const continueShoppingBtn = document.querySelector('.u-cart-continue-shopping');
        if (continueShoppingBtn) {
            continueShoppingBtn.onclick = (e) => {
                e.preventDefault();
                window.location.href = 'Products.html';
            };
        }

        // Update cart button
        const updateCartBtn = document.querySelector('.u-cart-update');
        if (updateCartBtn) {
            updateCartBtn.onclick = (e) => {
                e.preventDefault();
                alert('Cart is already updated');
            };
        }

        // Proceed to checkout button
        const checkoutBtn = document.querySelector('.u-cart-checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.onclick = (e) => {
                e.preventDefault();
                window.location.href = 'checkout.html';
            };
        }
    }

    // Get product ID from product card
    getProductIdFromCard(card) {
        const title = card.querySelector('h5');
        if (!title) return null;

        const titleText = title.textContent.toLowerCase();
        
        // Map titles to product IDs
        const titleMap = {
            'caramelized banana iced latte': 'caramelized-banana-latte',
            'brown sugar ​cinnamon iced latte': 'brown-sugar-cinnamon-latte',
            'iced vanilla bean latte': 'vanilla-bean-latte',
            'iced cookie dough latte': 'cookie-dough-latte',
            'iced americano': 'iced-americano',
            'affogato': 'affogato',
            'cinnamon brown sugar cookies': 'cinnamon-brown-sugar-cookies',
            'belgian chocolate cookies': 'belgian-chocolate-cookies',
            'blueberry cheesecake': 'blueberry-cheesecake',
            'blueberry muffins': 'blueberry-muffins'
        };

        for (const [key, value] of Object.entries(titleMap)) {
            if (titleText.includes(key.toLowerCase())) {
                return value;
            }
        }

        return null;
    }
}

// Initialize cart manager
// Initialize cart manager when DOM is loaded
let cartManager;

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        cartManager = new CartManager();
    });
} else {
    cartManager = new CartManager();
}

// Global function to clear cart (for testing)
function clearCart() {
    cartManager.forceClearCart();
}

