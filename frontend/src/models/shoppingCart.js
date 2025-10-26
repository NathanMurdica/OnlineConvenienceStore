import Item from "./item.js";

export default class ShoppingCart {
    constructor() {
        this.items = []; // { item: Item, quantity: number }
    }

    addItem(item, quantity = 1) {
        const existing = this.items.find(i => i.item.id === item.id);
        if (existing) {
            if (existing.quantity < item.stock) {
                existing.quantity += quantity;
            }
        } else {
            this.items.push({ item, quantity });
        }

        console.log(`Added ${quantity} of ${item.name} to cart.`);
    }

    removeItem(itemId) {
        this.items = this.items.filter(i => i.item.id !== itemId);
    }

    increaseQuantity(itemId) {
        const entry = this.items.find(i => i.item.id === itemId);
        if (entry && entry.quantity < entry.item.stock) {
            entry.quantity++;
        }
    }

    decreaseQuantity(itemId) {
        const entry = this.items.find(i => i.item.id === itemId);
        if (entry && entry.quantity > 1) {
            entry.quantity--;
        }
    }

    get totalPrice() {
        return this.items.reduce(
            (sum, entry) => sum + entry.item.price * entry.quantity,
            0
        );
    }

    get formattedTotal() {
        return `$${this.totalPrice.toFixed(2)}`;
    }

    toJSON() {
        return this.items.map(({ item, quantity }) => ({
            ...item.toJSON(),
            quantity,
        }));
    }

    static fromJSON(cartData) {
        const cart = new ShoppingCart();
        cart.items = cartData.map(d => ({
            item: Item.fromJSON(d),
            quantity: d.quantity
        }));
        return cart;
    }
}