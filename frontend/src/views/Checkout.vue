<template>
  <div class="container mt-4 mb-5">

    <!-- page heading -->
    <div class="row mb-4">
      <div class="col">
        <h2 class="fw-bold text-center text-md-start">Checkout</h2>
        <hr class="mt-2 mb-4">
      </div>
    </div>

    <!-- customer Info -->
    <div class="card p-3 shadow-sm mb-4">
      <h5 class="fw-bold mb-3">Customer Information</h5>

      <div v-if="customer">
        <p class="mb-1"><strong>Name:</strong> {{ customer.name }}</p>
        <p class="mb-0"><strong>Email:</strong> {{ customer.email }}</p>
      </div>

      <div v-else class="text-muted">
        <p>No customer data found. Please return to the catalogue.</p>
        <router-link to="/" class="btn btn-primary">Return to Catalogue</router-link>
      </div>
    </div>

    <div class="row">
      <!-- left column: cart items -->
      <div class="col-12 col-md-8 mb-4 mb-md-0">
        <div v-if="cartItems.length > 0">
          <div
            v-for="entry in cartItems"
            :key="entry.item.id"
            class="card mb-3 p-3 shadow-sm"
          >
            <div class="d-flex align-items-center justify-content-between flex-wrap">
              <div class="flex-grow-1">
                <h5 class="mb-1">{{ entry.item.name }}</h5>
                <p class="text-muted mb-0">{{ entry.item.formattedPrice }}</p>
              </div>

              <div class="d-flex align-items-center mt-2 mt-md-0">
                <div class="btn-group btn-group-sm me-3" role="group">
                  <button class="btn btn-outline-secondary" @click="decreaseQty(entry.item.id)">-</button>
                  <button class="btn btn-light" disabled>{{ entry.quantity }}</button>
                  <button class="btn btn-outline-secondary" @click="increaseQty(entry.item.id)">+</button>
                </div>

                <p class="mb-0 fw-bold me-3">
                  {{ formatCurrency(entry.item.price * entry.quantity) }}
                </p>

                <button class="btn btn-sm btn-danger" @click="removeItem(entry.item.id)">
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center text-muted py-5">
          <p>Your cart is empty.</p>
          <router-link to="/" class="btn btn-primary">Return to Catalogue</router-link>
        </div>
      </div>

      <!-- right column: order summary -->
      <div class="col-12 col-md-4">
        <div class="card p-3 shadow-sm sticky-md-top" style="top: 1rem;">
          <h5 class="fw-bold mb-3">Order Summary</h5>

          <div class="d-flex justify-content-between">
            <span>Subtotal:</span>
            <span>{{ formatCurrency(subtotal) }}</span>
          </div>

          <div class="d-flex justify-content-between">
            <span>Tax (10%):</span>
            <span>{{ formatCurrency(tax) }}</span>
          </div>

          <hr />

          <div class="d-flex justify-content-between fw-bold">
            <span>Total:</span>
            <span>{{ formatCurrency(total) }}</span>
          </div>

          <button
            class="btn btn-success w-100 mt-4"
            :disabled="cartItems.length === 0 || loading"
            @click="confirmPurchase"
          >
            <span v-if="!loading">Confirm Purchase</span>
            <span v-else>Processing...</span>
          </button>

          <p v-if="errorMessage" class="text-danger mt-3">{{ errorMessage }}</p>
          <p v-if="successMessage" class="text-success mt-3">{{ successMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import Customer from '../models/customer.js';
import router from '../router/index.js';
import Order from '../models/order.js';
import { checkoutOrder } from '../utils/database.js';

const customer = ref(null);
const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

onMounted(() => {
  customer.value = Customer.fromLocalStorage();
});

// persist updates
watch(
  () => customer.value?.cart.items,
  () => {
    if (customer.value) {
      Customer.toLocalStorage(customer.value);
    }
  },
  { deep: true }
);

const cartItems = computed(() => customer.value?.cart.items || []);
const subtotal = computed(() =>
  cartItems.value.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0)
);
const tax = computed(() => subtotal.value * 0.1);
const total = computed(() => subtotal.value + tax.value);

function increaseQty(itemId) { customer.value.cart.increaseQuantity(itemId); }
function decreaseQty(itemId) { customer.value.cart.decreaseQuantity(itemId); }
function removeItem(itemId) { customer.value.cart.removeItem(itemId); }
function formatCurrency(amount) { return `$${amount.toFixed(2)}`; }

async function confirmPurchase() {
  if (!customer.value) return alert('No customer found. Please log in.');

  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    // Create order from the customer's cart
    const order = Order.fromCart(customer.value);

    // Use the centralized database function
    const result = await checkoutOrder(order);

    successMessage.value = result.message || 'Purchase successful!';

    // Clear cart
    customer.value.cart.items = [];
    Customer.toLocalStorage(customer.value);

    setTimeout(() => router.push('/'), 1500);

  } catch (err) {
    console.error('Checkout error:', err);
    errorMessage.value = err.message || 'An unexpected error occurred.';
  } finally {
    loading.value = false;
  }
}
</script>


<style scoped>
.card {
  border-radius: 10px;
}
.btn-group-sm > .btn {
  padding: 0.25rem 0.6rem;
}
</style>
