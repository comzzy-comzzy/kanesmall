// Product Detail functionality
class ProductDetail {
    constructor() {
        this.product = null;
        this.container = document.getElementById('product-container');
        this.productId = this.getProductIdFromUrl();
        this.init();
    }

    async init() {
        if (!this.productId) {
            this.showError('Product ID not found in URL.');
            return;
        }

        try {
            await this.loadProduct();
            this.renderProduct();
            
            // Listen for bag changes to update product states if needed
            window.shoppingBag.on('bagChanged', (data) => {
                // If we implement product-specific bag states in the future
                // this.updateProductState(data.items);
            });
        } catch (error) {
            this.showError('Failed to load product details. Please try again later.');
            console.error('Error loading product:', error);
        }
    }

    getProductIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    async loadProduct() {
        const response = await fetch(`/api/products/${this.productId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        this.product = await response.json();
    }

    renderProduct() {
        if (!this.product) {
            this.showError('Product not found.');
            return;
        }

        const productHTML = `
            <div class="product-detail">
                <a href="/" class="back-link">← Back to Products</a>
                
                <div class="product-detail-content">
                    <div class="product-detail-image">
                        ${this.product.imageUrl ? 
                            `<img src="${this.product.imageUrl}" alt="${this.product.name}" class="detail-image">` :
                            '<div class="detail-image-placeholder">🛍️</div>'
                        }
                    </div>
                    
                    <div class="product-detail-info">
                        <h1 class="product-detail-name">${this.escapeHtml(this.product.name)}</h1>
                        <div class="product-detail-price">$${this.product.price.toFixed(2)}</div>
                        <p class="product-detail-description">${this.escapeHtml(this.product.description)}</p>
                        
                        <div class="product-detail-actions">
                            <button class="add-to-bag-btn large" onclick="productDetail.addToBag()">
                                Add to Bag
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.container.innerHTML = productHTML;
        
        // Update page title
        document.title = `${this.product.name} - Simple Shopping Site`;
    }

    addToBag() {
        if (this.product) {
            window.shoppingBag.addProduct(this.productId, this.product);
        }
    }

    showError(message) {
        this.container.innerHTML = `
            <div class="error">
                <p>${message}</p>
                <a href="/" class="back-link">← Back to Products</a>
            </div>
        `;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the product detail when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.productDetail = new ProductDetail();
});
