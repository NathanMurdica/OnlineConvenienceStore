import Item from "./item.js";
import { debug } from "../utils/debug.js";

class ShoppingCart {
    items;

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

        debug(`Added ${quantity} of ${item.name} to cart.`);
    }

    removeItem(itemId) {
        this.items = this.items.filter(i => i.item.id !== itemId);
    }

    increaseQuantity(itemId) {
        const index = this.items.findIndex(i => i.item.id === itemId);
        if (index >= 0 && this.items[index].quantity < this.items[index].item.stock) {
            // Create new array with updated entry to trigger reactivity
            this.items = [
                ...this.items.slice(0, index),
                { ...this.items[index], quantity: this.items[index].quantity + 1 },
                ...this.items.slice(index + 1)
            ];
        }
    }

    decreaseQuantity(itemId) {
        const index = this.items.findIndex(i => i.item.id === itemId);
        if (index >= 0 && this.items[index].quantity > 1) {
            // Create new array with updated entry to trigger reactivity
            this.items = [
                ...this.items.slice(0, index),
                { ...this.items[index], quantity: this.items[index].quantity - 1 },
                ...this.items.slice(index + 1)
            ];
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
        
        // Handle null, undefined, or non-array input
        if (!cartData || !Array.isArray(cartData)) {
            debug('(ShoppingCart.fromJSON) No valid cart data provided, creating empty cart.');
            return cart;
        }
        
        debug('(ShoppingCart.fromJSON) Deserializing ShoppingCart from JSON:', cartData);
        
        cartData.forEach(item => {
            if (item && typeof item === 'object') {
                const itemData = item.item || item; // handle both {item, quantity} and direct item format
                cart.items.push({
                    item: Item.fromJSON(itemData),
                    quantity: item.quantity || 1
                });
            }
        });
        
        return cart;
    }
}

export { ShoppingCart };
export default ShoppingCart;