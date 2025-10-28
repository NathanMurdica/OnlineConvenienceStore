<template>
<div class="container mt-3">
  <h1>Register</h1>
  <p>displays if a new customer wants to make an account
    <br>form with first name, last name, email/phone number, password
    <br> will count as login once registered
  </p>
  <div class="card-body">
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
    <button class="btn btn-primary" @click="register">Register</button>
  </div>
</div>
</template>

<script setup>
import Customer from '../models/customer.js';
import router from '../router/index.js';

const name = defineModel('');
const email = defineModel('');
const password = defineModel('');

function register() {
  // Basic validation
  if (!name.value || !email.value || !password.value) {
    alert('Please fill in name, email and password.');
    return;
  }

  // Create a simple customer instance and persist it to localStorage
  const customer = new Customer({
    id: Date.now(),
    name: name.value,
    email: email.value
  });

  localStorage.setItem('customer', JSON.stringify(customer));
  // mark that the user is authenticated (simple flag used by router)
  localStorage.setItem('hasAuth', 'true');

  // navigate to the catalogue (home)
  router.push('/');
}
</script>