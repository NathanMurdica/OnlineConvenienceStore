<template>
    <div class="card shadow-sm h-100 text-center">
        <div class="card-body">
            <h5 class="card-title fw-semibold">Product Name</h5>
            <p class="card-text text-muted mb-2">$00.00</p>
            <button class="btn btn-primary btn-sm">Add to Cart</button>
        </div>
    </div>
</template>

<script setup>

// Define props for product details
defineProps({
    // Define props here when needed, e.g., product details
    // Item object with name, price, stock, etc.
});
</script>