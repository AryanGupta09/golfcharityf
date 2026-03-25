import api from './api'

// User API calls
export const userService = {
  // Get user by ID
  getUser: async (userId) => {
    const response = await api.get(`/users/${userId}`)
    return response.data
  },

  // Update user profile
  updateProfile: async (userId, data) => {
    const response = await api.put(`/users/${userId}`, data)
    return response.data
  },

  // Get user statistics
  getUserStats: async (userId) => {
    const response = await api.get(`/users/${userId}/stats`)
    return response.data
  },

  // Get all users (admin)
  getAllUsers: async (page = 1, limit = 10) => {
    const response = await api.get('/users', { params: { page, limit } })
    return response.data
  },

  // Delete user — backend cancels subscription first (item 21)
  deleteUser: async (userId) => {
    const response = await api.delete(`/users/${userId}`)
    return response.data
  },
}
