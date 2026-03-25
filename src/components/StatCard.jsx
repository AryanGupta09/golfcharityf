import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Card from './Card'

// Animated number counter
function CountUp({ value, duration = 1.2 }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  // Extract numeric part
  const prefix = typeof value === 'string' && value.startsWith('$') ? '$' : ''
  const raw = parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0
  const isText = isNaN(raw) || raw === 0

  useEffect(() => {
    if (!inView || isText) return
    let start = 0
    const steps = 40
    const increment = raw / steps
    const interval = (duration * 1000) / steps
    const timer = setInterval(() => {
      start += increment
      if (start >= raw) { setDisplay(raw); clearInterval(timer) }
      else setDisplay(Math.floor(start))
    }, interval)
    return () => clearInterval(timer)
  }, [inView, raw, duration, isText])

  return (
    <span ref={ref}>
      {isText ? value : `${prefix}${display.toLocaleString()}`}
    </span>
  )
}

export default function StatCard({ icon: Icon, label, value, change, color = 'navy' }) {
  const colorMap = {
    navy:  { bg: 'bg-navy-50 dark:bg-navy-900/20',  icon: 'text-navy-600 dark:text-navy-400' },
    coral: { bg: 'bg-coral-50 dark:bg-coral-900/20', icon: 'text-coral-600 dark:text-coral-400' },
    green: { bg: 'bg-green-50 dark:bg-green-900/20', icon: 'text-green-600 dark:text-green-400' },
    amber: { bg: 'bg-amber-50 dark:bg-amber-900/20', icon: 'text-amber-600 dark:text-amber-400' },
  }
  const c = colorMap[color] || colorMap.navy

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -3 }}
    >
      <Card className="h-full">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{label}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              <CountUp value={value} />
            </p>
            {change && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{change}</p>
            )}
          </div>
          {Icon && (
            <div className={`p-3 rounded-xl ${c.bg}`}>
              <Icon className={c.icon} size={22} />
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
