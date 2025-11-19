<template>
  <!-- Simple page shown while redirecting -->
  <div>Redirecting...</div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(async () => {
   // Get the "code" query parameter returned from Microsoft OAuth2
  const code = new URLSearchParams(window.location.search).get('code')

   // If no code exists, redirect the user to the login page
  if (!code) return router.push('/login')
   // Send the code to the backend MSAL callback endpoint to exchange for tokens
  const res = await fetch(`http://localhost:9999/msal/callback?code=${code}`, {
    method: 'POST',
  })

  const data = await res.json()

  // Save the returned JWT and access tokens in localStorage for later use
  localStorage.setItem('ms_jwt', data.jwt)      // JWT for app authentication
  localStorage.setItem('ms_access', data.access_token)   // Microsoft access token
  localStorage.setItem('ms_id', data.id_token)    // Microsoft ID token

   // Redirect the user to the home page after successful login
  router.push('/')
})
</script setup>
