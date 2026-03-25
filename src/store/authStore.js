import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Auth store for managing authentication state
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Set user and token
      setAuth: (user, token) => set({
        user,
        token,
        isAuthenticated: true,
        error: null,
      }),

      // Clear auth
      logout: () => set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      }),

      // Set loading state
      setLoading: (isLoading) => set({ isLoading }),

      // Set error
      setError: (error) => set({ error }),

      // Update user
      updateUser: (user) => set({ user }),

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
