<template>
  <div class="container mt-4 mb-5">
    <div class="row mb-4">
      <div class="col">
        <h2 class="fw-bold text-center text-md-start">Order History</h2>
        <hr class="mt-2 mb-4">
      </div>
    </div>

    <div v-if="orders.length > 0">
      <div v-for="(order, index) in orders" :key="order.id" class="card p-3 shadow-sm mb-3">
        <h5>Order placed on: {{ formatDate(order.date) }}</h5>
        <ul class="list-group mb-2">
          <li v-for="entry in order.items" :key="entry.item.id" class="list-group-item d-flex justify-content-between">
            <span>{{ entry.item.name }} (x{{ entry.quantity }})</span>
            <span>{{ formatCurrency(entry.item.price * entry.quantity) }}</span>
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

const orders = ref([]);

onMounted(() => {
  orders.value = JSON.parse(localStorage.getItem('pastOrders')) || [];
});

function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString();
}
</script>

<style scoped>
.card {
  border-radius: 10px;
}
</style>
