<template>
<div class="container mt-3 card-body">
  <h1>Register</h1>

  <form v-on:submit.prevent="register">
    <div class="mb-3">
      <label for="name" class="form-label">Name</label>
      <input type="text" class="form-control" id="firstName" v-model="name" 
        :class="{ 'is-invalid': errors.name }"
        placeholder="Name" required>
      <div class="invalid-feedback" v-if="errors.name">{{ errors.name }}</div>
    </div>
    <div class="mb-3">
      <label for="email" class="form-label">Email address</label>
      <input type="email" class="form-control" id="email" v-model="email" 
        :class="{ 'is-invalid': errors.email }"
        placeholder="Email" required>
      <div class="invalid-feedback" v-if="errors.email">{{ errors.email }}</div>
    </div>
    <div class="mb-3">
      <label for="password" class="form-label">Password</label>
      <input type="password" class="form-control" id="password" v-model="password" 
        :class="{ 'is-invalid': errors.password }"
        placeholder="Password" required>
      <div class="invalid-feedback" v-if="errors.password">{{ errors.password }}</div>
    </div>
    <button class="btn btn-primary" type="submit">Register</button>
  </form>
</div>
</template>

<script setup>
import { ref } from 'vue';
import { ShoppingCart } from '../models/shoppingCart.js';
import Customer from '../models/customer.js';
import router from '../router/index.js';
import { registerUser } from '../utils/database.js';
import { debug } from "../utils/debug.js"
import { validateRegistration } from '../utils/validation.js';

const name = defineModel('name');
const email = defineModel('email');
const password = defineModel('password');
const errors = ref({});

const customer = ref(new Customer());

async function register() {
  try {
    // Reset previous errors
    errors.value = {};
    
    // Validate form data
    const validation = validateRegistration({ 
      name: name.value, 
      email: email.value, 
      password: password.value 
    });
    
    if (!validation.isValid) {
      errors.value = validation.errors;
      return;
    }

    debug('(Register) Registering user:', { name: name.value, email: email.value, password: password.value });
    customer.value = new Customer({ id: 0, name: '', email: email.value, password: password.value, cart: new ShoppingCart() });
    
    debug('(Register) Customer to register:', customer.value);
    const userData = await registerUser(customer.value);

    if (!userData) {
      alert('Registration failed. Please try again.');
      return;
    }
    else {
      debug('(Register) User Data from Backend:', userData);
      const storedCustomer = new Customer(userData);

      debug('(Register) Customer registered with Backend:', storedCustomer);
      Customer.toLocalStorage(storedCustomer);
      debug('(Register) Value in LocalStorage:', localStorage.getItem('customer'));

      localStorage.setItem('hasAuth', 'true');
      debug('(Register) Created Authentication token');
      
      const customerFromStorage = Customer.fromLocalStorage();
      debug('(Register) Customer set in localStorage:', customerFromStorage);

      // navigate to the catalogue (home)
      router.push('/');
    }
  } 
  catch (error) {
    console.error('Registration error:', error);
    alert('Registration failed. Please try again.');
  }
}
</script>