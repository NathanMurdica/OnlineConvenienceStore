<template>
  <div class="card sticky-top p-3">
    <h5 class="fw-bold mb-3">Shopping Cart</h5>

    <div class="table-responsive mb-2">
      <table class="table align-middle table-hover">
        <thead class="table-light">
          <tr>
            <th>Item</th>
            <th class="text-center">Quantity</th>
            <th class="text-end">Price</th>
            <th class="text-center"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!cart?.items?.length">
            <td colspan="4" class="text-center">No items in cart</td>
          </tr>
          <tr v-for="entry in cart.items" :key="entry.item.id">
            <td>{{ entry.item.name }}</td>
            <td class="text-center">
              <div class="d-inline-flex align-items-center gap-2">
                <button class="btn btn-outline-secondary btn-sm" @click="emit('decrease', entry.item.id)">-</button>
                <span class="fw-bold">{{ entry.quantity }}</span>
                <button class="btn btn-outline-secondary btn-sm" @click="emit('increase', entry.item.id)">+</button>
              </div>
            </td>
            <td class="text-end fw-semibold">{{ entry.item.formattedPrice }}</td>
            <td class="text-center">
              <button class="btn btn-outline-danger btn-sm" @click="emit('remove', entry.item.id)">✖</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="d-flex justify-content-between fw-bold mb-3">
      <span>Total</span>
      <span>{{ formattedTotal }}</span>
    </div>

    <div class="text-end">
      <button class="btn btn-success btn-sm" @click="emit('checkout')">Checkout</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  cart: { type: Object, default: () => ({ items: [] }), required: true },
  cartVersion: { type: Number, required: true },
});
const emit = defineEmits(["increase", "decrease", "remove", "checkout"]);

const formattedTotal = computed(() => {
  const total = props.cart?.items?.reduce((sum, entry) => {
    return sum + entry.item.price * entry.quantity;
  }, 0) || 0;
  return `$${total.toFixed(2)}`;
});
</script>
