/*
    Database model definitions and configurations for the frontend application.
    Handles API calls to the backend to fetch and manipulate data.
*/

import Item from '../models/item.js';

const API_BASE_URL = 'http://localhost:8000'; // FastAPI default port

// ========== Fetch all items ==========
export async function fetchItems() {
    try {
        const response = await fetch(`${API_BASE_URL}/items`);
        if (!response.ok) throw new Error(`Error fetching items: ${response.statusText}`);

        const data = await response.json();
        return (data.items || []).map(Item.fromJSON);
    } catch (error) {
        console.error('Fetch Items Error:', error);
        return [];
    }
}

// ========== Checkout ==========
export async function checkout(cartItems) {
    /*
        cartItems should be an array of objects like:
        [
            { id: 1, quantity: 2 },
            { id: 3, quantity: 1 }
        ]
    */

    try {
        const response = await fetch(`${API_BASE_URL}/checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: cartItems }),
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.detail || 'Checkout failed');
        }

        const data = await response.json();
        console.log('Checkout success:', data.message);
        return data.updated_items || [];
    } catch (error) {
        console.error('Checkout Error:', error);
        throw error;
    }
}
