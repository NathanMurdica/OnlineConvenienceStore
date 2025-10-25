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
          <ShoppingCart /> <!-- update to <ShoppingCart :items /> when props are established -->
      </div>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ShoppingCart from '../components/ShoppingCart.vue';
import Item from '../models/item.js';
import { fetchItems } from '../utils/database.js';

// reactive lists
const catalogueItems = ref([]);
const cartItems = ref([]);

// fetch catalogue items on component mount
onMounted(async () => {
  try {
    const data = await fetchItems(); // backend fetch from database
    catalogueItems.value = data.map(d => Item.fromJSON(d)); // wrap each into Item model
  } catch (err) {
    console.error('Failed to load catalogue:', err);
  }
});

// add to cart logic
function addToCart(item) {
  const existing = cartItems.value.find(i => i.id === item.id);
  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1;
  } else {
    cartItems.value.push({ ...item, quantity: 1 });
  }
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