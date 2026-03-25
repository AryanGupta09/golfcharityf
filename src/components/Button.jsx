import { motion } from 'framer-motion'
import clsx from 'clsx'

const variants = {
  primary:   'bg-navy-600 text-white hover:bg-navy-700 shadow-sm',
  coral:     'bg-coral-500 text-white hover:bg-coral-600 shadow-sm shadow-coral-500/20',
  secondary: 'bg-gray-100 dark:bg-dark-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-dark-600',
  ghost:     'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700',
  danger:    'bg-red-500 text-white hover:bg-red-600',
  outline:   'border-2 border-navy-600 text-navy-600 dark:border-navy-400 dark:text-navy-400 hover:bg-navy-50 dark:hover:bg-navy-900/20',
}

const sizes = {
  sm: 'px-3 py-2 text-sm min-h-[36px]',
  md: 'px-5 py-2.5 text-sm min-h-[44px]',
  lg: 'px-7 py-3.5 text-base min-h-[52px]',
}

export default function Button({
  children, variant = 'primary', size = 'md',
  loading = false, disabled = false, className, ...props
}) {
  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={clsx(
        'inline-flex items-center justify-center font-semibold rounded-xl',
        'focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2',
        'transition-colors duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </span>
      ) : children}
    </motion.button>
  )
}
