import ShoppingCart from './shoppingCart.ts';
import { debug } from '../utils/debug.js';
import Item from './item.ts';

class Customer {
    id: number | null;
    name: string;
    email: string;
    password: string;
    cart: ShoppingCart;

    constructor({ id = null, name = '', email = '', password = '', cart = undefined }: { id?: number | null, name?: string, email?: string, password?: string, cart?: any } = {}) {
        debug('(Customer.constructor) Creating Customer:', { id, name, email, password, cart });
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        // accept an existing ShoppingCart if provided, otherwise make a new one
        this.cart = cart ? ShoppingCart.fromJSON(cart) : new ShoppingCart();
    }

    addToCart(item: Item) {
        this.cart.addItem(item);
    }

    removeFromCart(productId: number) {
        this.cart.removeItem(productId);
    }

    // updateCartQuantity(productId: number, quantity: number) {
    //     this.cart.updateQuantity(productId, quantity); // 'updateQuantity' does not exist on type 'ShoppingCart'
    // }

    checkout() {
        const total = this.cart.totalPrice;
        const items = this.cart.items;
        // this.cart.clear();
        this.cart = new ShoppingCart(); // reset to empty cart
        return { total, items };
    }

    toJSON(): any {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            password: this.password,
            cart: this.cart.toJSON(),
        };
    }

    static fromJSON(json: any): Customer {
        debug('(Customer.fromJSON) Deserializing Customer from JSON:', json);
        
        const cartData = Array.isArray(json.cart) ? json.cart : [];
        debug('(Customer.fromJSON) Cart data:', cartData);
        
        const customer = new Customer({
            id: json.id,
            name: json.name,
            email: json.email,
            password: json.password,
            cart: cartData // ShoppingCart constructor will handle this
        });
        
        debug('(Customer.fromJSON) Deserialized Customer from JSON:', customer);
        return customer;
    }

    static toLocalStorage(customer: Customer) {
        localStorage.setItem('customer', JSON.stringify(customer.toJSON()));
        debug('(Customer.toLocalStorage) Stored Customer in localStorage:', customer);
    }

    static fromLocalStorage(): Customer {
        const data = localStorage.getItem('customer');
        if (data) {
            debug('(Customer.fromLocalStorage) Customer data from localStorage:', data);
            try {
                debug('(Customer.fromLocalStorage) JSON.parse on customer data:', JSON.parse(data));
                const customer = Customer.fromJSON(JSON.parse(data));
                debug('(Customer.fromLocalStorage) Loaded Customer from localStorage:', customer);
                return customer;
            } catch (error) {
                console.error('Failed to parse customer from localStorage:', error)
                return new Customer();
            }
        }
        debug('(Customer.fromLocalStorage) No Customer found in localStorage, returning empty Customer.');
        return new Customer();
    }
}

export default Customer;
