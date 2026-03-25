import { motion } from 'framer-motion'

export default function Loader({ fullScreen = false }) {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        className="w-10 h-10 border-3 border-gray-200 dark:border-dark-700 border-t-navy-600 rounded-full"
        style={{ borderWidth: 3 }}
      />
      <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">Loading...</p>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-dark-950/80 backdrop-blur-sm z-50">
        {spinner}
      </div>
    )
  }

  return <div className="flex items-center justify-center py-16">{spinner}</div>
}
