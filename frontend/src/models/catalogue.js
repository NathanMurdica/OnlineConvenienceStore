// src/models/catalogue.js
import Item from './item.ts';
import { fetchItems } from '../utils/database.js';

export default class Catalogue {
    constructor() {
        this.items = [];
    }

    // fetch all items from backend
    async loadItems() {
        try {
            const data = await fetchItems();
            this.items = data.map(d => Item.fromJSON(d));
        } catch (err) {
            console.error('Failed to load catalogue items:', err);
            throw err;
        }
    }
}