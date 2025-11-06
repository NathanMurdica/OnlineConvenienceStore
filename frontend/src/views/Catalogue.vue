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
          :cart="customer.value?.cart"
          :cartVersion="cartVersion"
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
import { ref, onMounted, watch, reactive } from 'vue';
import ShoppingCart from '../components/ShoppingCart.vue';
import Catalogue from '../models/catalogue.js';
import Customer from '../models/customer.ts';
import router from '../router/index.js';
import { debug } from "../utils/debug.js"

// reactive references
const catalogue = ref(new Catalogue());
const customer = ref(new Customer());
const catalogueItems = ref([]);
// simple version counter to notify child components when the cart changes
const cartVersion = ref(0);

// fetch data on mount
onMounted(async () => {
  // load customer
  debug('Loading customer from localStorage:', Customer.fromLocalStorage());

  customer.value = Customer.fromLocalStorage();
  // make the entire cart instance reactive so nested mutations are observed by Vue
  try {
    if (customer.value?.cart) {
      customer.value.cart = reactive(customer.value.cart);
    }
  } catch (err) {
    console.warn('Could not make cart reactive:', err);
  }
  // notify children (ShoppingCart) to resync on initial load
  cartVersion.value++;

  // load catalogue
  await catalogue.value.loadItems();

  debug('Catalogue loaded:', catalogue.value);
  debug('Customer cart:', customer.value.cart);

  catalogueItems.value = catalogue.value.items;
});

// persist customer to localStorage on cart changes
watch(
  () => customer.value?.cart.items,
  () => {
    if (customer.value) {
      Customer.toLocalStorage(customer.value);
      // localStorage.setItem('customer', customer.value.toJSON());
      debug('Customer cart updated:', localStorage.getItem('customer'));
    }
  },
  { deep: true }
);

// cart operations
function addToCart(item) {
  customer.value.cart.addItem(item);
  // replace items array with a new copy so Vue detects the change when the ShoppingCart
  // component receives the cart as a prop (forces reactive update)
  try {
    customer.value.cart.items = [...customer.value.cart.items];
  } catch (err) {
    console.warn('Could not reassign cart.items after addToCart:', err);
  }
  // ensure the cart proxy is applied to the instance
  try {
    customer.value.cart = reactive(customer.value.cart);
  } catch (err) {
    /* ignore */
  }
  // bump cartVersion so children know about this mutation
  cartVersion.value++;
}

// cart event handlers
function increaseQty(itemId) {
  customer.value.cart.increaseQuantity(itemId);
  try {
    customer.value.cart.items = [...customer.value.cart.items];
  } catch (err) {
    console.warn('Could not reassign cart.items after increaseQty:', err);
  }
  try {
    customer.value.cart = reactive(customer.value.cart);
  } catch (err) {
    /* ignore */
  }
  cartVersion.value++;
}

function decreaseQty(itemId) {
  customer.value.cart.decreaseQuantity(itemId);
  try {
    customer.value.cart.items = [...customer.value.cart.items];
  } catch (err) {
    console.warn('Could not reassign cart.items after decreaseQty:', err);
  }
  try {
    customer.value.cart = reactive(customer.value.cart);
  } catch (err) {
    /* ignore */
  }
  cartVersion.value++;
}

function removeItem(itemId) {
  customer.value.cart.removeItem(itemId);
  try {
    customer.value.cart.items = [...customer.value.cart.items];
  } catch (err) {
    console.warn('Could not reassign cart.items after removeItem:', err);
  }
  try {
    customer.value.cart = reactive(customer.value.cart);
  } catch (err) {
    /* ignore */
  }
  cartVersion.value++;
}

function checkout() {
  debug('Proceeding to checkout with cart:', customer.value.cart);
  Customer.toLocalStorage(customer.value);
  // localStorage.setItem('customer', JSON.stringify(customer.value));
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