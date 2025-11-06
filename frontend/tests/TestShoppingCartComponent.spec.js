import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import ShoppingCartComponent from '../src/components/ShoppingCart.vue';
import ShoppingCart from '../src/models/shoppingCart.ts';
import Item from '../src/models/item.ts';

describe('ShoppingCart.vue Component', () => {
  let cart;

  beforeEach(() => {
    cart = new ShoppingCart();
    // create new sample items for tests
    const apple = new Item(1, 'Apple', 2.5, 5);
    const banana = new Item(2, 'Banana', 1.0, 3);
    cart.addItem(apple, 2);
    cart.addItem(banana, 1);
  });

  // -------------------------------
  // Test 1: Component renders correctly
  // -------------------------------
  it('renders the shopping cart heading and structure', () => {
    const wrapper = mount(ShoppingCartComponent, { // mount the component with cart prop
      props: { cart },
    });

    expect(wrapper.find('h5').text()).toBe('Shopping Cart');
    expect(wrapper.find('table').exists()).toBe(true);
  });

  // -------------------------------
  // Test 2: Displays items in the cart
  // -------------------------------
  it('renders all items in the table', () => {
    const wrapper = mount(ShoppingCartComponent, {
      props: { cart },
    });

    const rows = wrapper.findAll('tbody tr');
    expect(rows.length).toBe(2); // expect two cart items
    expect(wrapper.text()).toContain('Apple');
    expect(wrapper.text()).toContain('Banana');
  });

  // -------------------------------
  // Test 3: Displays total price correctly
  // -------------------------------
  it('shows correct total price at the bottom', () => {
    const wrapper = mount(ShoppingCartComponent, {
      props: { cart },
    });

    expect(wrapper.text()).toContain(cart.formattedTotal);
  });

  // -------------------------------
  // Test 4: Emits correct events when buttons are clicked
  // -------------------------------
  it('emits events for increase, decrease, remove, and checkout', async () => {
    const wrapper = mount(ShoppingCartComponent, {
      props: { cart },
    });

    const buttons = wrapper.findAll('button');

    // Increase button
    await buttons.find(btn => btn.text() === '+').trigger('click');
    expect(wrapper.emitted()).toHaveProperty('increase'); // pass emit to the catalogue

    // Decrease button
    await buttons.find(btn => btn.text() === '−').trigger('click');
    expect(wrapper.emitted()).toHaveProperty('decrease');

    // Remove button
    await buttons.find(btn => btn.text() === '✖').trigger('click');
    expect(wrapper.emitted()).toHaveProperty('remove');

    // Checkout button
    await buttons.find(btn => btn.text() === 'Checkout').trigger('click');
    expect(wrapper.emitted()).toHaveProperty('checkout');
  });

  // -------------------------------
  // Test 5: Empty cart shows message
  // -------------------------------
  it('displays "No items in cart" when cart is empty', () => {
    const emptyCart = new ShoppingCart();
    const wrapper = mount(ShoppingCartComponent, {
      props: { cart: emptyCart },
    });

    expect(wrapper.text()).toContain('No items in cart');
  });
});
