<template>
  <div>Redirecting...</div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { setMsalToken } from '@/utils/auth'

const router = useRouter()
const BACKEND_URL = 'https://passion-lecture-albyos-backend.azurewebsites.net'

onMounted(async () => {
  //We get the code from the query parameters
  const code = new URLSearchParams(window.location.search).get('code')

  if (!code) {
    // If there is no code, we return the user to the login page
    return router.push('/login')
  }

  try {
    // GET request to the backend callback
    const res = await fetch(`${BACKEND_URL}/msal/callback?code=${code}`)

    if (!res.ok) {
      console.error('Callback error:', res.status)
      return router.push('/login')
    }

    const data = await res.json()

    // Saving JWT and userId via centralized auth helper
    setMsalToken(data.jwt, data.user.utilisateur_id)

    // Redirect to the home page
    router.push('/')
  } catch (err) {
    console.error('MSAL callback failed:', err)
    router.push('/login')
  }
})
</script>
