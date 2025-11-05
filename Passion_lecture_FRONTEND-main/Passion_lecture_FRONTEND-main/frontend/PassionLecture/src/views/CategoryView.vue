<template>
  <div class="accueil-container">
    <section class="books-section">
      <h3 class="section-title">📚 Book Categories</h3>
      <div v-if="loading" class="loading">Loading categories...</div>
      <div v-else class="columns-wrapper">
        <div v-for="(column, colIndex) in groupedCategories" :key="colIndex" class="column">
          <div v-for="categorie in column" :key="categorie.categorie_id" class="book-card">
            <RouterLink :to="`/categories/${categorie.categorie_id}/books`" class="card-link">
              <div class="card-content">
                <h4 class="book-title">{{ categorie.nom }}</h4>
              </div>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// We import the necessary functions
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { RouterLink, RouterView } from 'vue-router'

// Initialize the router
const router = useRouter()

// Define the loading state and books array waitung for data to be loaded
const loading = ref(true)
const categories = ref([])

//To place every category correctly and max 10 in a coloumn
const groupedCategories = ref([])

function groupBy10(list) {
  const groups = []
  for (let i = 0; i < list.length; i += 10) {
    groups.push(list.slice(i, i + 10))
  }
  return groups
}

// Book data loading from API
onMounted(async () => {
  try {
    const response = await fetch('http://localhost:9999/api/categories')
    const result = await response.json()
    categories.value = result
    groupedCategories.value = groupBy10(result)
  } catch (error) {
    console.error('Error loading categories:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.accueil-container {
  max-width: 1200px;
  margin: 4em auto;
  padding: 2em;
  background: linear-gradient(145deg, #f9f9f9, #e6ecf3);
  border-radius: 1em;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.05);
  font-family: 'Inter', sans-serif;
}

.section-title {
  text-align: center;
  font-size: 2.4em;
  margin-bottom: 1.5em;
  color: #2d3e50;
  font-weight: 700;
}
.columns-wrapper {
  display: flex;
  gap: 2em;
  flex-wrap: wrap;
  justify-content: center;
}

.column {
  display: flex;
  flex-direction: column;
  gap: 1.5em;
}

.loading {
  text-align: center;
  font-size: 1.2em;
  color: #888;
  padding: 2em;
}

.books-grid {
  display: grid;
  gap: 2em;
  grid-auto-flow: row;
  grid-template-columns: repeat(auto-fit, minmax(13.75em, 1fr));
  justify-content: center;
  animation: fadeIn 0.8s ease-in;
}

.book-card {
  background: #ffffff;
  border-radius: 0.75em;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  overflow: hidden;
}

.book-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

.card-link {
  text-decoration: none;
  display: block;
  height: 100%;
  color: inherit;
}

.card-content {
  padding: 1.5em;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.book-title {
  font-size: 1.4em;
  font-weight: 600;
  text-align: center;
  color: #34495e;
  word-break: break-word;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive tweaks */
@media (max-width: 600px) {
  .section-title {
    font-size: 2em;
  }

  .card-content {
    padding: 1em;
  }

  .book-title {
    font-size: 1.2em;
  }
}
</style>
