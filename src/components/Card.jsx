import { motion } from 'framer-motion'
import clsx from 'clsx'

export default function Card({ children, className, glass = false, hover = false, ...props }) {
  const base = glass
    ? 'backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6'
    : 'bg-white dark:bg-dark-800 rounded-2xl shadow-card border border-gray-100 dark:border-dark-700 p-6'

  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(0,0,0,0.12)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className={clsx(base, className)}
        {...props}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={clsx(base, className)} {...props}>
      {children}
    </div>
  )
}
