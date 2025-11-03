import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

const DEVMODE = true;

const app = createApp(App)
app.use(router)
app.mount('#app')
