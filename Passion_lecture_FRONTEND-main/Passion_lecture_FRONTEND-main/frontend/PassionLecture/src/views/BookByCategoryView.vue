<template>
  <div class="accueil-container">
    <!-- Books section -->
    <section class="books-section">
      <h3 class="section-title">Latest Books</h3>
      <div v-if="loading" class="loading">Loading...</div>
      <div v-else class="books-grid">
        <DisplayBooks :books="books" :router="router" />
      </div>
    </section>
  </div>
</template>

<script setup>
// We import the necessary functions
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import DisplayBooks from '../components/DisplayBooks.vue'

// Initialize the router
const router = useRouter()
const route = useRoute()
const categorieId = route.params.categorie_id

// Define the loading state and books array waiting for data to be loaded
const loading = ref(true)
const books = ref([])

// Book data loading from API
onMounted(async () => {
  // Fetch books from API
  try {
    const response = await fetch(`http://localhost:9999/api/categories/${categorieId}/books`)
    const result = await response.json()
    // If the response has the structure { message: "...", data: [...] }
    books.value = result.data
  } catch (error) {
    console.error('Error loading categories:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
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

.see-more-container {
  text-align: center;
  margin-top: 1.25em;
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

.see-more-btn:hover {
  background-color: #3a78c2;
}

.book-author {
  color: #666;
  font-size: 0.9em;
}

@media (max-width: 48em) {
  .quick-links {
    flex-direction: column;
    align-items: center;
  }

  .books-grid {
    grid-template-columns: 1fr;
  }

  .book-cover {
    width: 100%;
    height: 12.5em;
    object-fit: cover;
    border-radius: 0.25em;
    margin-bottom: 0.625em;
  }

  .loading {
    text-align: center;
    padding: 1.25em;
    font-style: italic;
    color: #666;
  }

  @media (max-width: 75em) {
    .books-grid {
      grid-template-columns: repeat(4, 1fr); /* планшет, 4 книги в ряд */
    }
  }

  @media (max-width: 62em) {
    .books-grid {
      grid-template-columns: repeat(3, 1fr); /* маленькие планшеты */
    }
  }
  @media (max-width: 30em) {
    .books-grid {
      grid-template-columns: 1fr; /* мобильный */
    }

    .book-cover {
      height: 12.5em;
    }
  }
}
</style>
