<template>
  <div class="container">
    <h1 class="page-title">Log in to Passion Lecture</h1>
    <form class="register-form" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label class="form-label">Name</label>
        <input type="text" v-model="name" placeholder="Albert" class="form-input" />
      </div>
      <div class="form-group">
        <label class="form-label">Password</label>
        <input type="password" v-model="password" placeholder="************" class="form-input" />
      </div>
      <div class="form-actions">
        <button class="cancel-button" type="button" @click="handleCancel">Cancel</button>

        <button
          type="submit"
          :class="['confirm-button', { active: buttonActive }]"
          :disabled="!buttonActive"
        >
          Confirm
        </button>
        <button type="button" class="confirm-button active" @click="handleMsalLogin">
          Login with Microsoft
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { setToken } from '../utils/auth'
const name = ref('')
const password = ref('')
const token = ref('')
const buttonActive = computed(() => {
  if (password.value && name.value) {
    return true
  }
})

const handleSubmit = async () => {
  try {
    const response = await fetch(`http://localhost:9999/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: name.value,
        password: password.value,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Server error:', data)
      alert(`Error: ${data.message}`)
      return
    }
    try {
      console.log('Received token from backend:', data)
      const decodedToken = JSON.parse(atob(data.data.split('.')[1]))
      localStorage.setItem('token', `Bearer ${data.data}`)
      localStorage.setItem('CurrentUserId', decodedToken.userId)
    } catch (e) {
      console.log(e)
    }
    alert('Login successful!')

    // Redirect to home page and force a refresh
    window.location.href = '/'
  } catch (error) {
    console.error('Error during fetch:', error)
    alert('An unexpected error occurred.')
  }
}

const handleMsalLogin = () => {
  window.location.href = 'http://localhost:9999/msal/login'
}

const handleCancel = () => {
  // Cancel logic - for example, redirect or reset form
  name.value = ''
  password.value = ''
}
</script>

<style scoped>
.confirm-button.disabled {
  background-color: #ddd;
  color: #999;
  cursor: not-allowed;
}
.confirm-button.disabled:hover {
  background-color: #ccc;
  color: #888;
}
.confirm-button {
  padding: 8px 12px;
  background-color: lightgray;
  border: none;
}
.confirm-button.active {
  background-color: green;
  color: white;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  padding-top: 5rem; /* Add space for fixed header */
}
.page-title {
  font-size: 2.25rem;
  font-weight: bold;
  color: #3b6992; /* text-medium-blue */
  text-align: center;
  margin-bottom: 3rem;
}
.register-form {
  max-width: 28rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.form-group {
  display: flex;
  flex-direction: column;
}
.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #3b6992; /* text-medium-blue */
}
.form-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #7abc94; /* border-primary-green */
  border-radius: 0.25rem;
}
.form-actions {
  display: flex;
  justify-content: space-between;
  padding-top: 2rem;
}
.cancel-button {
  background-color: #f26565; /* bg-delete-btn */
  color: black;
  padding: 1rem 3rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}
.cancel-button:hover {
  background-color: #f37777;
}
.confirm-button {
  background-color: #7abc94; /* bg-primary-green */
  color: black;
  padding: 1rem 3rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}
.confirm-button:hover {
  background-color: #9ed3ac;
}
</style>
