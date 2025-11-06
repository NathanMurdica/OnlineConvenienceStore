import Item from "./item.ts";
import { debug } from "../utils/debug.js";

class ShoppingCart {
    items: { item: Item; quantity: number }[];

    constructor() {
        this.items = []; // { item: Item, quantity: number }
    }

    addItem(item: Item, quantity: number = 1) {
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

    removeItem(itemId: number) {
        this.items = this.items.filter(i => i.item.id !== itemId);
    }

    increaseQuantity(itemId: number) {
        const entry = this.items.find(i => i.item.id === itemId);
        if (entry && entry.quantity < entry.item.stock) {
            entry.quantity++;
        }
    }

    decreaseQuantity(itemId: number) {
        const entry = this.items.find(i => i.item.id === itemId);
        if (entry && entry.quantity > 1) {
            entry.quantity--;
        }
    }

    get totalPrice(): number {
        return this.items.reduce(
            (sum, entry) => sum + entry.item.price * entry.quantity,
            0
        );
    }

    get formattedTotal(): string {
        return `$${this.totalPrice.toFixed(2)}`;
    }

    toJSON(): any[] {
        return this.items.map(({ item, quantity }) => ({
            ...item.toJSON(),
            quantity,
        }));
    }

    static fromJSON(cartData: any): ShoppingCart {
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