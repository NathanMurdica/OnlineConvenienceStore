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
import Catalogue from '../models/catalogue.js';
import Customer from '../models/customer.js';
import router from '../router/index.js';

// reactive references
const catalogue = ref(new Catalogue());
const customer = ref(null);
const catalogueItems = ref([]);

// fetch data on mount
onMounted(async () => {
  // load customer
  const storedCustomer = localStorage.getItem('customer');
  if (storedCustomer) {
    customer.value = Customer.fromJSON(JSON.parse(storedCustomer));
  } else {
    console.warn('No customer found in localStorage.');
    customer.value = new Customer();
  }

  // load catalogue
  await catalogue.value.loadItems();
  catalogueItems.value = catalogue.value.items;
});

// persist customer to localStorage on cart changes
watch(
  () => customer.value?.cart.items,
  () => {
    if (customer.value) {
      localStorage.setItem('customer', JSON.stringify(customer.value));
      console.log('Customer cart updated:', localStorage.getItem('customer'));
    }
  },
  { deep: true }
);

// cart operations
function addToCart(item) {
  customer.value.cart.addItem(item);
}

// cart event handlers
function increaseQty(itemId) {
  customer.value.cart.increaseQuantity(itemId);
}

function decreaseQty(itemId) {
  customer.value.cart.decreaseQuantity(itemId);
}

function removeItem(itemId) {
  customer.value.cart.removeItem(itemId);
}

function checkout() {
  console.log('Proceeding to checkout with cart:', customer.value.cart);
  localStorage.setItem('customer', JSON.stringify(customer.value));
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