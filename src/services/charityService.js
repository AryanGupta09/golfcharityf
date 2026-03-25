import api from './api'

export const charityService = {
  getAllCharities: async (page = 1, limit = 10) => {
    const response = await api.get('/charities', { params: { page, limit } })
    return response.data
  },
  getFeaturedCharity: async () => {
    const response = await api.get('/charities/featured')
    return response.data
  },
  getCharity: async (id) => {
    const response = await api.get(`/charities/${id}`)
    return response.data
  },
  getCharityStats: async (id) => {
    const response = await api.get(`/charities/${id}/stats`)
    return response.data
  },
  createCharity: async (data) => {
    const response = await api.post('/charities', data)
    return response.data
  },
  updateCharity: async (id, data) => {
    const response = await api.put(`/charities/${id}`, data)
    return response.data
  },
  deleteCharity: async (id) => {
    const response = await api.delete(`/charities/${id}`)
    return response.data
  },
  setFeatured: async (id) => {
    const response = await api.put(`/charities/${id}/feature`)
    return response.data
  },
  addEvent: async (id, eventData) => {
    const response = await api.post(`/charities/${id}/events`, eventData)
    return response.data
  },
  deleteEvent: async (charityId, eventId) => {
    const response = await api.delete(`/charities/${charityId}/events/${eventId}`)
    return response.data
  },
  makeDonation: async (charityId, amount, message) => {
    const response = await api.post(`/charities/${charityId}/donate`, { amount, message })
    return response.data
  },
}
