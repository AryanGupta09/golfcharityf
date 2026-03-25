import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl' }

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  // Prevent body scroll when modal open (item 25)
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />

          {/* Item 25: scrollable on mobile — overflow-y-auto on the wrapper */}
          <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className={`w-full ${sizes[size]} my-4`}
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-white dark:bg-dark-800 rounded-2xl border border-gray-100 dark:border-dark-700 shadow-2xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={onClose}
                    className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-500 dark:text-gray-400 transition-colors">
                    <X size={18} />
                  </motion.button>
                </div>
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
