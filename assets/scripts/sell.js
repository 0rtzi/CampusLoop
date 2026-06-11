// Estado global de la imagen cargada
let productRawImageBase64 = null;

// 1. Capturar y Procesar la Imagen
function initImageUploadEvents() {
    const fileInput = document.getElementById('productImageInput');
    const preview = document.getElementById('imagePreview');
    const placeholder = document.getElementById('uploadPlaceholder');
    const uploadZone = document.getElementById('imageUploadZone'); // <-- Capturamos el contenedor

    if (!fileInput || !preview || !placeholder || !uploadZone) return;

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert("Please select a valid image file.");
                return;
            }

            const reader = new FileReader();
            
            reader.onload = function(event) {
                productRawImageBase64 = event.target.result;
                
                // 1. Inyectamos la foto y alternamos visibilidades
                preview.src = productRawImageBase64;
                preview.style.display = 'block';
                placeholder.style.display = 'none';
                
                // 2. 🚀 ACTIVAMOS LA ADAPTACIÓN DE ANCHO DINÁMICO
                uploadZone.classList.add('has-image');
                
                updatePublishButtonState();
            };

            reader.readAsDataURL(file);
        }
    });
}

// 🚀 2. VERIFICACIÓN MANUAL ULTRA-ROBUSTA
function updatePublishButtonState() {
    const btnPublish = document.getElementById('btnPublish');
    
    // Traemos todos los valores manuales quitando espacios en blanco extra
    const title = document.getElementById('productTitle').value.trim();
    const price = document.getElementById('productPrice').value.trim();
    const condition = document.getElementById('productCondition').value;
    const campus = document.getElementById('productCampus').value.trim();
    const description = document.getElementById('productDescription').value.trim();
    const terms = document.getElementById('termsAgreement').checked;
    const hasPhoto = productRawImageBase64 !== null;

    // Si TODO tiene contenido real, desbloqueamos el botón
    if (title && price && condition && campus && description && terms && hasPhoto) {
        btnPublish.disabled = false;
    } else {
        btnPublish.disabled = true;
    }
}

// 3. Escuchadores de eventos para escribir en vivo
function initFormValidationListeners() {
    const sellForm = document.getElementById('sellForm');
    if (!sellForm) return;

    // Escucha cualquier pulsación de tecla, selección o click en el formulario
    sellForm.addEventListener('input', updatePublishButtonState);
    sellForm.addEventListener('change', updatePublishButtonState);
}

// 4. Acción de Envío (Guardado en LocalStorage)
function initPublishAction() {
    const sellForm = document.getElementById('sellForm');
    if (!sellForm) return;

    sellForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newProduct = {
            id: Date.now(),
            title: document.getElementById('productTitle').value.trim(),
            price: parseInt(document.getElementById('productPrice').value) || 0,
            condition: document.getElementById('productCondition').value,
            campus: document.getElementById('productCampus').value.trim(),
            description: document.getElementById('productDescription').value.trim(),
            image: productRawImageBase64
        };

        let customProducts = JSON.parse(localStorage.getItem('customProducts')) || [];
        customProducts.push(newProduct);
        localStorage.setItem('customProducts', JSON.stringify(customProducts));

        alert("Success! Your product has been listed successfully.");
        window.location.href = 'browse.html'; // Redirección automática a la tienda
    });
}

// Inicialización masiva al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    initImageUploadEvents();
    initFormValidationListeners();
    initPublishAction();
    
    // Ejecución inicial para asegurar que empiece bloqueado de forma correcta
    updatePublishButtonState();
});