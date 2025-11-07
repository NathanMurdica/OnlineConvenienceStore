<template>
<div class="container mt-3 card-body">
  <h1>Login</h1>
  
  <form v-on:submit.prevent="login">
    <div class="mb-3">
      <label for="email" class="form-label">Email address</label>
      <input type="email" class="form-control" id="email" v-model="email" 
        placeholder="Email" required>
    </div>
    <div class="mb-3">
      <label for="password" class="form-label">Password</label>
      <input type="password" class="form-control" id="password" v-model="password" 
        placeholder="Password" required>
    </div>
    <button class="btn btn-primary" type="submit">Login</button>
  </form>
</div>
</template>

<script setup>
import Customer from '../models/customer.js';
import { loginUser } from '../utils/database.js';
import router from '../router/index.js';
import { debug } from "../utils/debug.js"
import { ref } from 'vue';
import { ShoppingCart } from '../models/shoppingCart.js';

const email = defineModel('email');
const password = defineModel('password');

const customer = ref(new Customer());

async function login() {
  try {

    customer.value = new Customer({ id: 0, name: '', email: email.value, password: password.value, cart: new ShoppingCart() });
    debug('(Login) Logging in user:', customer.value);
    const userData = await loginUser(customer.value);

    if (!userData) {
      alert('Login failed. Please check your email and password.');
      return;
    } 
    else {
      debug('(Login) User Data from Backend:', userData);
      const storedCustomer = new Customer(userData);

      debug('(Login) Customer to set in localStorage:', storedCustomer);
      Customer.toLocalStorage(storedCustomer);
      debug('(Login) Value in LocalStorage:', localStorage.getItem('customer'));

      localStorage.setItem('hasAuth', 'true');
      debug('(Login) Created Authentication token');

      const customerFromStorage = Customer.fromLocalStorage();
      debug('(Login) Customer set in localStorage:', customerFromStorage);

      // navigate to the catalogue (home)
      router.push('/');
    } 
  } 
  catch (error) {
    console.error('Login error:', error);
    alert('Login failed. Please check your email and password.');
  }
}
</script>