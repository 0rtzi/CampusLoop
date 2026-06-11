let cartCount = 0; // Cart item counter
let cartItems = new Set(); // Set of product IDs in cart

// Initialize cart from localStorage
function initializeCart() {
    const savedCartCount = localStorage.getItem('cartCount');
    const savedCartItems = localStorage.getItem('cartItems');
    
    if (savedCartCount) {
        cartCount = parseInt(savedCartCount);
    }
    if (savedCartItems) {
        cartItems = new Set(JSON.parse(savedCartItems));
    }
}

// Update cart badge in navbar
function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) {
        badge.textContent = cartCount;
        if (cartCount > 0) {
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

// Save cart to localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cartCount', cartCount.toString());
    localStorage.setItem('cartItems', JSON.stringify(Array.from(cartItems)));
}

document.addEventListener('DOMContentLoaded', function() {
    initializeCart();
    updateCartBadge();
});