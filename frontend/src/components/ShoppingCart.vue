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
                  v-if="!props.cart?.items || props.cart?.items.length === 0"
                >
                    <td colspan="4" class="text-center">No items in cart</td>
                </tr>
                <tr
                  v-for="entry in props.cart?.items || []"
                  :key="entry.item.id"
                >
                    <td>{{ entry.item.name }}</td>
                    <td class="text-center">
                    <div class="d-inline-flex align-items-center gap-2">
                        <button class="btn btn-outline-secondary btn-sm"
                            @click="emit('decrease', entry.item.id)">−
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
          <span>{{ props.cart?.formattedTotal || '$0.00' }}</span>
        </div>

        <!-- Checkout button -->
        <div class="text-end">
          <button class="btn btn-success btn-sm" @click="emit('checkout')">Checkout</button>
        </div>
      </div>
</template>

<script setup>
import { watch } from 'vue';

const props = defineProps({
  cart: {
    type: Object,
    required: false,
  }
});

// Emit events for cart actions
const emit = defineEmits(["increase", "decrease", "remove", "checkout"]);

watch(() => props.cart, (newCart) => {
  console.log('ShoppingCart props changed:', newCart);
}, { deep: true });

</script>