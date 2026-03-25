import api from './api'

// Admin API calls
export const adminService = {
  // Get analytics
  getAnalytics: async () => {
    const response = await api.get('/admin/analytics')
    return response.data
  },

  // Get system health
  getSystemHealth: async () => {
    const response = await api.get('/admin/health')
    return response.data
  },

  // Get user management data
  getUserManagement: async (page = 1, limit = 10) => {
    const response = await api.get('/admin/users', {
      params: { page, limit },
    })
    return response.data
  },

  // Update user role
  updateUserRole: async (userId, role) => {
    const response = await api.put(`/admin/users/${userId}/role`, { role })
    return response.data
  },

  // Deactivate user subscription
  deactivateUserSubscription: async (userId) => {
    const response = await api.post(`/admin/users/${userId}/deactivate-subscription`)
    return response.data
  },

  // Get subscription management
  getSubscriptionManagement: async (page = 1, limit = 10) => {
    const response = await api.get('/admin/subscriptions', {
      params: { page, limit },
    })
    return response.data
  },

  // Get draw management
  getDrawManagement: async (page = 1, limit = 10) => {
    const response = await api.get('/admin/draws', {
      params: { page, limit },
    })
    return response.data
  },

  // Get winner verification queue
  getWinnerVerificationQueue: async (page = 1, limit = 10) => {
    const response = await api.get('/admin/winners/queue', {
      params: { page, limit },
    })
    return response.data
  },
}
