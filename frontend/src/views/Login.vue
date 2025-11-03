<template>
<div class="container mt-3 card-body">
  <h1>Login</h1>
  
  <form v-on:submit.prevent="login">
    <div class="mb-3">
      <label for="email" class="form-label">Email address</label>
      <input type="email" class="form-control" id="email" v-model="email" placeholder="Email" required>
    </div>
    <div class="mb-3">
      <label for="password" class="form-label">Password</label>
      <input type="password" class="form-control" id="password" v-model="password" placeholder="Password" required>
    </div>
    <button class="btn btn-primary" type="submit">Login</button>
  </form>
</div>
</template>

<script setup>
import { onMounted } from 'vue';
import Customer from '../models/customer.js';
import { loginUser } from '../utils/database.js';
import router from '../router/index.js';
import { DEVMODE } from '../main.js';

const email = defineModel('email');
const password = defineModel('password');

function login() {
  const customer = new Customer({
    id: 0,
    name: '',
    email: email.value,
    password: password.value
  });

  const userData = loginUser(customer)
  if (!userData) {
    alert('Login failed. Please check your email and password.');
    return;
  }

  if (DEVMODE) {
    console.log('Customer got from Backend:', userData);
  }

  localStorage.setItem('customer', JSON.stringify(userData));

  if (DEVMODE) {
    console.log('Customer set in localStorage:', localStorage.getItem('customer'));
  }

  // navigate to the catalogue (home)
  router.push('/');
}
</script>