<!-- Home view component template -->
<template>
  <div class="accueil-container">
    <!-- Hero section with welcome message and site description -->
    <div class="hero-section">
      <h1>Welcome to your literary world</h1>
      <p class="site-description">
        Discover a refined selection of books that spark the imagination, nourish the mind, and
        enrich the heart. Whether you're a fiction lover, a history buff, or curious about science,
        our collection is for you. <br /><br />
        Browse our current favorites—we present the
        <strong>5 most-loved books</strong> to kick-start your literary journey.
      </p>
    </div>

    <!-- Books section with toggle functionality -->
    <section class="books-section">
      <h3 class="section-title">Latest Books</h3>
      <!-- Toggle button to show/hide more books -->
      <div class="see-more-container">
        <button class="see-more-btn" @click="showAll = !showAll">
          {{ showAll ? 'See less' : 'See more' }}
        </button>
      </div>
      <div v-if="loading" class="loading">Loading...</div>
      <DisplayBooks :books="books" :router="router" :show-all="showAll" />
    </section>
  </div>
</template>

<script setup>
// Vue composition API imports
import { ref, onMounted } from 'vue'
// Router import
import { useRouter } from 'vue-router'
// DisplayBooks component import
import DisplayBooks from '../components/DisplayBooks.vue'

// Initialize router instance
const router = useRouter()

// Reactive state variables
// Loading state for API calls
const loading = ref(true)
// Array to store books data
const books = ref([])
// Toggle state for showing all books
const showAll = ref(false)

// Lifecycle hook to fetch books when component mounts
onMounted(async () => {
  // Fetch books from backend API

  try {
    const response = await fetch('http://localhost:9999/api/books')
    const result = await response.json()
    // If the response has the structure { message: "...", data: [...] }
    books.value = result.data
  } catch (error) {
    console.error('Error loading books:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.see-more-container {
  text-align: center;
  margin-top: 1.25em;
}

.see-more-btn:hover {
  background-color: #3a78c2;
}
.see-more-btn {
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 0.75em 1.5em;
  font-size: 1.5em;
  border-radius: 0.375em;
  cursor: pointer;
  transition: background-color 0.5s ease;
  margin-bottom: 1.25em;
}
.accueil-container {
  max-width: 97.5em;
  margin: 9.375em auto 6.25em auto; /* Center horizontally and add space at the top and bottom */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(180deg, #ffffff, #f0f4f8);
  border-radius: 1em;
  box-shadow: 0 0 1.25em rgba(0, 0, 0, 0.05);
  padding: 2.25em;
}

.hero-section {
  text-align: center;
  margin-top: 2em; /* Adjust this value to be smaller */
}

.hero-section h1 {
  padding-top: 1.25em;
  font-size: 2.8em;
  color: #2c3e50;
  margin-bottom: 1.25em;
  animation: fadeIn 1s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-1.5625em);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.site-description {
  font-size: 1.1em;
  line-height: 1.6;
  color: #555;
  max-width: 50em;
  margin: 0 auto;
}

.quick-links {
  display: flex;
  justify-content: center;
  gap: 1.25em;
  margin-bottom: 2.5em;
}

.quick-link {
  padding: 0.625em 1.25em;
  background-color: #b6e1c6;
  color: white;
  text-decoration: none;
  border-radius: 0.25em;
  transition: background-color 0.3s;
}

.quick-link:hover {
  background-color: #9bc9b4;
}

.books-section {
  margin-bottom: 3.125em;
}

.section-title {
  font-size: 2.5em;
  color: #2c3e50;
  margin: 1.25em 1.25em;
  text-align: center;
}
</style>
