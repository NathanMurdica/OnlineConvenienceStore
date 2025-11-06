import { describe, it, expect, beforeEach } from 'vitest';
import ShoppingCart from '../src/models/shoppingCart.ts';
import Item from '../src/models/item.ts';

describe('ShoppingCart Class', () => {
  let cart;
  let sampleItem;

  // Reset before each test
  beforeEach(() => {
    cart = new ShoppingCart();
    sampleItem = new Item(1, 'Apple', 2.5, 10); // create new sample item for tests
  });

  // -------------------------------
  // Test 1: Add a new item
  // -------------------------------
  it('adds a new item to the cart', () => {
    cart.addItem(sampleItem);
    expect(cart.items.length).toBe(1);
    expect(cart.items[0].item.name).toBe('Apple');
    expect(cart.items[0].quantity).toBe(1);
  });

  // -------------------------------
  // Test 2: Increase quantity if item already exists
  // -------------------------------
  it('increases quantity when same item is added again', () => {
    cart.addItem(sampleItem);
    cart.addItem(sampleItem);
    expect(cart.items.length).toBe(1);
    expect(cart.items[0].quantity).toBe(2);
  });

  // -------------------------------
  // Test 3: Remove an item
  // -------------------------------
  it('removes an item by ID', () => {
    cart.addItem(sampleItem);
    cart.removeItem(1);
    expect(cart.items.length).toBe(0);
  });

  // -------------------------------
  // Test 4: Increase quantity manually
  // -------------------------------
  it('increases quantity using increaseQuantity()', () => {
    cart.addItem(sampleItem);
    cart.increaseQuantity(1);
    expect(cart.items[0].quantity).toBe(2);
  });

  // -------------------------------
  // Test 5: Decrease quantity manually
  // -------------------------------
  it('decreases quantity using decreaseQuantity()', () => {
    cart.addItem(sampleItem);
    cart.increaseQuantity(1);
    cart.decreaseQuantity(1);
    expect(cart.items[0].quantity).toBe(1);
  });

  // -------------------------------
  // Test 6: Prevent quantity from going below 1
  // -------------------------------
  it('does not decrease quantity below 1', () => {
    cart.addItem(sampleItem);
    cart.decreaseQuantity(1);
    expect(cart.items[0].quantity).toBe(1);
  });

  // -------------------------------
  // Test 7: Calculates total price correctly
  // -------------------------------
  it('calculates total price correctly', () => {
    const banana = new Item(2, 'Banana', 1.0, 5);
    cart.addItem(sampleItem, 2); // 2 * 2.5 = 5.0
    cart.addItem(banana, 3);     // 3 * 1.0 = 3.0
    expect(cart.totalPrice).toBe(8.0);
    expect(cart.formattedTotal).toBe('$8.00');
  });

  // -------------------------------
  // Test 8: Converts cart to JSON
  // -------------------------------
  it('converts to JSON correctly', () => {
    cart.addItem(sampleItem, 2);
    const json = cart.toJSON();
    expect(Array.isArray(json)).toBe(true);
    expect(json[0]).toHaveProperty('id', 1);
    expect(json[0]).toHaveProperty('quantity', 2);
  });

  // -------------------------------
  // Test 9: Restores from JSON correctly
  // -------------------------------
  it('restores from JSON correctly', () => {
    const jsonData = [
      { id: 1, name: 'Apple', price: 2.5, stock: 10, quantity: 3 },
    ];
    const restored = ShoppingCart.fromJSON(jsonData);
    expect(restored.items.length).toBe(1);
    expect(restored.items[0].item.name).toBe('Apple');
    expect(restored.items[0].quantity).toBe(3);
  });
});
