import { products } from './products.js';

const productGrid = document.querySelector('.product-grid');
const categoryButtons = document.querySelectorAll('[data-category]');
const showMoreButton = document.querySelector('.show-more');
const productDialog = document.querySelector('.product-dialog');
const catalogScreen = window.matchMedia('(max-width: 768px)');
let currentCategory = 'coffee';
let showAll = false;
let selectedProduct;
let lastProductButton;

function renderProducts() {
    const categoryProducts = products.filter(product => product.category === currentCategory);
    const visibleProducts = catalogScreen.matches && !showAll
        ? categoryProducts.slice(0, 4)
        : categoryProducts;

    productGrid.innerHTML = visibleProducts.map(product => `
        <button class="product-card" type="button" data-product="${product.id}" aria-label="View ${product.name}">
            <span class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </span>
            <span class="product-description">
                <span class="product-name">${product.name}</span>
                <span>${product.description}</span>
                <span class="price">$${product.price}</span>
            </span>
        </button>
    `).join('');

    showMoreButton.hidden = visibleProducts.length === categoryProducts.length;
    categoryButtons.forEach(button => {
        button.setAttribute('aria-pressed', button.dataset.category === currentCategory);
    });
}

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        currentCategory = button.dataset.category;
        showAll = false;
        renderProducts();
    });
});

showMoreButton.addEventListener('click', () => {
    showAll = true;
    renderProducts();
    productGrid.children[4]?.focus({ preventScroll: true });
});

catalogScreen.addEventListener('change', () => {
    showAll = false;
    renderProducts();
});

function openProduct(product) {
    selectedProduct = product;
    productDialog.innerHTML = `
        <div class="modal-content">
            <div class="modal-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="modal-details">
                <div class="modal-heading">
                    <h2 id="product-title">${product.name}</h2>
                    <p id="product-description">${product.description}</p>
                </div>
                <fieldset>
                    <legend>Size</legend>
                    <div class="product-options">
                        ${Object.entries(product.sizes).map(([key, size]) => `
                            <label>
                                <input type="radio" name="size" value="${key}" ${key === 's' ? 'checked' : ''}>
                                <span class="option"><b>${key.toUpperCase()}</b>${size.size}</span>
                            </label>
                        `).join('')}
                    </div>
                </fieldset>
                <fieldset>
                    <legend>Additives</legend>
                    <div class="product-options">
                        ${product.additives.map((additive, index) => `
                            <label>
                                <input type="checkbox" name="additive" value="${index}">
                                <span class="option"><b>${index + 1}</b>${additive.name}</span>
                            </label>
                        `).join('')}
                    </div>
                </fieldset>
                <div class="modal-total">
                    <span>Total:</span>
                    <output aria-live="polite">$${product.price}</output>
                </div>
                <p class="modal-note">The cost is not final. Download our mobile app to see the final price and place your order. Earn loyalty points and enjoy your favorite coffee with up to 20% discount.</p>
                <button class="modal-close" type="button">Close</button>
            </div>
        </div>
    `;

    productDialog.setAttribute('aria-labelledby', 'product-title');
    productDialog.setAttribute('aria-describedby', 'product-description');
    document.documentElement.classList.add('modal-open');
    productDialog.showModal();
}

productGrid.addEventListener('click', (event) => {
    const button = event.target.closest('[data-product]');

    if (button) {
        lastProductButton = button;
        openProduct(products.find(product => product.id === button.dataset.product));
    }
});

productDialog.addEventListener('change', () => {
    const selectedSize = productDialog.querySelector('[name="size"]:checked').value;
    let total = Math.round(Number(selectedProduct.price) * 100);

    total += Math.round(Number(selectedProduct.sizes[selectedSize]['add-price']) * 100);
    productDialog.querySelectorAll('[name="additive"]:checked').forEach(input => {
        total += Math.round(Number(selectedProduct.additives[input.value]['add-price']) * 100);
    });

    productDialog.querySelector('output').textContent = `$${(total / 100).toFixed(2)}`;
});

productDialog.addEventListener('click', (event) => {
    const rectangle = productDialog.getBoundingClientRect();
    const outside = event.clientX < rectangle.left || event.clientX > rectangle.right
        || event.clientY < rectangle.top || event.clientY > rectangle.bottom;

    if (event.target.closest('.modal-close') || (event.target === productDialog && outside)) {
        productDialog.close();
    }
});

productDialog.addEventListener('close', () => {
    document.documentElement.classList.remove('modal-open');

    if (lastProductButton?.isConnected) {
        lastProductButton.focus({ preventScroll: true });
    }
});

renderProducts();
