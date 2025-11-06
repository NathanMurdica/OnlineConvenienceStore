import Item from './item.js';

export default class Order {
  constructor({ userId = 0, items = [], date = new Date() } = {}) {
    this.userId = userId;
    // Ensure items are Item objects with quantity
    this.items = items.map(i => ({
      item: i.item instanceof Item ? i.item : Item.fromJSON(i.item),
      quantity: i.quantity
    }));
    this.date = date;
  }

  get subtotal() {
    return this.items.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0);
  }

  get tax() {
    return this.subtotal * 0.1;
  }

  get total() {
    return this.subtotal + this.tax;
  }

  toJSON() {
    return {
      user_id: this.userId,
      items: this.items.map(({ item, quantity }) => ({
        id: item.id,
        quantity
      })),
      date: this.date.toISOString(),
    };
  }

  static fromCart(customer) {
    return new Order({
      userId: customer.id,
      items: customer.cart.items.map(entry => ({
        item: entry.item,
        quantity: entry.quantity
      }))
    });
  }
}
