import api from './api'

export const scoreService = {
  addScore: async (score, date, courseInfo) => {
    const response = await api.post('/scores', { score, date, courseInfo })
    return response.data
  },
  editScore: async (scoreId, data) => {
    const response = await api.put(`/scores/${scoreId}`, data)
    return response.data
  },
  getUserScores: async () => {
    const response = await api.get('/scores')
    return response.data
  },
  getScoreStats: async (userId) => {
    const response = await api.get(`/scores/stats/${userId}`)
    return response.data
  },
  deleteScore: async (scoreId) => {
    const response = await api.delete(`/scores/${scoreId}`)
    return response.data
  },
}
