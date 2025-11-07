import { createRouter, createWebHistory } from "vue-router"
import Catalogue from "../views/Catalogue.vue"
import Login from "../views/Login.vue"
import Register from "../views/Register.vue"
import Checkout from "../views/Checkout.vue"
import OrderHistory from '../views/OrderHistory.vue';

const routes = [
    // NOTE: all pages aside from login will require "hasAuth = true" (set with localStorage) 
    // so user must login first
    // either check if customer is set in localStorage OR check a boolean for login status
    {
        path: "/",
        name: "Catalogue",
        component: Catalogue,
        meta: { requiresAuth: true }
    },
    {
        path: "/login",
        name: "Login",
        component: Login
    },
    {
        path: "/register",
        name: "Register",
        component: Register
    },
    {
        path: "/checkout",
        name: "Checkout",
        component: Checkout,
        meta: { requiresAuth: true }
    },
    {
        path: '/OrderHistory',
        name: 'OrderHistory',
        component: OrderHistory,
        meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
        const token = localStorage.getItem('hasAuth');
        if (token === 'true') {
            // User is authenticated, proceed to the route
            next();
        } else {
            // User is not authenticated, redirect to login
            next('/login');
        }
    } else {
        // Non-protected route, allow access
        next();
    }
});

export default router
