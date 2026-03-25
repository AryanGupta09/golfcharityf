import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogOut, Moon, Sun, Heart } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useAppStore } from '../store/appStore'
import toast from 'react-hot-toast'

const NavLink = ({ to, children }) => {
  const { pathname } = useLocation()
  const active = pathname === to

  return (
    <Link to={to} className="relative group py-1">
      <span className={`text-sm font-medium transition-colors duration-200 ${
        active ? 'text-navy-600 dark:text-navy-400' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
      }`}>
        {children}
      </span>
      {active && (
        <motion.div layoutId="nav-indicator"
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-navy-600 dark:bg-navy-400 rounded-full"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
      )}
    </Link>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, token, logout } = useAuthStore()
  const { darkMode, toggleDarkMode } = useAppStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out')
    navigate('/login')
    setOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-dark-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div whileHover={{ rotate: 10 }} transition={{ type: 'spring', stiffness: 300 }}
              className="w-8 h-8 bg-gradient-to-br from-navy-600 to-coral-500 rounded-xl flex items-center justify-center">
              <Heart size={16} className="text-white" />
            </motion.div>
            <span className="font-bold text-lg text-gray-900 dark:text-white tracking-tight">
              Golf<span className="text-coral-500">Charity</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {!token ? (
              <>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/charities">Charities</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/charities">Charities</NavLink>
                {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
              </>
            )}
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>

            {!token ? (
              <>
                <Link to="/login">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-xl transition-colors">
                    Login
                  </motion.button>
                </Link>
                <Link to="/signup">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    className="px-4 py-2 text-sm font-semibold bg-navy-600 text-white rounded-xl hover:bg-navy-700 transition-colors">
                    Get Started
                  </motion.button>
                </Link>
              </>
            ) : (
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                <LogOut size={18} />
              </motion.button>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-2">
            <motion.button whileTap={{ scale: 0.95 }} onClick={toggleDarkMode}
              className="p-2 rounded-xl text-gray-500 dark:text-gray-400">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setOpen(!open)}
              className="p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700">
              {open ? <X size={22} /> : <Menu size={22} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="md:hidden border-t border-gray-100 dark:border-dark-800 bg-white dark:bg-dark-900 overflow-hidden">
            <div className="px-4 py-4 space-y-1">
              {!token ? (
                <>
                  <MobileLink to="/" onClick={() => setOpen(false)}>Home</MobileLink>
                  <MobileLink to="/charities" onClick={() => setOpen(false)}>Charities</MobileLink>
                  <MobileLink to="/login" onClick={() => setOpen(false)}>Login</MobileLink>
                  <Link to="/signup" onClick={() => setOpen(false)}
                    className="block w-full text-center mt-2 px-4 py-3 bg-navy-600 text-white font-semibold rounded-xl">
                    Get Started
                  </Link>
                </>
              ) : (
                <>
                  <MobileLink to="/dashboard" onClick={() => setOpen(false)}>Dashboard</MobileLink>
                  <MobileLink to="/charities" onClick={() => setOpen(false)}>Charities</MobileLink>
                  {user?.role === 'admin' && <MobileLink to="/admin" onClick={() => setOpen(false)}>Admin</MobileLink>}
                  <button onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-600 dark:text-red-400 font-medium rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20">
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

const MobileLink = ({ to, children, onClick }) => (
  <Link to={to} onClick={onClick}
    className="block px-4 py-3 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors">
    {children}
  </Link>
)
