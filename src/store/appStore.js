import { create } from 'zustand'

// App store for managing global app state
export const useAppStore = create((set) => ({
  darkMode: false,
  sidebarOpen: true,
  
  // Toggle dark mode
  toggleDarkMode: () => set((state) => ({
    darkMode: !state.darkMode,
  })),

  // Toggle sidebar
  toggleSidebar: () => set((state) => ({
    sidebarOpen: !state.sidebarOpen,
  })),

  // Set sidebar state
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))
