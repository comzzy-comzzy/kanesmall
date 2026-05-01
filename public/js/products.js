// Products functionality for the product listing page
class ProductListing {
    constructor() {
        this.products = [];
        this.container = document.getElementById('products-container');
        this.init();
    }

    async init() {
        try {
            await this.loadProducts();
            this.renderProducts();
        } catch (error) {
            this.showError('Failed to load products. Please try again later.');
            console.error('Error loading products:', error);
        }
    }

    async loadProducts() {
        const response = await fetch('/api/products');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        this.products = await response.json();
    }

    renderProducts() {
        if (this.products.length === 0) {
            this.container.innerHTML = '<div class="error">No products available at the moment.</div>';
            return;
        }

        const productsHTML = this.products.map(product => `
            <div class="product-card" data-product-id="${product.id}">
                <a href="/product.html?id=${product.id}" class="product-link">
                    <div class="product-image">
                        ${product.imageUrl ? 
                            `<img src="${product.imageUrl}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">` :
                            '<span>🛍️</span>'
                        }
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${this.escapeHtml(product.name)}</h3>
                        <div class="product-price">$${product.price.toFixed(2)}</div>
                    </div>
                </a>
                <div class="product-actions">
                    <button class="add-to-bag-btn" onclick="productListing.addToBag(${product.id})">
                        Add to Bag
                    </button>
                </div>
            </div>
        `).join('');

        this.container.innerHTML = productsHTML;
    }

    addToBag(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            window.shoppingBag.addProduct(productId, product);
        }
    }

    showError(message) {
        this.container.innerHTML = `<div class="error">${message}</div>`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the product listing when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.productListing = new ProductListing();
});
