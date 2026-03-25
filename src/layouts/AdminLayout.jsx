import { motion } from 'framer-motion'
import { Menu } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { useAppStore } from '../store/appStore'

export default function AdminLayout({ children }) {
  const { setSidebarOpen } = useAppStore()

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-ivory-50 dark:bg-dark-950">
      <Sidebar />
      <main className="flex-1 md:ml-60 min-w-0">
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white dark:bg-dark-900 border-b border-gray-100 dark:border-dark-800 sticky top-16 z-20">
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setSidebarOpen(true)}
            className="p-2.5 rounded-xl bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 min-h-[44px] min-w-[44px] flex items-center justify-center">
            <Menu size={20} />
          </motion.button>
          <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Admin Panel</span>
        </div>
        <div className="p-4 sm:p-6 md:p-8 max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  )
}
