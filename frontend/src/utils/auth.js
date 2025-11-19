// utils/auth.js
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

export const isLoggedIn = () => {
  return !!getToken() && !!getCurrentUserId()
}
