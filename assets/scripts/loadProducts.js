// Fetch and load products from JSON
async function loadProducts() {
    try {
        const response = await fetch('./assets/products/products.json');
        const products = await response.json();
        setAllProducts(products);
        renderProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Render products as item cards
function renderProducts(products) {
    const itemContainer = document.querySelector('.items-grid');
    
    if (!itemContainer) {
        console.error('Item container not found');
        return;
    }

    // Clear existing items
    itemContainer.innerHTML = '';

    // Show message if no products found
    if (products.length === 0) {
        itemContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666; padding: 40px;">No products found</p>';
        return;
    }

    // Create and append each product card
    products.forEach(product => {
        const itemElement = createItemCard(product);
        itemContainer.appendChild(itemElement);
    });
}

// Create a single item card element
function createItemCard(product) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item';

    itemDiv.innerHTML = `
        <div class="state">
            <p>${product.condition}</p>
        </div>
        <img src="./assets/products/images/${product.image}" alt="${product.title}" class="p-img">
        <h2 class="title">${product.title}</h2>
        <div class="price">
            <span>₩</span>
            <h1>${product.price}</h1>
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

    return itemDiv;
}

// Load products when the page loads
document.addEventListener('DOMContentLoaded', loadProducts);
