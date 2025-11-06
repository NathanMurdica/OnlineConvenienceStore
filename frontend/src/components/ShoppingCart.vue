<template>
  <div class="card sticky-top p-3">
    <h5 class="fw-bold mb-3">Shopping Cart</h5>
    <!-- Cart items table -->
    <div class="table-responsive mb-2">
      <table class="table align-middle table-hover">
        <thead class="table-light">
          <tr>
            <th scope="col">Item</th>
            <th scope="col" class="text-center">Quantity</th>
            <th scope="col" class="text-end">Price</th>
            <th scope="col" class="text-center"></th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-if="!localItems || localItems.length === 0"
          >
            <td colspan="4" class="text-center">No items in cart</td>
          </tr>
          <tr 
            v-for="entry in localItems || []" 
            :key="entry.item.id"
          >
            <td>{{ entry.item.name }}</td>
            <td class="text-center">
              <div class="d-inline-flex align-items-center gap-2">
                <button class="btn btn-outline-secondary btn-sm"
                  @click="emit('decrease', entry.item.id)">-
                </button>
                <span class="fw-bold">{{ entry.quantity }}</span>
                <button class="btn btn-outline-secondary btn-sm"
                  @click="emit('increase', entry.item.id)">+
                </button>
              </div>
            </td>
            <td class="text-end fw-semibold">{{ entry.item.formattedPrice }}</td>
            <td class="text-center">
              <button class="btn btn-outline-danger btn-sm"
                @click="emit('remove', entry.item.id)">✖
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Cart total -->
    <div class="d-flex justify-content-between fw-bold mb-3">
      <span>Total</span>
      <span>{{ formattedTotal || '$0.00' }}</span>
    </div>

    <!-- Checkout button -->
    <div class="text-end">
      <button class="btn btn-success btn-sm" @click="emit('checkout')">Checkout</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch, ref, computed } from 'vue';
import { debug } from '../utils/debug.js';

const props = defineProps({
  cart: {
    type: Object,
    required: false,
  },
  cartVersion: {
    type: Number,
    required: false,
  }
});

// Local reactive copy of items so template reliably updates
const localItems = ref(props.cart?.items ? [...props.cart.items] : []);

// Compute total from the localItems so UI updates regardless of parent class reactivity
const formattedTotal = computed(() => {
  const total = (localItems.value || []).reduce((sum, entry) => {
    const price = entry?.item?.price || 0;
    const qty = entry?.quantity || 0;
    return sum + price * qty;
  }, 0);
  return `$${total.toFixed(2)}`;
});

onMounted(() => {
  debug('ShoppingCart mounted with cart:', props.cart);
});

// Emit events for cart actions
const emit = defineEmits(["increase", "decrease", "remove", "checkout"]);

// Keep localItems in sync when the parent updates the cart items
watch(
  () => props.cart?.items,
  (newItems) => {
    debug('ShoppingCart items changed:', newItems);
    // Normalize entries to plain objects so template can render reliably
    if (newItems && Array.isArray(newItems)) {
      localItems.value = newItems.map(e => ({
        item: e?.item || e || {},
        quantity: e?.quantity ?? 1
      }));
      debug(`ShoppingCart localItems populated (${localItems.value.length}):`, localItems.value);
    } else {
      localItems.value = [];
      debug('ShoppingCart localItems cleared');
    }
  },
  { immediate: true, deep: true }
);

// Also resync when parent explicitly signals a cart change via cartVersion
watch(
  () => props.cartVersion,
  (v) => {
    debug('ShoppingCart detected cartVersion change:', v);
    const newItems = props.cart?.items;
    if (newItems && Array.isArray(newItems)) {
      localItems.value = newItems.map(e => ({
        item: e?.item || e || {},
        quantity: e?.quantity ?? 1
      }));
      debug(`ShoppingCart localItems populated by cartVersion (${localItems.value.length}):`, localItems.value);
    } else {
      localItems.value = [];
      debug('ShoppingCart localItems cleared by cartVersion');
    }
  },
  { immediate: false }
);

</script>