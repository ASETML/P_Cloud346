<template>
  <div class="container">
    <h1 class="profile-title">Your Profile</h1>

    <div class="profile-card">
      <div class="avatar-container">
        <div class="avatar">
          <span class="avatar-text">A</span>
        </div>
      </div>

      <div class="profile-info">
        <div class="info-item">
          <h2 class="info-label">Name</h2>
          <p v-if="user" class="info-value">{{ user.username }}</p>
        </div>

        <div class="info-item">
          <h2 class="info-label">Comments</h2>
          <p v-if="user" class="info-value">{{ comments }}</p>
        </div>

        <div class="info-item">
          <h2 class="info-label">Member Since</h2>
          <p v-if="user" class="info-value">{{ user.createdAt.slice(0, 10) }}</p>
        </div>
      </div>
    </div>
    <div class="info-item">
      <h2 class="info-label">Books Added</h2>
      <div v-if="books" class="books-grid">
        <DisplayBooks :books="books" :router="router" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import DisplayBooks from '../components/DisplayBooks.vue'
import { getCurrentUserId, getToken, isLoggedIn } from '../utils/auth.js'

// Initialize the router
const router = useRouter()
const route = useRoute()
//const userId = ref('')

const user = ref(null)
const books = ref([])
const loading = ref(true)
const comments = ref()

onMounted(async () => {
  try {
    const userId = getCurrentUserId()
    const token = getToken()
    if (!userId || !token) {
      alert('Please log in first')
      router.push('/login')
      return
    }

    const response = await fetch(`http://localhost:9999/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const result = await response.json()
    user.value = result.data

    const booksRes = await fetch(`http://localhost:9999/api/books/${userId}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const booksData = await booksRes.json()
    books.value = booksData.data

    const commentsRes = await fetch(`http://localhost:9999/api/books/${userId}/notes`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const commentsData = await commentsRes.json()
    comments.value = commentsData.length
  } catch (error) {
    console.error('Error loading user:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.container {
  margin: 0 auto;
  padding: 2rem 1rem;
  max-width: 1200px;
  margin-top: 80px; /* Added to account for the fixed header */
}

.profile-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--medium-blue, #4a6fa5);
  text-align: center;
  margin-bottom: 3rem;
}

.profile-card {
  max-width: 28rem;
  margin: 0 auto;
  background-color: #f8fafc;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.avatar-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.avatar {
  width: 6rem;
  height: 6rem;
  background-color: var(--medium-blue, #8da4be);
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-text {
  color: white;
  font-size: 1.875rem;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  margin-bottom: 0.5rem;
}

.info-label {
  color: var(--medium-blue, #4a6fa5);
  font-weight: 600;
}

.info-value {
  color: #8da4be;
}

.button-container {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}

.edit-button {
  background-color: var(--medium-blue, #4a6fa5);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.3s;
}

.edit-button:hover {
  background-color: #6789b5;
}
.books-grid {
  display: grid;
  grid-template-columns: repeat(5, 15.625em);
  justify-content: center;
  gap: 1.875em;
}

.book-card {
  background-color: #f8f9fa;
  border-radius: 0.5em;
  box-shadow: 0 0.125em 0.25em rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.book-card:hover {
  transform: translateY(-0.9375em);
  box-shadow: 0 0.625em 1.25em rgba(0, 0, 0, 0.12);
}

.book-title {
  font-size: 1.7em;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.3125em;
}

.book-cover {
  width: 100%;
  height: 23.75em;
  object-fit: cover;
  border-radius: 0.25em;
  margin-bottom: 0.625em;
}

.book-info {
  padding: 0.9375em;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
}
</style>
