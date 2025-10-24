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

    <!-- Left column: product grid -->
    <div class="col-12 col-md-8 mb-4 mb-md-0">
      <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
        <!-- Product card -->
        <div class="col">
          <Item />
          
        </div>
        <div class="col">
          <Item />
          
        </div>
        <div class="col">
          <Item />
          
        </div>
        <!-- Repeat for each product -->
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
import Item from '../components/Item.vue';
import ShoppingCart from '../components/ShoppingCart.vue';

// example method for adding items to cart
// function addToCart(item) {
//   // logic to add item to cart
//     shoppingcartitems.push(item);
// }
</script>