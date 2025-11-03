// import Vue Test Utils helpers and Vitest testing functions
import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// import the component under test
import Catalogue from '../src/views/Catalogue.vue';

// import the backend utility to mock
import { fetchItems } from '../src/utils/database.js';

// ===============================
// Mock Modules
// ===============================

// mock fetchItems to control what data the component receives from the backend.
// this ensures tests do not depend on live API calls.
vi.mock('../src/utils/database.js', () => ({
    fetchItems: vi.fn(),
}));

// mock ShoppingCart to simplify testing and avoid rendering its full implementation.
// the Catalogue component only needs to know that it exists.
vi.mock('../src/components/ShoppingCart.vue', () => ({
    default: {
        name: 'ShoppingCart',
        template: '<div class="mock-cart"></div>',
    },
}));

// ===============================
// Test Suite for Catalogue.vue
// ===============================
describe('Catalogue.vue', () => {

    // reset all mocks before each test to prevent test interference
    beforeEach(() => {
        vi.resetAllMocks();
    });

    // -------------------------------
    // Test 1: Heading renders correctly
    // -------------------------------
    it('renders catalogue heading correctly', async () => {
        // simulate API returning an empty catalogue
        fetchItems.mockResolvedValueOnce([]);

        // mount the component
        const wrapper = mount(Catalogue);
        await flushPromises(); // wait for async lifecycle hooks

        // assert that the heading text matches
        expect(wrapper.find('h2').text()).toBe('Product Catalogue');
    });

    // -------------------------------
    // Test 2: Renders multiple items
    // -------------------------------
    it('renders multiple product cards from fetched items', async () => {
        // mock backend response with two items
        fetchItems.mockResolvedValueOnce([
            { id: 1, name: 'Apple', price: 2.5, stock: 10 },
            { id: 2, name: 'Orange', price: 3.0, stock: 0 },
        ]);

        // mount and wait for rendering to complete
        const wrapper = mount(Catalogue);
        await flushPromises();

        // verify both product cards are displayed
        const cards = wrapper.findAll('.card');
        expect(cards.length).toBe(2);
        expect(cards[0].text()).toContain('Apple');
        expect(cards[1].text()).toContain('Orange');
    });

    // -------------------------------
    // Test 3: Displays stock correctly
    // -------------------------------
    it('displays correct stock status for available and out-of-stock items', async () => {
        // provide one available and one out-of-stock item
        fetchItems.mockResolvedValueOnce([
            { id: 1, name: 'Laptop', price: 1000, stock: 3 },
            { id: 2, name: 'Mouse', price: 25, stock: 0 },
        ]);

        const wrapper = mount(Catalogue);
        await flushPromises();

        // check text for correct stock status indicators
        const texts = wrapper.text();
        expect(texts).toContain('In stock: 3');
        expect(texts).toContain('Out of stock');
    });

    // -------------------------------
    // Test 4: Add to Cart button behavior
    // -------------------------------
    it('disables Add to Cart button when item is out of stock', async () => {
        // mock a single out-of-stock item
        fetchItems.mockResolvedValueOnce([
            { id: 1, name: 'Keyboard', price: 50, stock: 0 },
        ]);

        const wrapper = mount(Catalogue);
        await flushPromises();

        // verify that the "Add to Cart" button is disabled
        const button = wrapper.find('button');
        expect(button.attributes('disabled')).toBeDefined();
    });
});
