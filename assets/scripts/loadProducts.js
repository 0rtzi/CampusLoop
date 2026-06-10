// Fetch and load products from JSON
async function loadProducts() {
    try {
        const response = await fetch('./assets/products/products.json');
        const products = await response.json();
        console.log('Products loaded:', products.length);
        setAllProducts(products);
        productsToDisplay = products;
        currentPage = 1;
        console.log('Total products to display:', productsToDisplay.length);
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
    
    if (!paginationContainer) {
        console.error('Pagination container not found');
        return;
    }

    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(productsToDisplay.length / PRODUCTS_PER_PAGE);
    console.log('Total pages:', totalPages, 'Products:', productsToDisplay.length, 'Per page:', PRODUCTS_PER_PAGE);

    // If only one page, don't show pagination
    if (totalPages <= 1) {
        console.log('Only one page, not showing pagination');
        return;
    }

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
loadProducts();
