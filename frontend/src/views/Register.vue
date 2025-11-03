<template>
<div class="container mt-3">
  <h1>Register</h1>

  <div class="card-body">
    <form v-on:submit.prevent="register">
      <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input type="text" class="form-control" id="firstName" v-model="name" placeholder="Name" required>
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email address</label>
        <input type="email" class="form-control" id="email" v-model="email" placeholder="Email" required>
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input type="password" class="form-control" id="password" v-model="password" placeholder="Password" required>
      </div>
      <button class="btn btn-primary" type="submit">Register</button>
    </form>
  </div>
</div>
</template>

<script setup>
import Customer from '../models/customer.js';
import router from '../router/index.js';
import { registerUser } from '../utils/database.js';

const name = defineModel('name');
const email = defineModel('email');
const password = defineModel('password');

function register() {
  // Basic validation
  if (!name.value || !email.value || !password.value) {
    alert('Please fill in name, email and password.');
    return;
  }

  // Create a simple customer instance
  const customer = new Customer({
    id: 0,
    name: name.value,
    email: email.value,
    password: password.value || ''
  });

  const userData = registerUser(customer)
  if (!userData) {
    alert('Registration failed. Please try again.');
    return;
  }

  localStorage.setItem('customer', JSON.stringify(customer));
  // mark that the user is authenticated (simple flag used by router)
  localStorage.setItem('hasAuth', 'true');

  // navigate to the catalogue (home)
  router.push('/');
}
</script>