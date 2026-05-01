// Bag Page functionality
class BagPage {
    constructor() {
        this.container = document.getElementById('bag-container');
        this.footer = document.getElementById('bag-page-footer');
        this.init();
    }

    init() {
        this.renderBag();
        
        // Listen for bag changes via the event system
        window.shoppingBag.on('bagChanged', (data) => {
            this.renderBag();
        });
        
        window.shoppingBag.on('itemAdded', (data) => {
            this.highlightUpdatedItem(data.productId);
        });
        
        window.shoppingBag.on('itemRemoved', (data) => {
            this.renderBag();
        });
        
        window.shoppingBag.on('quantityChanged', (data) => {
            this.highlightUpdatedItem(data.productId);
        });
        
        window.shoppingBag.on('bagCleared', (data) => {
            this.renderBag();
        });
        
        // Also listen for localStorage changes from other tabs
        window.addEventListener('storage', (e) => {
            if (e.key === 'shoppingBag') {
                this.renderBag();
            }
        });
    }

    renderBag() {
        const bagItems = window.shoppingBag.getItems();
        const totalItems = window.shoppingBag.getTotalItems();
        const subtotal = window.shoppingBag.getSubtotal();
        
        // Update item count in header
        const itemCountElement = document.getElementById('bag-item-count');
        if (itemCountElement) {
            itemCountElement.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'items'}`;
        }
        
        if (bagItems.length === 0) {
            this.container.innerHTML = `
                <div class="empty-bag">
                    <div class="empty-bag-icon">🛒</div>
                    <h3>Your bag is empty</h3>
                    <p>Looks like you haven't added anything to your bag yet.</p>
                    <a href="/" class="continue-shopping-btn">Start Shopping</a>
                </div>
            `;
            this.footer.style.display = 'none';
            return;
        }

        // Show footer when bag has items
        this.footer.style.display = 'block';
        
        // Update totals
        document.getElementById('bag-subtotal').textContent = subtotal.toFixed(2);
        document.getElementById('bag-total').textContent = subtotal.toFixed(2);

        const bagHTML = `
            <div class="bag-items">
                ${bagItems.map(item => `
                    <div class="bag-item" data-product-id="${item.id}" id="bag-item-${item.id}">
                        <div class="bag-item-image">
                            ${item.imageUrl ? 
                                `<img src="${item.imageUrl}" alt="${item.name}" loading="lazy">` :
                                '<span>🛍️</span>'
                            }
                        </div>
                        <div class="bag-item-details">
                            <h3 class="bag-item-name">${this.escapeHtml(item.name)}</h3>
                            <div class="bag-item-price">$${item.price.toFixed(2)} each</div>
                            <div class="bag-item-quantity-controls">
                                <button class="quantity-btn decrease" onclick="bagPage.updateQuantity(${item.id}, ${item.quantity - 1})" 
                                        ${item.quantity <= 1 ? 'disabled' : ''}>
                                    −
                                </button>
                                <span class="quantity-display">${item.quantity}</span>
                                <button class="quantity-btn increase" onclick="bagPage.updateQuantity(${item.id}, ${item.quantity + 1})">
                                    +
                                </button>
                            </div>
                            <div class="bag-item-total">
                                <strong>Total: $${(item.price * item.quantity).toFixed(2)}</strong>
                            </div>
                        </div>
                        <button class="remove-item-btn" onclick="bagPage.removeItem(${item.id})" 
                                title="Remove item from bag">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M3.646 3.646a.5.5 0 0 1 .708 0L8 7.293l3.646-3.647a.5.5 0 0 1 .708.708L8.707 8l3.647 3.646a.5.5 0 0 1-.708.708L8 8.707l-3.646 3.647a.5.5 0 0 1-.708-.708L7.293 8 3.646 4.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                        </button>
                    </div>
                `).join('')}
            </div>
        `;

        this.container.innerHTML = bagHTML;
    }

    highlightUpdatedItem(productId) {
        const itemElement = document.getElementById(`bag-item-${productId}`);
        if (itemElement) {
            // Add animation class
            itemElement.classList.add('updated');
            
            // Remove animation class after animation completes
            setTimeout(() => {
                itemElement.classList.remove('updated');
            }, 500);
        }
        
        // Re-render to ensure all quantities are up to date
        this.renderBag();
    }

    updateQuantity(productId, newQuantity) {
        window.shoppingBag.updateQuantity(productId, newQuantity);
    }

    removeItem(productId) {
        if (confirm('Are you sure you want to remove this item from your bag?')) {
            window.shoppingBag.removeProduct(productId);
        }
    }

    clearBag() {
        const bagItems = window.shoppingBag.getItems();
        if (bagItems.length === 0) {
            alert('Your bag is already empty!');
            return;
        }
        
        if (confirm('Are you sure you want to clear your entire bag?')) {
            window.shoppingBag.clearBag();
        }
    }

    proceedToCheckout() {
        const bagItems = window.shoppingBag.getItems();
        if (bagItems.length === 0) {
            alert('Your bag is empty. Add some items before proceeding to checkout.');
            return;
        }
        
        alert('Checkout functionality will be implemented in future versions.\n\nItems in your bag:\n' + 
              bagItems.map(item => `• ${item.name} (Qty: ${item.quantity})`).join('\n'));
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the bag page when it loads
document.addEventListener('DOMContentLoaded', () => {
    window.bagPage = new BagPage();
});
