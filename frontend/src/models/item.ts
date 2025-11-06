/*
    Item model class for the frontend application.
    Represents a single store item with helper methods for formatting and logic.
*/

export default class Item {
    id: number;
    name: string;
    price: number;
    stock: number;

    constructor(id: number, name: string, price: number, stock: number) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.stock = stock;
    }

    // --- Helper methods ---

    get formattedPrice(): string {
        // returns "$2.00"
        return `$${this.price.toFixed(2)}`;
    }

    get isAvailable(): boolean {
        return this.stock > 0;
    }

    decreaseStock(amount = 1) {
        if (this.stock >= amount) {
            this.stock -= amount;
        }
    }

    increaseStock(amount = 1) {
        this.stock += amount;
    }

    toJSON(): any {
        // makes sure the object is serializable for API calls
        return {
            id: this.id,
            name: this.name,
            price: this.price,
            stock: this.stock
        };
    }

    static fromJSON(json: any): Item {
        // convenient factory for constructing an Item from API data
        return new Item(json.id, json.name, json.price, json.stock);
    }
}
