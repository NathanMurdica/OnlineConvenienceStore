// frontend/src/models/customer.js

import ShoppingCart from '../models/shoppingCart.js'; 

class Customer {
    constructor({ id = null, name = '', email = '' } = {}) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.cart = new ShoppingCart();
    }

    addToCart(item) {
        this.cart.addItem(item);
    }

    removeFromCart(productId) {
        this.cart.removeItem(productId);
    }

    updateCartQuantity(productId, quantity) {
        this.cart.updateQuantity(productId, quantity);
    }

    checkout() {
        const total = this.cart.totalPrice;
        const items = this.cart.items;
        
        this.cart.clear();
        return { total, items };
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            cart: this.cart.items.map(({ item, quantity }) => ({
                ...item.toJSON(),
                quantity,
            })),
        };
    }
}

export { ShoppingCart };
export default Customer;