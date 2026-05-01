// Bag Page functionality
class BagPage {
    constructor() {
        this.container = document.getElementById('bag-container');
        this.init();
    }

    init() {
        this.renderBag();
    }

    renderBag() {
        const bagItems = window.shoppingBag.getItems();
        
        if (bagItems.length === 0) {
            this.container.innerHTML = `
                <div class="empty-bag">
                    <h3>Your bag is empty</h3>
                    <p>Start shopping to add some items!</p>
                    <a href="/" class="continue-shopping-btn">Continue Shopping</a>
                </div>
            `;
            return;
        }

        const subtotal = window.shoppingBag.getSubtotal();
        
        const bagHTML = `
            <div class="bag-items">
                ${bagItems.map(item => `
                    <div class="bag-item" data-product-id="${item.id}">
                        <div class="bag-item-image">
                            ${item.imageUrl ? 
                                `<img src="${item.imageUrl}" alt="${item.name}">` :
                                '<span>🛍️</span>'
                            }
                        </div>
                        <div class="bag-item-details">
                            <h3 class="bag-item-name">${this.escapeHtml(item.name)}</h3>
                            <div class="bag-item-price">$${item.price.toFixed(2)} each</div>
                            <div class="bag-item-quantity">
                                <button onclick="bagPage.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                                <span>Qty: ${item.quantity}</span>
                                <button onclick="bagPage.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                            </div>
                            <div class="bag-item-total">Total: $${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                        <button class="remove-item-btn" onclick="bagPage.removeItem(${item.id})">
                            Remove
                        </button>
                    </div>
                `).join('')}
            </div>
            
            <div class="bag-summary">
                <div class="subtotal">
                    <strong>Subtotal: $${subtotal.toFixed(2)}</strong>
                </div>
                <button class="clear-bag-btn" onclick="bagPage.clearBag()">
                    Clear Bag
                </button>
            </div>
        `;

        this.container.innerHTML = bagHTML;
    }

    updateQuantity(productId, newQuantity) {
        window.shoppingBag.updateQuantity(productId, newQuantity);
        this.renderBag();
    }

    removeItem(productId) {
        window.shoppingBag.removeProduct(productId);
        this.renderBag();
    }

    clearBag() {
        if (confirm('Are you sure you want to clear your bag?')) {
            window.shoppingBag.clearBag();
            this.renderBag();
        }
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
