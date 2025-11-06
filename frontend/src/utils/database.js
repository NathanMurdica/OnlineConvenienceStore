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

// ========== User Registration ==========
export async function registerUser(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.detail || 'Registration failed');
        }

        console.log('Registration success:', data.message);
        return data;
    } catch (error) {
        console.error('Registration Error:', error);
        throw error;
    }
}

// ========== User Login ==========
export async function loginUser(credentials) {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.detail || 'Login failed');
        }

        const data = await response.json();
        console.log('Login success:', data.message);
        console.log('User data:', credentials);
        return data.user || null;
    } catch (error) {
        console.error('Login Error:', error);
        throw error;
    }
}

export async function checkoutOrder(order) {
  /*
      order should be an Order instance with .toJSON() method
      Example:
      {
          user_id: 1,
          items: [
              { id: 1, quantity: 2 },
              { id: 3, quantity: 1 }
          ],
          date: "2025-11-06T14:00:00.000Z"
      }
  */
  try {
    const response = await fetch(`${API_BASE_URL}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order.toJSON()),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.detail || 'Checkout failed');
    }

    return data; // { message: 'Checkout successful' }
  } catch (error) {
    console.error('Checkout Error:', error);
    throw error;
  }
}