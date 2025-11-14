<template>
  <div>Logging in...</div>
</template>

<script>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const router = useRouter()

    onMounted(() => {
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')
      if (code) {
        // Отправляем код на бэкенд для получения токена
        fetch(`http://localhost:9999/ms-login?code=${code}`, {
          method: 'POST',
        })
          .then(() => {
            router.push('/') // редирект на домашнюю страницу после логина
          })
          .catch((err) => {
            console.error(err)
            router.push('/login')
          })
      } else {
        router.push('/login')
      }
    })
  },
}
</script>
