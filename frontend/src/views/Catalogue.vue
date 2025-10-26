<template>
<!-- Main container -->
<div class="container mt-4 mb-5">

  <!-- Page heading -->
  <div class="row mb-4">
    <div class="col">
      <h2 class="fw-bold text-center text-md-start">Product Catalogue</h2>
      <hr class="mt-2 mb-4">
    </div>
  </div>

  <!-- Catalogue layout -->
  <div class="row">
    <!-- Left column: product flexbox -->
    <div class="col-12 col-md-8 mb-4 mb-md-0">
      <div class="d-flex flex-wrap justify-content-start gap-4 catalogue-grid">
        <div
          v-for="item in catalogueItems"
          :key="item.id"
          class="card p-3 shadow-sm flex-grow-1"
          style="flex-basis: calc(33.333% - 1rem); max-width: 250px;"
        >
          <div class="card-body text-center">
            <h5 class="card-title">{{ item.name }}</h5>
            <p class="card-text text-muted">{{ item.formattedPrice }}</p>
            <p v-if="item.isAvailable" class="text-success">
              In stock: {{ item.stock }}
            </p>
            <p v-else class="text-danger">Out of stock</p>
            <button
              class="btn btn-primary btn-sm w-100"
              :disabled="!item.isAvailable"
              @click="addToCart(item)"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Right column: shopping cart summary -->
    <div class="col-12 col-md-4">
        <ShoppingCart 
          :cart="customer?.cart"
          @increase="increaseQty"
          @decrease="decreaseQty"
          @remove="removeItem"
          @checkout="checkout"
        />
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import ShoppingCart from '../components/ShoppingCart.vue';
import Customer from '../models/customer.js';
import Item from '../models/item.js';
import { fetchItems } from '../utils/database.js';
import router from '../router/index.js';

// reactive lists
const catalogueItems = ref([]);
const customer = ref(null);
/*
  Note: cartItems is currently unused.
  Once ShoppingCart component accepts props, pass cartItems to it based on the shoppingCart class stored in the Customer model.
  Then, watch cartItems for changes and update the ShoppingCart display accordingly (handled in ShoppingCart.vue with watch()).
*/


// fetch catalogue items on component mount
onMounted(async () => {

  // load customer and their cart from localStorage
  const storedCustomer = localStorage.getItem('customer');
  if (storedCustomer) {
    customer.value = Customer.fromJSON(JSON.parse(storedCustomer));
  } else {
    console.warn('No customer found in localStorage.');
  }

  // load catalogue items from backend
  try {
    const data = await fetchItems(); // backend fetch from database
    catalogueItems.value = data.map(d => Item.fromJSON(d)); // wrap each into Item model
  } catch (err) {
    console.error('Failed to load catalogue:', err);
  }
});

// watch for any change inside the customer's cart items
watch(
  () => customer.value?.cart.items,
  // runs every time cart items change
  () => {
    if (customer.value) {
      // persist updated cart + customer info to localStorage
      localStorage.setItem('customer', JSON.stringify(customer.value));
      console.log('Customer cart updated in localStorage:', customer.value.cart);
    }
  },
  { deep: true }
);

function increaseQty(itemId) {
  customer.value.cart.increaseQuantity(itemId);
} 

function decreaseQty(itemId) {
  customer.value.cart.decreaseQuantity(itemId);
} 

function removeItem(itemId) {
  customer.value.cart.removeItem(itemId);
}

function addToCart(item) {
  customer.value.cart.addItem(item);
}

function checkout() {
  // router push to checkout page
  console.log('Proceeding to checkout with cart:', customer.value.cart);
  router.push('/checkout');
} 
</script>

<style scoped>
.catalogue-grid {
  align-content: flex-start;
}

@media (max-width: 768px) {
  .catalogue-grid > .card {
    flex-basis: calc(50% - 1rem);
  }
}

@media (max-width: 576px) {
  .catalogue-grid > .card {
    flex-basis: 100%;
  }
}
</style>