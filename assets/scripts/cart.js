let cartCount = 0;
let cartItems = new Set();
let loadedProductsData = [];

function formatPrice(price) {
    return price.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' });
}

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

function saveCartToLocalStorage() {
    localStorage.setItem('cartCount', cartCount.toString());
    localStorage.setItem('cartItems', JSON.stringify(Array.from(cartItems)));
}

async function loadCartProducts() {
    const itemsContainer = document.getElementById('cartItemsList');
    if (!itemsContainer) return; 

    try {
        const response = await fetch('./assets/products/products.json');
        loadedProductsData = await response.json();
        renderCartPage();
    } catch (error) {
        console.error('Error fetching product data for cart:', error);
        itemsContainer.innerHTML = '<p class="empty-cart-msg">Error loading items.</p>';
    }
}

function renderCartPage() {
    const itemsContainer = document.getElementById('cartItemsList');
    if (!itemsContainer) return;

    itemsContainer.innerHTML = '';
    
    const productsInCart = loadedProductsData.filter(product => cartItems.has(product.id.toString()));

    if (productsInCart.length === 0) {
        itemsContainer.innerHTML = '<p class="empty-cart-msg">Your shopping basket is empty.</p>';
        updateSummaryPrices(0);
        updatePlaceOrderButtonState();
        return;
    }

    let subtotalValue = 0;

    productsInCart.forEach(product => {
        subtotalValue += product.price;

        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.innerHTML = `
            <img src="./assets/products/images/${product.image}" alt="${product.title}" class="cart-item-img">
            <h3 class="cart-item-title">${product.title}</h3>
            <p class="cart-item-price">${formatPrice(product.price)}</p>
            <button class="btn-remove-item" data-id="${product.id}">X</button>
        `;

        row.querySelector('.btn-remove-item').addEventListener('click', (e) => {
            const idToRemove = e.target.getAttribute('data-id');
            removeItemFromCart(idToRemove);
        });

        itemsContainer.appendChild(row);
    });

    updateSummaryPrices(subtotalValue);
    updatePlaceOrderButtonState();
}

function removeItemFromCart(id) {
    if (cartItems.has(id)) {
        cartItems.delete(id);
        cartCount = Math.max(0, cartCount - 1);
        
        saveCartToLocalStorage();
        updateCartBadge();
        renderCartPage(); 
    }
}

function updateSummaryPrices(subtotal) {
    const taxes = subtotal * 0.10;
    const serviceFee = subtotal > 0 ? 2000 : 0; 
    const total = subtotal + taxes + serviceFee;

    document.getElementById('summarySubtotal').textContent = formatPrice(subtotal);
    document.getElementById('summaryTaxes').textContent = formatPrice(taxes);
    document.getElementById('summaryFee').textContent = formatPrice(serviceFee);
    document.getElementById('summaryTotal').textContent = formatPrice(total);
}

// 8. LÓGICA DEL ACORDEÓN MUTUAMENTE EXCLUSIVO
function initAccordionLogic() {
    const headers = document.querySelectorAll('.accordion-header');

    headers.forEach(header => {
        header.addEventListener('click', function() {
            const currentItem = this.parentElement;
            if (currentItem.classList.contains('active')) return;

            const activeItem = document.querySelector('.accordion-item.active');
            if (activeItem) {
                activeItem.classList.remove('active');
            }
            currentItem.classList.add('active');
        });
    });
}

function updatePlaceOrderButtonState() {
    const btnPlaceOrder = document.getElementById('btnPlaceOrder');
    const billingForm = document.getElementById('billingForm');
    const paymentForm = document.getElementById('paymentForm');

    if (!btnPlaceOrder || !billingForm || !paymentForm) return;

    const hasItems = cartItems.size > 0;
    const isBillingValid = billingForm.checkValidity();
    const isPaymentValid = paymentForm.checkValidity();

    if (hasItems && isBillingValid && isPaymentValid) {
        btnPlaceOrder.disabled = false; 
    } else {
        btnPlaceOrder.disabled = true;  
    }
}

function initValidationListeners() {
    const billingForm = document.getElementById('billingForm');
    const paymentForm = document.getElementById('paymentForm');

    // Cada vez que el usuario escriba/cambie algo, revisamos si ya puede comprar
    if (billingForm) {
        billingForm.addEventListener('input', updatePlaceOrderButtonState);
    }
    if (paymentForm) {
        paymentForm.addEventListener('input', updatePlaceOrderButtonState);
    }
}

function initCheckoutAction() {
    const btnPlaceOrder = document.getElementById('btnPlaceOrder');
    if (!btnPlaceOrder) return;

    btnPlaceOrder.addEventListener('click', () => {
        // Doble seguridad por si acaso descativan el atributo por consola devtools
        if (btnPlaceOrder.disabled) return;

        alert("Thank you for your purchase! Your order has been placed successfully.");

        // Vaciar el carrito por completo tras la compra
        cartCount = 0;
        cartItems.clear();
        saveCartToLocalStorage();
        updateCartBadge();
        
        window.location.href = 'browse.html';
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initializeCart();
    updateCartBadge();
    loadCartProducts();
    initAccordionLogic();
    initValidationListeners();
    initCheckoutAction();
});