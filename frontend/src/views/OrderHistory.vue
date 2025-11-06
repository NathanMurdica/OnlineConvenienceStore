<template>
  <div class="container mt-4 mb-5">
    <h2 class="fw-bold text-center mb-4">Order History</h2>

    <div v-if="orders.length > 0">
      <div v-for="(order, idx) in orders" :key="idx" class="card p-3 shadow-sm mb-3">
        <h5>Order placed: {{ formatDate(order.date) }}</h5>
        <ul class="list-group mb-2">
          <li v-for="item in order.items" :key="item.id" class="list-group-item d-flex justify-content-between">
            <span>{{ item.name }} (x{{ item.quantity }})</span>
            <span>{{ formatCurrency(item.price * item.quantity) }}</span>
          </li>
        </ul>
        <div class="d-flex justify-content-between fw-bold">
          <span>Total:</span>
          <span>{{ formatCurrency(order.total) }}</span>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-muted py-5">
      <p>No past orders found.</p>
      <router-link to="/" class="btn btn-primary">Return to Catalogue</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Customer from '../models/customer.js';

const API_BASE_URL = "http://127.0.0.1:8000";
const customer = ref(null);
const orders = ref([]);

onMounted(async () => {
  customer.value = Customer.fromLocalStorage();
  // fetch orders from backend for this customer
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${customer.value.id}`);
    const data = await res.json();
    orders.value = data.orders || [];
  } catch (err) {
    console.error('Failed to fetch orders:', err);
  }
});

function formatCurrency(amount) { return `$${amount.toFixed(2)}`; }
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString();
}
</script>
