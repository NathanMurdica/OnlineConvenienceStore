<template>
  <h1>Login</h1>
  <div class="container card-body">
    <div class="mb-3">
      <label for="email" class="form-label">Email address</label>
      <input type="email" class="form-control" id="email" v-model="email" placeholder="Email" required>
    </div>
    <div class="mb-3">
      <label for="password" class="form-label">Password</label>
      <input type="password" class="form-control" id="password" v-model="password" placeholder="Password" required>
    </div>
    <button class="btn btn-primary" @click="login">Login</button>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import Customer from '../models/customer.js';
import { loginUser } from '../utils/database.js';
import router from '../router/index.js';

onMounted(() => {
  //create a customer class with a shopping cart and add to local storage.
  const customer = new Customer({ id: 1, name: "John Doe", email: "john.doe@example.com" });
});

const email = defineModel('email');
const password = defineModel('password');

function login() {
  const customer = new Customer({
    id: 0,
    name: '',
    email: email.value,
    password: password.value
  });

  const loginReturnValue = loginUser(customer)
  console.log('Customer set in localStorage:', loginReturnValue);

  localStorage.setItem('customer', JSON.stringify(loginReturnValue));

  // navigate to the catalogue (home)
  router.push('/');
}
</script>