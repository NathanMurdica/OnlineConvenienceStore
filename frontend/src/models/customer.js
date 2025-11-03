import ShoppingCart from '../models/shoppingCart.js';

class Customer {
    constructor({ id = null, name = '', email = '', password = '', cart = null } = {}) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        // accept an existing ShoppingCart if provided, otherwise make a new one
        this.cart = cart instanceof ShoppingCart ? cart : new ShoppingCart();
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
            password: this.password,
            cart: this.cart.toJSON(),
        };
    }

    static fromJSON(json) {
        const customer = new Customer({
            id: json.id,
            name: json.name,
            email: json.email,
            password: json.password,
            cart: ShoppingCart.fromJSON(json.cart),
        });
        return customer;
    }
}

export { ShoppingCart };
export default Customer;
