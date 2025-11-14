<template>
  <div>Logging in...</div>
</template>

<script>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const router = useRouter()

    onMounted(async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')

      if (code) {
        try {
          const response = await fetch(`http://localhost:9999/ms-login?code=${code}`, {
            method: 'POST',
          })

          if (!response.ok) throw new Error('Failed to login')

          const data = await response.json()
          // Сохраняем токен в localStorage
          localStorage.setItem('token', data.access_token)
          localStorage.setItem('CurrentUserId', data.id_token)

          router.push('/') // редирект на домашнюю страницу после логина
        } catch (err) {
          console.error(err)
          router.push('/login')
        }
      } else {
        router.push('/login')
      }
    })
  },
}
</script>
