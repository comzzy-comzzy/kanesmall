// Shopping Bag Management Module
class ShoppingBag {
    constructor() {
        this.bag = this.loadBag();
        this.updateBagIndicator();
    }

    // Load bag from localStorage
    loadBag() {
        try {
            const stored = localStorage.getItem('shoppingBag');
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.error('Error loading bag from localStorage:', error);
            return {};
        }
    }

    // Save bag to localStorage
    saveBag() {
        try {
            localStorage.setItem('shoppingBag', JSON.stringify(this.bag));
            this.updateBagIndicator();
        } catch (error) {
            console.error('Error saving bag to localStorage:', error);
        }
    }

    // Add product to bag
    addProduct(productId, productData) {
        if (this.bag[productId]) {
            // Increment quantity if product already in bag
            this.bag[productId].quantity += 1;
        } else {
            // Add new product to bag
            this.bag[productId] = {
                id: productId,
                name: productData.name,
                price: productData.price,
                imageUrl: productData.imageUrl,
                quantity: 1
            };
        }
        this.saveBag();
        this.showAddConfirmation(productData.name);
    }

    // Remove product from bag
    removeProduct(productId) {
        if (this.bag[productId]) {
            delete this.bag[productId];
            this.saveBag();
        }
    }

    // Update product quantity
    updateQuantity(productId, quantity) {
        if (this.bag[productId]) {
            if (quantity <= 0) {
                this.removeProduct(productId);
            } else {
                this.bag[productId].quantity = quantity;
                this.saveBag();
            }
        }
    }

    // Get bag items as array
    getItems() {
        return Object.values(this.bag);
    }

    // Get total number of items in bag
    getTotalItems() {
        return Object.values(this.bag).reduce((total, item) => total + item.quantity, 0);
    }

    // Calculate subtotal
    getSubtotal() {
        return Object.values(this.bag).reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    // Clear entire bag
    clearBag() {
        this.bag = {};
        this.saveBag();
    }

    // Update bag indicator in header
    updateBagIndicator() {
        const bagIndicator = document.getElementById('bag-indicator');
        if (bagIndicator) {
            const totalItems = this.getTotalItems();
            bagIndicator.textContent = totalItems > 0 ? `Bag (${totalItems})` : 'Bag';
            bagIndicator.classList.toggle('has-items', totalItems > 0);
        }
    }

    // Show add confirmation (non-intrusive notification)
    showAddConfirmation(productName) {
        // Create a simple toast notification
        const notification = document.createElement('div');
        notification.className = 'bag-notification';
        notification.innerHTML = `
            <span>✓ Added ${productName} to bag</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #059669;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            font-weight: 500;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Global bag instance
window.shoppingBag = new ShoppingBag();

// Add CSS animations for notifications
if (!document.querySelector('#bag-styles')) {
    const style = document.createElement('style');
    style.id = 'bag-styles';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}
