import api from './api'

// Authentication API calls
export const authService = {
  // Signup
  signup: async (name, email, password) => {
    const response = await api.post('/auth/signup', {
      name,
      email,
      password,
      confirmPassword: password,
    })
    return response.data
  },

  // Login
  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    })
    return response.data
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },
}
