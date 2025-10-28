from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
from pathlib import Path

# ====== Setup ======
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server default port
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

DATA_FILE = Path("data/catalogue.json")
USER_FILE = Path("data/users.json")

# ====== Helper functions ======
def load_items():
    if DATA_FILE.exists():
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    return []

def save_items(items):
    with open(DATA_FILE, "w") as f:
        json.dump(items, f, indent=4)

def load_users():
    if USER_FILE.exists():
        with open(USER_FILE, "r") as f:
            return json.load(f)
    return []

def save_users(users):
    with open(USER_FILE, "w") as f:
        json.dump(users, f, indent=4)

# ====== Models ======
class Item(BaseModel):
    id: int
    name: str
    price: float
    stock: int

class User(BaseModel):
    id: int
    name: str
    email: str
    password: str

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

@app.post("/register")
async def register_user(new_user: User):
    """Add a new user to the system."""
    users = load_users()
    # Check for existing email
    for user in users:
        if user["email"] == new_user.email:
            raise HTTPException(status_code=400, detail="Email already exists")
    
    # Create unique ID
    new_user.id = max([user["id"] for user in users], default=0) + 1
    # Append and save new user
    user_data = new_user.model_dump()
    users.append(user_data)
    save_users(users)
    
    return {"message": "Registration successful", "user": user_data}

@app.post("/login")
async def authenticate_user(user_to_authenticate: User):
    """Check login information matches with the system."""
    users = load_users()
    for db_user in users:
        if db_user["email"] == user_to_authenticate.email and db_user["password"] == user_to_authenticate.password:
            return {"message": "Login successful", "user": db_user} # Do the thing that does the authentication and returns a token or whatever
    raise HTTPException(status_code=401, detail="Invalid email or password")
