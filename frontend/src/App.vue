<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light px-3">
      <a class="navbar-brand" href="#"><router-link class="nav-link" to="/">Online Convenience Store</router-link></a>
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link class="nav-link" to="/">Catalogue</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/checkout">Checkout</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/login">Login</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/register">Register</router-link>
        </li>
      </ul>
    </nav>

    <router-view />
  </div>
</template>

<script setup>
</script>

<style>
body {
  margin: 0;
  font-family: 'Segoe UI', sans-serif;
}
</style>
