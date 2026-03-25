import axios from 'axios'
import { useAuthStore } from '../store/authStore'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 60000, // 60 sec — Render free tier cold start
})

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const code = error.response?.data?.code

    // Item 3: JWT expiry → auto redirect to login
    if (status === 401) {
      useAuthStore.getState().logout()
      // Only redirect if not already on auth pages
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
        window.location.href = '/login'
      }
    }

    // Item 6: subscription required — let components handle this with the code
    // Don't redirect, just pass the error through so UI can show proper message
    return Promise.reject(error)
  }
)

export default api
