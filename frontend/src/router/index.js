import { createRouter, createWebHistory } from "vue-router"
import Catalogue from "../views/Catalogue.vue"
import Login from "../views/Login.vue"
import Register from "../views/Register.vue"
import Checkout from "../views/Checkout.vue"

const routes = [
    // NOTE: all pages aside from login will require "hasAuth = true" (set with localStorage) 
    // so user must login first
    { path: "/", name: "Catalogue", component: Catalogue }, 
    { path: "/login", name: "Login", component: Login }, 
    { path: "/register", name: "Register", component: Register },
    { path: "/checkout", name: "Checkout", component: Checkout }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router
