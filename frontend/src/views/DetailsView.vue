<template>
  <div class="container">
    <!-- Display loading message while data is being fetched -->
    <div v-if="loading" class="loading">Loading...</div>

    <!-- Show error message if book not found -->
    <div v-else-if="!book" class="error">Book not found</div>

    <!-- Display book content once data is available -->
    <div v-else class="book-container">
      <!-- Header section with title and average rating -->
      <div class="book-header">
        <h1 class="book-title">{{ book.titre }}</h1>

        <!-- Show star rating if evaluations are available -->
        <div class="rating-display" v-if="evaluations.length > 0">
          <star-rating :initial-rating="averageRating" :read-only="true" />
          <span class="rating-text">({{ evaluations.length }} reviews)</span>
        </div>
      </div>

      <!-- Book content section: image, details, resume, and comments -->
      <div class="book-content">
        <!-- Book image and PDF link -->
        <div class="book-image-container">
          <div class="book-image">
            <img
              v-if="book.lien_image"
              :src="
                book.lien_image.startsWith('http')
                  ? book.lien_image
                  : `http://localhost:9999${book.lien_image}`
              "
              :alt="book.titre"
              class="book-cover"
            />
          </div>
          <a :href="book.lien_pdf" class="pdf-link" v-if="book.lien_pdf">PDF Link</a>
        </div>

        <!-- Book details: author, editor, year, etc. -->
        <div class="book-details">
          <div class="author-info">
            <h2 class="author-title">
              Author: {{ author ? `${author.prenom} ${author.nom_de_famille}` : 'Unknown' }}
            </h2>
            <p class="editor" v-if="book.editeur">Editor: {{ book.editeur }}</p>
            <p class="details">
              <span v-if="book.annee_edition">Year: {{ book.annee_edition }}<br /></span>
              <span v-if="book.nombre_de_page">Pages: {{ book.nombre_de_page }}<br /></span>
              <span v-if="category">Category: {{ category.nom }}<br /></span>
              <span v-if="book.created"
                >Added: {{ new Date(book.created).toLocaleDateString() }}<br
              /></span>
              <span v-if="book.updated"
                >Last Updated: {{ new Date(book.updated).toLocaleDateString() }}</span
              >
            </p>
          </div>

          <!-- Resume/summary of the book -->
          <div class="resume-section" v-if="book.resume">
            <h3 class="section-title">Resume</h3>
            <p class="resume-text">{{ book.resume }}</p>
          </div>

          <!-- Evaluations and form to add new ones -->
          <div class="comments-section">
            <h3 class="section-title">Evaluations</h3>

            <!-- Display while loading evaluations -->
            <div v-if="loadingEvaluations" class="loading">Loading evaluations...</div>

            <!-- Show evaluations if available -->
            <div v-else>
              <div v-if="evaluations && evaluations.length > 0" class="comments-list">
                <div v-for="evaluation in evaluations" :key="evaluation.id" class="comment-card">
                  <div class="comment-header">
                    <p class="commenter-name">
                      {{ evaluation.user ? evaluation.user.username : 'Anonymous' }}
                    </p>
                    <star-rating :initial-rating="evaluation.note / 2" :read-only="true" />
                  </div>
                  <p class="comment-text">{{ evaluation.commentaire }}</p>
                  <p class="comment-date">
                    {{ new Date(evaluation.created).toLocaleDateString() }}
                  </p>
                </div>
              </div>

              <!-- Message if no evaluations exist yet -->
              <div v-else class="no-evaluations">
                No evaluations yet. Be the first to review this book!
              </div>

              <!-- Form to add a new evaluation if user is logged in -->
              <div v-if="isLoggedIn" class="new-comment-card">
                <h4 class="new-comment-title">Add Your Evaluation</h4>
                <form @submit.prevent="handleCommentSubmit">
                  <div class="rating-container">
                    <star-rating v-model="rating" />
                  </div>
                  <textarea
                    v-model="commentText"
                    class="comment-textarea"
                    rows="4"
                    placeholder="Write your evaluation here..."
                  ></textarea>
                  <div class="form-actions">
                    <button
                      type="button"
                      class="cancel-button"
                      @click="resetForm"
                      :disabled="submitting"
                    >
                      Cancel
                    </button>
                    <button type="submit" class="submit-button" :disabled="submitting">
                      {{ submitting ? 'Submitting...' : 'Submit Evaluation' }}
                    </button>
                  </div>
                </form>
              </div>

              <!-- Login prompt if user is not logged in -->
              <div v-else class="login-prompt">
                <p>
                  Please <router-link to="/login" class="login-link">login</router-link> to add your
                  evaluation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import StarRating from '../components/star-rating.vue'
import api from '../services/api'
import DisplayBooks from '../components/DisplayBooks.vue'
import { getCurrentUserId, getToken, isLoggedIn } from '../utils/auth.js'

// Reactive variables
const commentText = ref('')
const rating = ref(0)
const book = ref(null)
const loading = ref(true)
const evaluations = ref([])
const loadingEvaluations = ref(true)
const author = ref(null)
const category = ref(null)
const submitting = ref(false)

const route = useRoute()
const token = getToken()
const userId = getCurrentUserId()

// Computed average rating (out of 5 stars)
const averageRating = computed(() => {
  if (!evaluations.value || evaluations.value.length === 0) return 0
  const sum = evaluations.value.reduce((acc, evaluation) => acc + evaluation.note, 0)
  return sum / evaluations.value.length / 2
})

// Determine login status from localStorage
/*const token = localStorage.getItem('token')
const userId = localStorage.getItem('CurrentUserId')
isLoggedIn.value = !!(token && userId)*/

// Load book and related details from the API
const loadBookDetails = async () => {
  const bookId = route.params.id
  try {
    const bookResponse = await fetch(`http://localhost:9999/api/books/${bookId}`)
    const bookResult = await bookResponse.json()
    book.value = bookResult.data

    // Load author info if available
    if (book.value.writer_id) {
      const authorResponse = await fetch(
        `http://localhost:9999/api/authors/${book.value.writer_id}`,
      )
      const authorResult = await authorResponse.json()
      author.value = authorResult.data
    }

    // Load category info if available
    if (book.value.category_id) {
      const categoryResponse = await fetch(
        `http://localhost:9999/api/categories/${book.value.category_id}`,
      )
      const categoryResult = await categoryResponse.json()
      category.value = categoryResult
    }

    // Load evaluations/comments
    const evaluationsResponse = await fetch(`http://localhost:9999/api/books/${bookId}/notes`, {
      headers: { Authorization: token || '' },
    })
    if (!evaluationsResponse.ok) throw new Error('Failed to fetch evaluations')
    const evaluationsResult = await evaluationsResponse.json()
    evaluations.value = evaluationsResult
  } catch (error) {
    console.error('Error loading details:', error)
  } finally {
    loading.value = false
    loadingEvaluations.value = false
  }
}

// Reset form fields
const resetForm = () => {
  commentText.value = ''
  rating.value = 0
}

// Handle evaluation form submission
const handleCommentSubmit = async () => {
  if (!isLoggedIn.value) {
    alert('Please login to submit an evaluation')
    return
  }

  if (!commentText.value || !rating.value) {
    alert('Please provide both a rating and a comment')
    return
  }

  submitting.value = true
  try {
    const bookId = route.params.id
    const response = await fetch(`http://localhost:9999/api/books/${bookId}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({
        note: rating.value * 2,
        commentaire: commentText.value,
        user_id: userId,
        book_id: bookId,
      }),
    })

    if (!response.ok) throw new Error('Failed to submit evaluation')

    // Reload evaluations
    const evaluationsResponse = await fetch(`http://localhost:9999/api/books/${bookId}/notes`, {
      headers: { Authorization: token },
    })
    evaluations.value = await evaluationsResponse.json()
    commentText.value = ''
    rating.value = 0
  } catch (error) {
    console.error(error)
    alert('Error submitting evaluation')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadBookDetails()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.book-container {
  max-width: 900px;
  margin: 0 auto;
}

.book-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.book-title {
  font-size: 1.875rem;
  font-weight: bold;
  color: #3b6992;
  margin: 0;
  text-align: center;
}

.book-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.book-image-container {
  width: 100%;
}

.book-image {
  position: relative;
  aspect-ratio: 2/3;
  margin-bottom: 1rem;
  overflow: hidden;
  border-radius: 0.5rem;
}

.book-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: #f8f9fa;
}

.pdf-link {
  display: block;
  text-align: center;
  background-color: #7abc94; /* primary-green from original */
  color: black;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  text-decoration: none;
  transition: background-color 0.3s;
}

.pdf-link:hover {
  background-color: #9ed3ac;
}

.author-info {
  margin-bottom: 1rem;
}

.author-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #3b6992; /* medium-blue */
}

.editor {
  color: #7a8ea3; /* light-blue-gray */
}

.resume-section {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #3b6992; /* medium-blue */
  margin-bottom: 0.5rem;
}

.resume-text {
  color: #7a8ea3; /* light-blue-gray */
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.comment-card,
.new-comment-card {
  background-color: #f6f8fa; /* card-bg from original */
  padding: 1rem;
  border-radius: 0.5rem;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.commenter-name {
  font-weight: 600;
}

.comment-text {
  color: #7a8ea3; /* light-blue-gray */
}

.new-comment-title {
  color: #3b6992; /* medium-blue */
  font-weight: 600;
  margin-bottom: 1rem;
}

.rating-container {
  margin-bottom: 1rem;
}

.comment-textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #7abc94; /* primary-green */
  border-radius: 0.25rem;
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  justify-content: space-between;
}

.cancel-button {
  background-color: #f26565; /* delete-btn from original */
  color: black;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cancel-button:hover {
  background-color: #f37777;
}

.submit-button {
  background-color: #7abc94; /* primary-green */
  color: black;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #9ed3ac;
}

.submit-button:disabled,
.cancel-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive styles */
@media (min-width: 768px) {
  .book-content {
    flex-direction: row;
  }

  .book-image-container {
    width: 33.333%;
  }

  .book-details {
    width: 66.666%;
  }
}

.details {
  color: #7a8ea3;
  margin-top: 0.5rem;
  line-height: 1.5;
}

.comment-date {
  font-size: 0.8rem;
  color: #999;
  margin-top: 0.5rem;
  text-align: right;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #7a8ea3;
  font-style: italic;
}

.error {
  text-align: center;
  padding: 2rem;
  color: #f26565;
  font-weight: bold;
}

.no-evaluations {
  text-align: center;
  padding: 2rem;
  color: #7a8ea3;
  font-style: italic;
  background-color: #f6f8fa;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
}

.login-prompt {
  text-align: center;
  padding: 1rem;
  background-color: #f6f8fa;
  border-radius: 0.5rem;
  margin-top: 1rem;
}

.login-link {
  color: #3b6992;
  text-decoration: underline;
  font-weight: 600;
}

.login-link:hover {
  color: #7abc94;
}

.rating-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
}

.rating-text {
  color: #7a8ea3;
  font-size: 0.9rem;
}
</style>
