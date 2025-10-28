from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import json
from pathlib import Path

# ====== Setup ======
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FILE = Path("data/catalogue.json")

# ====== Helper functions ======
def load_items():
    if DATA_FILE.exists():
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    return []

def save_items(items):
    with open(DATA_FILE, "w") as f:
        json.dump(items, f, indent=4)

# ====== Models ======
class Item(BaseModel):
    id: int
    name: str
    price: float
    stock: int

class CheckoutItem(BaseModel):
    id: int
    quantity: int

class CheckoutRequest(BaseModel):
    items: List[CheckoutItem]

# ====== API Routes ======

@app.get("/items")
async def get_items():
    """Return all catalogue items."""
    items = load_items()
    return {"items": items}

@app.post("/checkout")
async def checkout(request: CheckoutRequest):
    """
    Deduct stock levels based on purchased items.
    Expects: { "items": [ {"id": 1, "quantity": 2}, {"id": 3, "quantity": 1} ] }
    """
    items = load_items()
    item_map = {item["id"]: item for item in items}

    # Validate and update stock
    for order_item in request.items:
        if order_item.id not in item_map:
            return {"message": "Checkout failed", "error": f"Item ID {order_item.id} not found"}
        if item_map[order_item.id]["stock"] < order_item.quantity:
            return {"message": "Checkout failed", "error": f"Not enough stock for item ID {order_item.id}"}
        item_map[order_item.id]["stock"] -= order_item.quantity

    # Save updated stock to file
    updated_items = list(item_map.values())
    save_items(updated_items)

    return {"message": "Checkout successful"}
