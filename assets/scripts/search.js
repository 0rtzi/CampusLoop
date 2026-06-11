// Store all products globally for search functionality
let allProducts = [];
let productsToDisplay = [];
let currentPage = 1;
const PRODUCTS_PER_PAGE = 12;

// Setup search input listener
function setupSearchListener() {
    const searchInput = document.getElementById('searchInput');
    
    if (!searchInput) {
        console.error('Search input not found');
        return;
    }

    searchInput.addEventListener('input', handleSearch);
}

// Handle search functionality
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase().trim();

    if (searchTerm === '') {
        // Show all products if search is empty
        productsToDisplay = allProducts;
    } else {
        // Filter products based on search term
        productsToDisplay = allProducts.filter(product => 
            product.title.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.campus.toLowerCase().includes(searchTerm)
        );
    }
    
    // Reset to first page and render
    currentPage = 1;
    renderPage();
}

// Store products reference
function setAllProducts(products) {
    allProducts = products;
    setupSearchListener();
}
