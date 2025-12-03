<template>
  <div class="form-container">
    <h2>Edit your book</h2>
    <form @submit.prevent="updateBook">
      <strong>Title</strong>
      <input v-model="bookData.titre" type="text" placeholder="Book's title" required />

      <strong>Year of editing</strong>
      <input
        v-model.number="bookData.annee_edition"
        type="number"
        placeholder="Book's year of editing"
        required
      />

      <strong>Number of pages</strong>
      <input
        v-model.number="bookData.nombre_de_page"
        type="number"
        placeholder="Book's number of pages"
        required
      />

      <strong>Category</strong>
      <input
        v-model="bookData.category_nom"
        type="text"
        placeholder="Book's category name"
        required
      />

      <strong>Writer</strong>
      <input
        v-model="bookData.writer_nom"
        type="text"
        placeholder="Writer full name (ex: Jean Dupont)"
        required
      />

      <!-- Current Image -->
      <div v-if="bookData.lien_image" class="current-image">
        <strong>Current Image</strong>
        <img
          :src="
            bookData.lien_image.startsWith('http')
              ? bookData.lien_image
              : `http://localhost:9999${bookData.lien_image}`
          "
          alt="Current book cover"
          class="preview-image"
        />
      </div>

      <!--Select new image -->
      <strong>New Image (optional)</strong>
      <input
        type="file"
        name="image"
        @change="handleImage"
        accept="image/jpeg, image/jpg, image/png, image/gif, image/jfif"
      />

      <div class="form-actions">
        <button type="submit" :disabled="saving">
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
        <button type="button" class="delete-button" @click="deleteBook" :disabled="saving">
          Delete Book
        </button>
        <router-link :to="'/my-books'" class="cancel-button">Cancel</router-link>
      </div>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCurrentUserId, getToken, isLoggedIn } from '../utils/auth.js'

export default {
  name: 'EditBookView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const bookData = ref({
      titre: '',
      annee_edition: null,
      nombre_de_page: null,
      category_nom: '',
      writer_nom: '',
      lien_image: '',
    })
    const loading = ref(true)
    const saving = ref(false)
    const error = ref(null)
    const image = ref(null)

    const handleImage = (event) => {
      const file = event.target.files[0]
      if (file) {
        image.value = file
      }
    }

    const fetchBookDetails = async () => {
      try {
        loading.value = true
        const token = getToken()
        const userId = getCurrentUserId()
        const bookId = route.params.id

        if (!token || !userId) {
          throw new Error('User not authenticated')
        }

        const response = await fetch(`http://localhost:9999/api/books/${bookId}`, {
          headers: {
            Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to fetch book details')
        }

        const data = await response.json()
        bookData.value = data.data
      } catch (err) {
        error.value = err.message || 'Failed to load book details'
        if (err.message === 'User not authenticated') {
          router.push('/login')
        }
      } finally {
        loading.value = false
      }
    }

    const updateBook = async () => {
      try {
        saving.value = true
        const token = getToken()
        const userId = getCurrentUserId()
        const bookId = route.params.id

        if (!token || !userId) {
          throw new Error('User not authenticated')
        }

        const formData = new FormData()
        formData.append('titre', bookData.value.titre)
        formData.append('annee_edition', bookData.value.annee_edition)
        formData.append('nombre_de_page', bookData.value.nombre_de_page)
        formData.append('category_nom', bookData.value.category_nom)
        formData.append('writer_nom', bookData.value.writer_nom)
        formData.append('userId', localStorage.getItem('CurrentUserId'))

        // Only append image if a new one was selected
        if (image.value) {
          formData.append('image', image.value)
        }

        const response = await fetch(`http://localhost:9999/api/books/${bookId}`, {
          method: 'PUT',
          headers: {
            Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
          },
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to update book')
        }

        const result = await response.json()

        // Navigate regardless of success message format
        router.push('/my-books')
      } catch (err) {
        console.error('Update error:', err) // Debug log
        error.value = err.message || 'Failed to update book'
        if (err.message === 'User not authenticated') {
          router.push('/login')
        }
      } finally {
        saving.value = false
      }
    }

    const deleteBook = async () => {
      if (!confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
        return
      }

      try {
        saving.value = true
        const token = localStorage.getItem('token')
        const bookId = route.params.id

        const response = await fetch(`http://localhost:9999/api/books/${bookId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to delete book')
        }

        if (confirm('Book deleted successfully! Return to My Books?')) {
          router.push('/my-books')
        }
      } catch (err) {
        error.value = err.message || 'Failed to delete book'
        if (err.message === 'User not authenticated') {
          router.push('/login')
        }
      } finally {
        saving.value = false
      }
    }

    // Add beforeRouteLeave guard
    const beforeRouteLeave = (to, from, next) => {
      if (saving.value) {
        next(false)
        return
      }

      if (confirm('Are you sure you want to leave? Any unsaved changes will be lost.')) {
        next()
      } else {
        next(false)
      }
    }

    onMounted(() => {
      fetchBookDetails()
    })

    return {
      bookData,
      loading,
      saving,
      error,
      updateBook,
      deleteBook,
      handleImage,
      beforeRouteLeave,
    }
  },
}
</script>

<style scoped>
.form-container {
  max-width: 80em;
  width: 40em;
  margin: 100px auto;
  padding: 30px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #415a77;
  text-align: center;
  margin-bottom: 20px;
  font-size: 2em;
  font-weight: 700;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

input {
  padding: 10px 15px;
  border: 1px solid #b3dec1;
  border-radius: 4px;
  font-size: 16px;
}

input:focus {
  outline: none;
  border-color: #007bff;
}

button {
  background-color: #b3dec1;
  color: white;
  padding: 35px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #64dd8c;
}

button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.delete-button {
  background-color: #dc3545;
}

.delete-button:hover {
  background-color: #c82333;
}

.cancel-button {
  background-color: #6c757d;
  text-decoration: none;
  text-align: center;
  padding: 35px 20px;
  color: white;
  border-radius: 4px;
  font-size: 16px;
  margin-top: 10px;
  transition: background-color 0.3s;
}

.cancel-button:hover {
  background-color: #5a6268;
}

.error {
  color: #dc3545;
  text-align: center;
  margin-top: 15px;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.current-image {
  margin: 15px 0;
}

.preview-image {
  max-width: 200px;
  max-height: 300px;
  object-fit: cover;
  border-radius: 4px;
  margin-top: 10px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .form-container {
    padding: 20px;
    margin: 10px;
  }
}
</style>
