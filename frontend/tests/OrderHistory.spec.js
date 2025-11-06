import { mount, flushPromises } from '@vue/test-utils';
import OrderHistory from '../src/views/OrderHistory.vue';
import Customer from '../src/models/customer.js';

// Mock localStorage
class LocalStorageMock {
  constructor() { this.store = {}; }
  getItem(key) { return this.store[key] || null; }
  setItem(key, value) { this.store[key] = value.toString(); }
}
global.localStorage = new LocalStorageMock();

// Mock fetch
global.fetch = vi.fn();

describe('OrderHistory.vue', () => {
  let customer;

  beforeEach(() => {
    vi.clearAllMocks();

    customer = new Customer({ id: 1, name: 'Test User', email: 'test@example.com' });
    localStorage.setItem('customer', JSON.stringify(customer));
  });

  it('fetches orders for current user and renders them', async () => {
    // Mock API response
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        orders: [
          {
            id: 101,
            date: '2025-11-06T13:41:00.000Z',
            items: [{ id: 1, name: 'Item 1', quantity: 2, price: 10 }],
            total: 20
          }
        ]
      })
    });

    const wrapper = mount(OrderHistory);
    await flushPromises();

    expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:8000/orders/1');
    expect(wrapper.text()).toContain('Item 1');
    expect(wrapper.text()).toContain('$20.00');
  });

  it('shows no orders message when user has no orders', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ orders: [] })
    });

    const wrapper = mount(OrderHistory);
    await flushPromises();

    expect(wrapper.text()).toContain('No past orders found.');
  });
});
