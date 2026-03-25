import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { useAppStore } from './store/appStore'
import { useAuthStore } from './store/authStore'

import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import CharitiesPage from './pages/CharitiesPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardLayout from './layouts/DashboardLayout'
import DashboardPage from './pages/dashboard/DashboardPage'
import ScoresPage from './pages/dashboard/ScoresPage'
import WinningsPage from './pages/dashboard/WinningsPage'
import SettingsPage from './pages/dashboard/SettingsPage'
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminCharities from './pages/admin/AdminCharities'
import AdminDraws from './pages/admin/AdminDraws'
import AdminWinners from './pages/admin/AdminWinners'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? children : <Navigate to="/login" />
}
function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore()
  return isAuthenticated && user?.role === 'admin' ? children : <Navigate to="/dashboard" />
}

// Page transition wrapper
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.25, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
)

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
        <Route path="/charities" element={<PageWrapper><CharitiesPage /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
        <Route path="/signup" element={<PageWrapper><SignupPage /></PageWrapper>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><DashboardPage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/dashboard/scores" element={<ProtectedRoute><DashboardLayout><ScoresPage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/dashboard/winnings" element={<ProtectedRoute><DashboardLayout><WinningsPage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/dashboard/settings" element={<ProtectedRoute><DashboardLayout><SettingsPage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminLayout><AdminUsers /></AdminLayout></AdminRoute>} />
        <Route path="/admin/charities" element={<AdminRoute><AdminLayout><AdminCharities /></AdminLayout></AdminRoute>} />
        <Route path="/admin/draws" element={<AdminRoute><AdminLayout><AdminDraws /></AdminLayout></AdminRoute>} />
        <Route path="/admin/winners" element={<AdminRoute><AdminLayout><AdminWinners /></AdminLayout></AdminRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  const { darkMode } = useAppStore()
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className={darkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-ivory-50 dark:bg-dark-950 text-gray-900 dark:text-white">
          <Navbar />
          <Toaster position="top-right" toastOptions={{
            style: { borderRadius: '12px', fontFamily: 'Inter, sans-serif', fontSize: '14px' }
          }} />
          <AnimatedRoutes />
        </div>
      </div>
    </Router>
  )
}
