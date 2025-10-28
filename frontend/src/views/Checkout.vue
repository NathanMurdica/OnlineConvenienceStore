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

const API_BASE_URL = "http://127.0.0.1:8000"; // fastAPI backend URL

const customer = ref(null);
const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

onMounted(() => {
  const storedCustomer = localStorage.getItem('customer');
  if (storedCustomer) {
    customer.value = Customer.fromJSON(JSON.parse(storedCustomer));
  } else {
    router.push('/');
  }
});

// persist updates
watch(
  () => customer.value?.cart.items,
  () => {
    if (customer.value) {
      localStorage.setItem('customer', JSON.stringify(customer.value));
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

function increaseQty(itemId) {
  customer.value.cart.increaseQuantity(itemId);
}
function decreaseQty(itemId) {
  customer.value.cart.decreaseQuantity(itemId);
}
function removeItem(itemId) {
  customer.value.cart.removeItem(itemId);
}
function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

async function confirmPurchase() {
  if (!customer.value) {
    alert('No customer found. Please log in or register before checking out.');
    return;
  }

  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    // build payload for backend
    const payload = {
      items: cartItems.value.map(entry => ({
        id: entry.item.id,
        quantity: entry.quantity
      })),
    };

    const response = await fetch(`${API_BASE_URL}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || 'Checkout failed');
    }

    const data = await response.json();
    console.log('Checkout successful:', data);

    alert(`Thank you, ${customer.value.name}! Your purchase was successful.`);

    // clear the customer's cart
    customer.value.cart.items = [];
    localStorage.setItem('customer', JSON.stringify(customer.value));

    // redirect back to catalogue after short delay
    setTimeout(() => {
      router.push('/');
    }, 1500);
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
