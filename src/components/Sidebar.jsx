import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, TrendingUp, Gift, Settings, BarChart3, Users, Trophy, X } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { useAuthStore } from '../store/authStore'

const userMenu = [
  { icon: LayoutDashboard, label: 'Dashboard',  path: '/dashboard' },
  { icon: TrendingUp,      label: 'Scores',     path: '/dashboard/scores' },
  { icon: Trophy,          label: 'Winnings',   path: '/dashboard/winnings' },
  { icon: Settings,        label: 'Settings',   path: '/dashboard/settings' },
]
const adminMenu = [
  { icon: BarChart3, label: 'Analytics', path: '/admin' },
  { icon: Users,     label: 'Users',     path: '/admin/users' },
  { icon: Gift,      label: 'Charities', path: '/admin/charities' },
  { icon: TrendingUp,label: 'Draws',     path: '/admin/draws' },
  { icon: Trophy,    label: 'Winners',   path: '/admin/winners' },
]

function SidebarContent({ onClose }) {
  const { pathname } = useLocation()
  const { user } = useAuthStore()
  const items = user?.role === 'admin' ? adminMenu : userMenu

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 md:hidden border-b border-gray-100 dark:border-dark-700">
        <span className="font-bold text-gray-900 dark:text-white">Menu</span>
        <motion.button whileTap={{ scale: 0.95 }} onClick={onClose}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700">
          <X size={18} />
        </motion.button>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {items.map(({ icon: Icon, label, path }) => {
          const active = pathname === path
          return (
            <Link key={path} to={path} onClick={onClose}>
              <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  active
                    ? 'bg-navy-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-white'
                }`}>
                <Icon size={18} />
                <span className="font-medium text-sm">{label}</span>
              </motion.div>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useAppStore()
  const close = () => setSidebarOpen(false)

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:block w-60 bg-white dark:bg-dark-800 border-r border-gray-100 dark:border-dark-700 fixed left-0 top-16 h-[calc(100vh-64px)] z-30">
        <SidebarContent onClose={close} />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={close} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden" />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 h-full w-72 bg-white dark:bg-dark-800 z-50 md:hidden shadow-2xl">
              <SidebarContent onClose={close} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
