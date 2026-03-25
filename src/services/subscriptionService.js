import api from './api'

export const subscriptionService = {
  // Stripe checkout — redirects to Stripe
  createCheckoutSession: async (plan) => {
    const response = await api.post('/subscriptions/checkout', { plan })
    return response.data
  },
  // Demo subscribe (no real payment)
  createSubscription: async (plan, charityId) => {
    const response = await api.post('/subscriptions', { plan, charityId })
    return response.data
  },
  getUserSubscription: async (userId) => {
    const response = await api.get(`/subscriptions/user/${userId}`)
    return response.data
  },
  renewSubscription: async (subscriptionId) => {
    const response = await api.post(`/subscriptions/${subscriptionId}/renew`)
    return response.data
  },
  cancelSubscription: async (subscriptionId) => {
    const response = await api.delete(`/subscriptions/${subscriptionId}`)
    return response.data
  },
  getAllSubscriptions: async (page = 1, limit = 10) => {
    const response = await api.get('/subscriptions', { params: { page, limit } })
    return response.data
  },
}
