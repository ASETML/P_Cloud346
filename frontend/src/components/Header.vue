<template>
  <header class="header">
    <!-- Menu button (hamburger) -->
    <button @click="toggleSidebar" class="menu-button" aria-label="Toggle menu">
      <img :src="dropMenu" class="logo" alt="Menu icon" />
    </button>

    <!-- Logo / Home link -->
    <router-link to="/" class="logo-link">
      <h1 class="logo-text">Passion <span class="logo-highlight">Lecture</span></h1>
    </router-link>

    <!-- Right side: Login/Register OR Profile + Logout -->
    <div class="loginButtons">
      <!-- Not logged in → show Login & Register links -->
      <router-link to="/login" class="profile-link" v-if="!isLoggedIn">
        <p>Log in</p>
      </router-link>
      <router-link to="/register" class="profile-link" v-if="!isLoggedIn">
        <p>Register</p>
      </router-link>

      <!-- Logged in → show avatar + Disconnect button -->
      <router-link :to="profileLink" class="profile-link" v-if="isLoggedIn">
        <img src="/images/userProfile.png" class="user-icon" alt="User Profile" />
      </router-link>

      <button @click="disconnect" class="disconnect-button" v-if="isLoggedIn">
        <p>Disconnect</p>
      </button>
    </div>

    <!-- Sidebar (only renders when open) -->
    <Sidebar v-if="sidebarOpen" :is-open="sidebarOpen" @close="sidebarOpen = false" />
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// Import centralized auth state (works for both regular login & MSAL)
import { isLoggedIn, userId, logout } from '@/utils/auth'

// Import your sidebar component
import Sidebar from './Sidebar.vue'

// Assets
const dropMenu = '/images/dropMenu.png'

// Router instance for navigation after logout
const router = useRouter()

// Sidebar visibility state
const sidebarOpen = ref(false)

// Computed: link to current user's profile page
const profileLink = computed(() => {
  return userId.value ? `/users/${userId.value}` : '/login'
})

// Toggle sidebar open/close
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

// Logout function — clears all tokens (regular + MSAL) and redirects to home
const disconnect = () => {
  logout() // ← clears localStorage + reactive state
  router.push('/') // ← go to homepage
  sidebarOpen.value = false // optional: close sidebar on logout
}
</script>
<style scoped>
.header {
  background-color: var(--medium-blue, #3c5a78);
  color: white;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 100;
}

.menu-button {
  background: none;
  border: none;
  color: var(--primary-green, #b3dec1);
  transition: color 0.3s;
  cursor: pointer;
  z-index: 101;
}

.menu-button:hover {
  opacity: 0.8;
}

.logo {
  width: 2.5em;
}

.logo-link {
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  margin-left: 10em;
}

.logo-text {
  font-size: 1.2rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
}

.logo-highlight {
  background-color: var(--primary-green, #b3dec1);
  color: var(--medium-blue, #1a3c5a);
  padding: 2px 6px;
  border-radius: 6px;
  font-weight: 600;
}

.profile-link {
  color: var(--primary-green, #b3dec1);
  transition: color 0.3s;
  text-decoration: none;
}

.profile-link:hover {
  opacity: 0.8;
}

.user-icon {
  width: 2em;
  height: 2em;
}
.loginButtons {
  display: flex;
  gap: 1em;
  align-items: center;
}

.disconnect-button {
  background: none;
  border: none;
  color: var(--primary-green, #b3dec1);
  transition: color 0.3s;
  cursor: pointer;
  padding: 0;
  font-size: 1em;
}

.disconnect-button:hover {
  opacity: 0.8;
}
</style>
