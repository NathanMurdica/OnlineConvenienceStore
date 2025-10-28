<template>
  <div class="container mt-3">
    <h1>Login</h1>
    <p>login page with first name, last name, email/phone number?
      <br>page is required to access catalogue, cart and checkout (this will be changed in the routes)
    </p>

    <p>when login is successful, set the localStorage with a new Customer object. this is used for checking authorisation/login status as if the customer is not set i.e. is null in localStorage, you aren't logged in</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import Customer from '../models/customer.js';

    onMounted(() => {
        //create a customer class with a shopping cart and add to local storage.
        const customer = new Customer({ id: 1, name: "John Doe", email: "john.doe@example.com" });
        console.log('Customer set in localStorage:', customer);

        localStorage.setItem('customer', JSON.stringify(customer));

        
    });
</script>