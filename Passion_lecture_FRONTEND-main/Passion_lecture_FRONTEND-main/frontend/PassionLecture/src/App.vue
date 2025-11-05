<!-- Root component template -->
<template>
  <div id="app">
    <!-- Header component -->
    <Header></Header>
    <!-- Main content area with router view -->
    <main class="main-content">
      <RouterView />
    </main>
    <!-- Footer component -->
    <Footer></Footer>
  </div>
</template>

<script>
// Vue Router imports
import { RouterLink, RouterView } from 'vue-router'
// Components
import Footer from './components/Footer.vue'
import Header from './components/Header.vue'

export default {
  name: 'App',
  // Component registration
  components: {
    Header,
    Footer,
  },
}
</script>

<style>
/* App container styles */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Main content area styles */
.main-content {
  flex: 1;
  max-width: 4000px;
  margin: 0 auto;
  padding-top: 4rem; /* Add padding to account for fixed header */
}

/* Error message styling */
.erreur {
  color: #e53935;
  font-weight: 600;
  margin-top: 15px;
  text-align: center;
}
/* Button hover effect */
button:hover {
  background-color: #673ab7;
  transform: translateY(-3px);
}

/* Button active/click effect */
button:active {
  background-color: #5e35b1;
  transform: translateY(1px);
}
</style>
