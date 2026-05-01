// Shopping Bag Management Module
class ShoppingBag {
    constructor() {
        this.bag = this.loadBag();
        this.isDrawerOpen = false;
        this.updateBagIndicator();
        this.initDrawer();
        this.listeners = [];
    }

    // Event system for cross-component updates
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('Error in bag event listener:', error);
                }
            });
        }
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

    // Save bag to localStorage and notify all listeners
    saveBag() {
        try {
            localStorage.setItem('shoppingBag', JSON.stringify(this.bag));
            this.updateBagIndicator();
            this.updateDrawer();
            // Emit change event for all listeners
            this.emit('bagChanged', {
                items: this.getItems(),
                totalItems: this.getTotalItems(),
                subtotal: this.getSubtotal()
            });
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
        
        // Emit specific add event
        this.emit('itemAdded', {
            productId: productId,
            product: this.bag[productId],
            totalItems: this.getTotalItems()
        });
    }

    // Remove product from bag
    removeProduct(productId) {
        if (this.bag[productId]) {
            const removedItem = this.bag[productId];
            delete this.bag[productId];
            this.saveBag();
            
            // Emit specific remove event
            this.emit('itemRemoved', {
                productId: productId,
                removedItem: removedItem,
                totalItems: this.getTotalItems()
            });
        }
    }

    // Update product quantity
    updateQuantity(productId, quantity) {
        if (this.bag[productId]) {
            const oldQuantity = this.bag[productId].quantity;
            if (quantity <= 0) {
                this.removeProduct(productId);
            } else {
                this.bag[productId].quantity = quantity;
                this.saveBag();
                
                // Emit specific quantity change event
                this.emit('quantityChanged', {
                    productId: productId,
                    oldQuantity: oldQuantity,
                    newQuantity: quantity,
                    product: this.bag[productId]
                });
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
        const clearedItems = this.getItems();
        this.bag = {};
        this.saveBag();
        
        // Emit clear event
        this.emit('bagCleared', {
            clearedItems: clearedItems,
            totalItems: 0
        });
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

    // Bag Drawer Functionality
    initDrawer() {
        // Add click handler to bag indicator
        const bagIndicator = document.getElementById('bag-indicator');
        if (bagIndicator) {
            bagIndicator.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleDrawer();
            });
        }

        // Close drawer when clicking overlay
        const overlay = document.querySelector('.bag-drawer-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                this.closeDrawer();
            });
        }

        // Close drawer with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isDrawerOpen) {
                this.closeDrawer();
            }
        });

        // Initial drawer update
        this.updateDrawer();
    }

    toggleDrawer() {
        if (this.isDrawerOpen) {
            this.closeDrawer();
        } else {
            this.openDrawer();
        }
    }

    openDrawer() {
        const drawer = document.getElementById('bag-drawer');
        if (drawer) {
            drawer.classList.add('open');
            this.isDrawerOpen = true;
            // Prevent body scroll when drawer is open
            document.body.style.overflow = 'hidden';
        }
    }

    closeDrawer() {
        const drawer = document.getElementById('bag-drawer');
        if (drawer) {
            drawer.classList.remove('open');
            this.isDrawerOpen = false;
            // Restore body scroll
            document.body.style.overflow = '';
        }
    }

    updateDrawer() {
        const drawerBody = document.getElementById('bag-drawer-body');
        const subtotalElement = document.getElementById('bag-drawer-subtotal');
        
        if (!drawerBody || !subtotalElement) return;

        const bagItems = this.getItems();
        const subtotal = this.getSubtotal();

        if (bagItems.length === 0) {
            drawerBody.innerHTML = `
                <div class="empty-bag-drawer">
                    <p>Your bag is empty</p>
                    <p>Start shopping to add some items!</p>
                </div>
            `;
        } else {
            drawerBody.innerHTML = bagItems.map(item => `
                <div class="bag-drawer-item">
                    <div class="bag-drawer-item-image">
                        ${item.imageUrl ? 
                            `<img src="${item.imageUrl}" alt="${item.name}">` :
                            '<span>🛍️</span>'
                        }
                    </div>
                    <div class="bag-drawer-item-details">
                        <h4 class="bag-drawer-item-name">${this.escapeHtml(item.name)}</h4>
                        <div class="bag-drawer-item-price">$${item.price.toFixed(2)} each</div>
                        <div class="bag-drawer-item-quantity">
                            <button onclick="shoppingBag.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                            <span>Qty: ${item.quantity}</span>
                            <button onclick="shoppingBag.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        </div>
                        <div class="bag-drawer-item-total">Total: $${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                    <button class="bag-drawer-item-remove" onclick="shoppingBag.removeProduct(${item.id})">
                        ×
                    </button>
                </div>
            `).join('');
        }

        subtotalElement.textContent = subtotal.toFixed(2);
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

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
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
