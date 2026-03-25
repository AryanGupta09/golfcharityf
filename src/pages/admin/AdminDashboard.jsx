import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, DollarSign, Heart, Trophy, Bell } from 'lucide-react'
import StatCard from '../../components/StatCard'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Loader from '../../components/Loader'
import { adminService } from '../../services/adminService'
import { drawService } from '../../services/drawService'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [runningDraw, setRunningDraw] = useState(false)
  const [triggeringReminder, setTriggeringReminder] = useState(false)

  useEffect(() => { fetchAnalytics() }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const res = await adminService.getAnalytics()
      setAnalytics(res.data)
    } catch { toast.error('Failed to load analytics') }
    finally { setLoading(false) }
  }

  const handleRunDraw = async () => {
    if (!window.confirm('Run the monthly draw? This cannot be undone.')) return
    setRunningDraw(true)
    try {
      await drawService.runDraw()
      toast.success('Draw completed!')
      fetchAnalytics()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to run draw')
    } finally { setRunningDraw(false) }
  }

  const handleTriggerReminder = async () => {
    setTriggeringReminder(true)
    try {
      const res = await api.post('/admin/trigger-renewal-reminder')
      toast.success(res.data.message)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to trigger reminder')
    } finally { setTriggeringReminder(false) }
  }

  if (loading) return <Loader />

  const { users = {}, draws = {}, charities = {}, subscriptionBreakdown = [] } = analytics || {}

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Platform analytics and controls</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleTriggerReminder} loading={triggeringReminder} variant="secondary"
            className="flex items-center gap-2">
            <Bell size={16} /> Send Renewal Reminders
          </Button>
          <Button onClick={handleRunDraw} loading={runningDraw} variant="coral">
            Run Monthly Draw
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Users" value={users.total || 0}
          change={`${users.activeSubscriptions || 0} active`} color="navy" />
        <StatCard icon={DollarSign} label="Prize Pool" value={`$${draws.totalPrizePool || 0}`}
          change={`${draws.total || 0} draws`} color="coral" />
        <StatCard icon={Heart} label="Total Donations" value={`$${charities.totalDonations || 0}`}
          change={`${charities.total || 0} charities`} color="green" />
        <StatCard icon={Trophy} label="Total Winners" value={draws.totalWinners || 0}
          change="All time" color="amber" />
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Charities */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <Card>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Top Charities</h2>
            <div className="space-y-3">
              {charities.topCharities?.length > 0
                ? charities.topCharities.map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{c.name}</p>
                      <p className="text-xs text-gray-400">{c.donors} donors</p>
                    </div>
                    <p className="font-bold text-navy-600 dark:text-navy-400">${c.donations}</p>
                  </div>
                ))
                : <p className="text-gray-400 text-sm text-center py-4">No charities yet</p>
              }
            </div>
          </Card>
        </motion.div>

        {/* Subscription Breakdown */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <Card>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Subscriptions</h2>
            <div className="space-y-3">
              {subscriptionBreakdown?.length > 0
                ? subscriptionBreakdown.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-xl">
                    <p className="font-medium text-gray-900 dark:text-white capitalize text-sm">{item._id} Plan</p>
                    <p className="text-2xl font-black text-navy-600 dark:text-navy-400">{item.count}</p>
                  </div>
                ))
                : <p className="text-gray-400 text-sm text-center py-4">No active subscriptions</p>
              }
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
