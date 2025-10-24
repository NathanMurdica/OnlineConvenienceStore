<template>
    <div class="card sticky-top p-3">
        <h5 class="fw-bold mb-3">Shopping Cart</h5>

        <!-- Empty cart state -->
        <p class="text-muted small mb-3">Your cart is empty.</p>

        <!-- Cart items table -->
        <div class="table-responsive mb-3">
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
                <tr>
                    <td>Bread</td>
                    <td class="text-center">
                    <div class="d-inline-flex align-items-center gap-2">
                        <button class="btn btn-outline-secondary btn-sm">−</button>
                        <span class="fw-bold">1</span>
                        <button class="btn btn-outline-secondary btn-sm">+</button>
                    </div>
                    </td>
                    <td class="text-end fw-semibold">$2.00</td>
                    <td class="text-center">
                    <button class="btn btn-outline-danger btn-sm">✖</button>
                    </td>
                </tr>
                <tr>
                    <td>Milk</td>
                    <td class="text-center">
                    <div class="d-inline-flex align-items-center gap-2">
                        <button class="btn btn-outline-secondary btn-sm">−</button>
                        <span class="fw-bold">2</span>
                        <button class="btn btn-outline-secondary btn-sm">+</button>
                    </div>
                    </td>
                    <td class="text-end fw-semibold">$7.00</td>
                    <td class="text-center">
                    <button class="btn btn-outline-danger btn-sm">✖</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>

        <!-- Cart total -->
        <div class="d-flex justify-content-between fw-bold border-top pt-2 mb-3">
          <span>Total</span>
          <span>$5.50</span>
        </div>

        <!-- Checkout button -->
        <div class="text-end">
          <button class="btn btn-success btn-sm">Checkout</button>
        </div>
      </div>
</template>

<script setup>

// defineProps({
//     items: {
//         type: Array,
//         default: () => []
//     }
// });
// // watch for items prop and update cart display accordingly
// watch(() => items, (newItems) => {
//     // logic to update cart display i.e. table rows and total price
// });


</script>