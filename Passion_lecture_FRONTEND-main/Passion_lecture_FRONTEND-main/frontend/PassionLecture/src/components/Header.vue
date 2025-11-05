<template>
  <header class="header">
    <button @click="toggleSidebar" class="menu-button" aria-label="Toggle menu">
      <img :src="dropMenu" class="logo" alt="Menu" />
    </button>
    <router-link to="/" class="logo-link">
      <h1 class="logo-text">Passion <span class="logo-highlight">Lecture</span></h1>
    </router-link>
    <div class="loginButtons">
      <router-link to="/login" class="profile-link" v-if="!isLoggedIn">
        <p>Log in</p>
      </router-link>
      <router-link to="/register" class="profile-link" v-if="!isLoggedIn">
        <p>Register</p>
      </router-link>
      <router-link :to="profileLink" class="profile-link" v-if="isLoggedIn">
        <img src="/images/userProfile.png" class="user-icon" alt="User Profile" />
      </router-link>
      <button @click="disconnect" class="disconnect-button" v-if="isLoggedIn">
        <p>Disconnect</p>
      </button>
    </div>

    <Sidebar
      v-if="sidebarOpen && isSidebarAvailable"
      :is-open="sidebarOpen"
      @close="setSidebarOpen(false)"
    />
  </header>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
// TODO: Uncomment when lucide-vue-next is installed
// import { Menu, User } from 'lucide-vue-next'
import Sidebar from './Sidebar.vue'

// Reactive state variables
const token = ref('') // Stores the current authentication token
const dropMenu = '/images/dropMenu.png' // Menu icon image path
const sidebarOpen = ref(false) // Controls sidebar visibility
const isSidebarAvailable = computed(() => !!Sidebar) // Checks if Sidebar component is available

/**
 * Computed property that checks if user is logged in
 * @returns {boolean} True if user has valid token and userId
 */
const isLoggedIn = computed(() => {
  // Check both token and userId presence in localStorage
  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('CurrentUserId')
  return !!(token && userId) // Returns true only if both exist
})

/**
 * Computed property that determines user's profile link
 * @returns {string} User profile URL or login page URL
 */
const profileLink = computed(() => {
  const userId = localStorage.getItem('CurrentUserId')
  return userId ? `/users/${userId}` : '/login' // Navigate to profile if logged in, otherwise to login
})

// Lifecycle hook to validate token when component mounts
onMounted(async () => {
  await tryToken() // Call token validation on component mount
})

/**
 * Validates and refreshes user token
 * @async
 * @returns {Promise<void>}
 */
const tryToken = async () => {
  const savedToken = localStorage.getItem('token') // Get token from storage

  if (!savedToken) {
    console.log('No token found')
    localStorage.removeItem('userId') // Clean up any stray userId
    return
  }

  // Extract the actual token from "Bearer token" format
  const actualToken = savedToken.startsWith('Bearer ') 
    ? savedToken.split(' ')[1] // Remove "Bearer " prefix
    : savedToken // Use token as is if no prefix

  try {
    // Send POST request to validate token
    const response = await fetch(`http://localhost:9999/api/auth/login/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: actualToken }), // Send token for validation
    })

    const result = await response.json()

    if (result.valid) {
      console.log('User authenticated with token:', result.user)
      // Update userId in case it was missing
      localStorage.setItem('CurrentUserId', result.user.id)
    } else {
      console.log('Invalid or expired token')
      localStorage.removeItem('token') // Clear invalid token
      localStorage.removeItem('CurrentUserId') // Clear associated user ID
    }
  } catch (e) {
    console.error('Token validation failed:', e)
  }
}

/**
 * Sets the sidebar open state
 * @param {boolean} value - New state for sidebar visibility
 */
const setSidebarOpen = (value) => {
  sidebarOpen.value = value
}

/**
 * Toggles the sidebar visibility
 */
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

/**
 * Handles user logout by clearing authentication data
 */
const disconnect = () => {
  localStorage.removeItem('token') // Remove authentication token
  localStorage.removeItem('CurrentUserId') // Remove user ID
  window.location.href = '/'
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
