import api from './api'

// Winner API calls
export const winnerService = {
  // Get user wins
  getUserWins: async (userId) => {
    const response = await api.get(`/winners/user/${userId}`)
    return response.data
  },

  // Upload proof
  uploadProof: async (winnerId, proofImageUrl) => {
    const response = await api.post(`/winners/${winnerId}/upload-proof`, {
      proofImageUrl,
    })
    return response.data
  },

  // Verify winner (admin)
  verifyWinner: async (winnerId, isApproved, rejectionReason) => {
    const response = await api.post(`/winners/${winnerId}/verify`, {
      isApproved,
      rejectionReason,
    })
    return response.data
  },

  // Get pending verifications (admin)
  getPendingVerifications: async (page = 1, limit = 10) => {
    const response = await api.get('/winners/pending', {
      params: { page, limit },
    })
    return response.data
  },

  // Process payment (admin)
  processPayment: async (winnerId, transactionId) => {
    const response = await api.post(`/winners/${winnerId}/process-payment`, {
      transactionId,
    })
    return response.data
  },

  // Get all winners (admin)
  getAllWinners: async (page = 1, limit = 10) => {
    const response = await api.get('/winners', {
      params: { page, limit },
    })
    return response.data
  },
}
