// Variables globales de control (Asegúrate de que no estén repetidas en otro script)
if (typeof currentPage === 'undefined') window.currentPage = 1;
if (typeof productsToDisplay === 'undefined') window.productsToDisplay = [];
if (typeof PRODUCTS_PER_PAGE === 'undefined') window.PRODUCTS_PER_PAGE = 12; // Ajusta el número a tu gusto

// Format price with comma separator
function formatPrice(price) {
    return price.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' });
}

// Fetch and load products from JSON + LocalStorage
async function loadProducts() {
    try {
        if (typeof initializeCart === 'function') initializeCart(); 
        if (typeof updateCartBadge === 'function') updateCartBadge(); 
        
        // 1. Descargamos los productos estáticos del JSON original
        const response = await fetch('./assets/products/products.json');
        const jsonProducts = await response.json();
        
        // 2. Recuperamos los productos creados dinámicamente desde sell.html
        const customProducts = JSON.parse(localStorage.getItem('customProducts')) || [];
        
        // 3. Fusionamos ambos arrays en uno solo
        const products = [...jsonProducts, ...customProducts];
        
        console.log('Products loaded from JSON:', jsonProducts.length);
        console.log('Products loaded from LocalStorage:', customProducts.length);
        console.log('Total combined products:', products.length);
        
        if (typeof setAllProducts === 'function') {
            setAllProducts(products);
        }
        
        productsToDisplay = products;
        currentPage = 1;
        
        renderPage();
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Render current page
function renderPage() {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    const pageProducts = productsToDisplay.slice(startIndex, endIndex);

    renderProducts(pageProducts);
    renderPagination();
}

// Render pagination buttons
function renderPagination() {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;

    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(productsToDisplay.length / PRODUCTS_PER_PAGE);

    if (totalPages <= 1) return;

    // Previous button
    const prevButton = document.createElement('button');
    prevButton.textContent = '← Previous';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    paginationContainer.appendChild(prevButton);

    // Page number buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', () => {
            currentPage = i;
            renderPage();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        paginationContainer.appendChild(pageButton);
    }

    // Next button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next →';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderPage();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    paginationContainer.appendChild(nextButton);
}

// Render products as item cards
function renderProducts(products) {
    const itemContainer = document.querySelector('.items-grid');
    if (!itemContainer) {
        console.error('Item container (.items-grid) not found');
        return;
    }

    itemContainer.innerHTML = '';

    if (products.length === 0) {
        itemContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666; padding: 40px;">No products found</p>';
        return;
    }

    products.forEach(product => {
        const itemElement = createItemCard(product);
        itemContainer.appendChild(itemElement);
    });
}

// Create a single item card element (¡CORREGIDO! 🚀)
function createItemCard(product) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item';

    // Control de imagen: Base64 dinámica o ruta local por defecto
    const imageSource = (product.image && product.image.startsWith('data:image')) 
        ? product.image 
        : `./assets/products/images/${product.image}`;

    itemDiv.innerHTML = `
        <div class="state">
            <p>${product.condition}</p>
        </div>
        <img src="${imageSource}" alt="${product.title}" class="p-img">
        <h2 class="title">${product.title}</h2>
        <div class="price">
            <h1>${formatPrice(product.price)}</h1>
        </div>
        <div class="location">
            <span class="material-symbols-rounded">place</span>
            <p>${product.campus}</p>
        </div>
        <button class="btn-buy">
            <span class="material-symbols-rounded">add_shopping_cart</span>
            <p>Add to cart</p>
        </button>
    `;

    const buyButton = itemDiv.querySelector('.btn-buy');
    
    // --- AQUÍ ESTÁ LA CORRECCIÓN CRÍTICA ---
    const productId = product.id.toString();
    const isAlreadyInCart = (typeof cartItems !== 'undefined') ? cartItems.has(productId) : false;
    
    if (isAlreadyInCart) {
        buyButton.classList.add('in-cart');
        const icon = buyButton.querySelector('span');
        const text = buyButton.querySelector('p');
        icon.textContent = 'remove_shopping_cart';
        text.textContent = 'Remove from cart';
    }

    buyButton.addEventListener('click', () => {
        if (typeof cartItems === 'undefined') return;
        
        const isInCart = cartItems.has(productId);
        const icon = buyButton.querySelector('span');
        const text = buyButton.querySelector('p');
        
        if (!isInCart) {
            buyButton.classList.add('in-cart');
            icon.textContent = 'remove_shopping_cart';
            text.textContent = 'Remove from cart';
            cartItems.add(productId);
            if (typeof cartCount !== 'undefined') cartCount++;
        } else {
            buyButton.classList.remove('in-cart');
            icon.textContent = 'add_shopping_cart';
            text.textContent = 'Add to cart';
            cartItems.delete(productId);
            if (typeof cartCount !== 'undefined') cartCount--;
        }
        
        if (typeof updateCartBadge === 'function') updateCartBadge();
        if (typeof saveCartToLocalStorage === 'function') saveCartToLocalStorage();
    });

    return itemDiv;
}

// Load products when the page loads
document.addEventListener('DOMContentLoaded', function() {
    loadProducts(); 
});