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
        <li class="nav-item">
          <router-link class="nav-link" to="/OrderHistory">Order History</router-link>
        </li>
      </ul>
      <button class="btn btn-outline-danger ms-auto float-left" @click="logout">Logout</button>
    </nav>

    <router-view />
  </div>
</template>

<script setup>
function logout() {
  localStorage.removeItem('customer');
  localStorage.removeItem('hasAuth');
  location.reload(); // Reload to reset state
  // navigate to the catalogue (home)
  router.push('/');
}
</script>

<style>
body {
  margin: 0;
  font-family: 'Segoe UI', sans-serif;
}
</style>
