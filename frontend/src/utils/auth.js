import { ref, computed } from 'vue'

const token = ref('')
const msJwt = ref('')
const currentUserId = ref('')

// Initialization at application startup
export const initAuth = () => {
  token.value = localStorage.getItem('token') || ''
  msJwt.value = localStorage.getItem('ms_jwt') || ''
  currentUserId.value = localStorage.getItem('CurrentUserId') || ''
}

// Active token (either of the two)
export const activeToken = computed(() => token.value || msJwt.value)

// Is the user logged in?
export const isLoggedIn = computed(() => {
  return !!(activeToken.value && currentUserId.value)
})

//Current user ID
export const userId = computed(() => currentUserId.value)

// Authorization header for fetch
export const authHeader = computed(() => {
  const t = activeToken.value
  return t ? { Authorization: t.startsWith('Bearer ') ? t : `Bearer ${t}` } : {}
})

// Installing a token (for regular login)
export const setToken = (newToken, userId) => {
  token.value = newToken
  currentUserId.value = userId
  localStorage.setItem('token', newToken)
  localStorage.setItem('CurrentUserId', userId)
  localStorage.removeItem('ms_jwt') //  clean the MSAL type
}

// Installing an MSAL token
export const setMsalToken = (jwt, userId) => {
  msJwt.value = jwt
  currentUserId.value = userId
  localStorage.setItem('ms_jwt', jwt)
  localStorage.setItem('CurrentUserId', userId)
  localStorage.removeItem('token') // clean the usual type
}

// logout
export const logout = () => {
  token.value = ''
  msJwt.value = ''
  currentUserId.value = ''
  localStorage.removeItem('token')
  localStorage.removeItem('ms_jwt')
  localStorage.removeItem('CurrentUserId')
}

export const getCurrentUserId = () => {
  // Try MSAL first
  let userId = localStorage.getItem('CurrentUserId')
  let token = localStorage.getItem('token') || localStorage.getItem('ms_jwt')

  if (!userId || !token) return null

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.userId || userId
  } catch (e) {
    console.error('Error decoding token:', e)
    return null
  }
}

export const getToken = () => {
  return localStorage.getItem('token') || localStorage.getItem('ms_jwt')
}
