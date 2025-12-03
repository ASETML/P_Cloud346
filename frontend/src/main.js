// Main entry point of the Vue application
import './assets/main.css'

// Vue 3 core imports
import { createApp } from 'vue'
// Root component
import App from './App.vue'
// Router configuration
import router from './router'
// helper
import { initAuth } from './utils/auth'

initAuth()

// Create Vue application instance
const app = createApp(App)

// Install the router plugin
app.use(router)

// Mount the application to the DOM
app.mount('#app')
