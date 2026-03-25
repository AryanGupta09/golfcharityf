import api from './api'

export const drawService = {
  getAllDraws: async (page = 1, limit = 10) => {
    const response = await api.get('/draws', { params: { page, limit } })
    return response.data
  },
  getDraw: async (drawId) => {
    const response = await api.get(`/draws/${drawId}`)
    return response.data
  },
  getLatestDraw: async () => {
    const response = await api.get('/draws/latest')
    return response.data
  },
  getNextDrawDate: async () => {
    const response = await api.get('/draws/next-date')
    return response.data
  },
  runDraw: async (mode = 'random') => {
    const response = await api.post('/draws/run', { mode })
    return response.data
  },
  simulateDraw: async (mode = 'random') => {
    const response = await api.post('/draws/simulate', { mode })
    return response.data
  },
}
