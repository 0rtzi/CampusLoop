// Store all products globally for search functionality
let allProducts = [];

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
        renderProducts(allProducts);
    } else {
        // Filter products based on search term
        const filteredProducts = allProducts.filter(product => 
            product.title.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.campus.toLowerCase().includes(searchTerm)
        );
        renderProducts(filteredProducts);
    }
}

// Store products reference
function setAllProducts(products) {
    allProducts = products;
    setupSearchListener();
}
