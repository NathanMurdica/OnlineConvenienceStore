class ShoppingCart {
    constructor(items = []) {
        // items: [{ productId, name, price, quantity }]
        this.items = [...items];
    }
    
    // add or update item in cart
    addItem(item) {
        const { productId, quantity = 1 } = item;
        const existing = this.items.find(i => i.productId === productId);
        if (existing) {
            existing.quantity += quantity;
        } else {
            this.items.push({ ...item, quantity });
        }
    }

    removeItem(productId) {
        this.items = this.items.filter(i => i.productId !== productId);
    }

    updateQuantity(productId, quantity) {
        if (quantity <= 0) {
            this.removeItem(productId);
            return;
        }
        const item = this.items.find(i => i.productId === productId);
        if (item) item.quantity = quantity;
    }

    clear() {
        this.items = [];
    }

    getItems() {
        return [...this.items];
    }

    getItemCount() {
        return this.items.reduce((sum, i) => sum + i.quantity, 0);
    }

    getTotal() {
        return this.items.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0);
    }
}