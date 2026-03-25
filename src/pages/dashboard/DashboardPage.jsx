import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Heart, Trophy, Calendar, Target, Clock, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import StatCard from '../../components/StatCard'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Loader from '../../components/Loader'
import { useAuthStore } from '../../store/authStore'
import { userService } from '../../services/userService'
import { subscriptionService } from '../../services/subscriptionService'
import { drawService } from '../../services/drawService'
import toast from 'react-hot-toast'
import { formatDistanceToNow, format } from 'date-fns'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState(null)
  const [subscription, setSubscription] = useState(null)
  const [latestDraw, setLatestDraw] = useState(null)
  const [nextDrawDate, setNextDrawDate] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const userId = user.id || user._id
      const [statsRes, subRes, drawRes, nextRes] = await Promise.all([
        userService.getUserStats(userId),
        subscriptionService.getUserSubscription(userId),
        drawService.getLatestDraw(),
        drawService.getNextDrawDate(),
      ])
      setStats(statsRes.data)
      setSubscription(subRes.data)
      setLatestDraw(drawRes.data)
      setNextDrawDate(nextRes.data?.nextDrawDate)
    } catch (error) {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loader />

  const charityName = user?.selectedCharity?.name || stats?.user?.selectedCharity?.name || null

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-gradient-to-r from-primary-500 to-accent-500 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">Welcome back, {user?.name}!</h1>
              <p className="text-white/90">
                {subscription?.status === 'active'
                  ? `Subscription active until ${new Date(subscription.endDate).toLocaleDateString()}`
                  : 'No active subscription — subscribe to join draws'}
              </p>
              {charityName && (
                <p className="text-white/80 text-sm mt-1">
                  ❤️ Supporting: <span className="font-semibold">{charityName}</span>
                  {user?.donationPercentage ? ` (${user.donationPercentage}% donation)` : ''}
                </p>
              )}
            </div>
            {subscription?.status === 'active' && (
              <div className="text-right">
                <div className="text-4xl font-bold">{stats?.wins?.count || 0}</div>
                <div className="text-white/90 text-sm">Total Wins</div>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Items 5 & 6: Subscription warning banner */}
      {!subscription && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl">
          <AlertCircle size={20} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-amber-800 dark:text-amber-300">No active subscription</p>
            <p className="text-sm text-amber-700 dark:text-amber-400 mt-0.5">
              Subscribe to add scores, enter draws, and support charities.
            </p>
          </div>
          <Link to="/dashboard/settings">
            <Button variant="coral" size="sm">Subscribe Now</Button>
          </Link>
        </motion.div>
      )}

      {/* Stats Grid */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={TrendingUp} label="Scores Recorded" value={stats?.scores?.length || 0} change="Last 5 scores" />
        <StatCard icon={Trophy} label="Total Winnings" value={`$${stats?.wins?.totalWinnings || 0}`} change="All time" />
        <StatCard icon={Heart} label="Total Donated" value={`$${user?.totalDonated || 0}`} change="To charities" />
        <StatCard icon={Target} label="Draws Entered" value={user?.totalDrawsEntered || 0} change="All time" />
        <StatCard icon={Calendar} label="Subscription" value={subscription?.status === 'active' ? 'Active' : 'Inactive'} change={subscription?.plan || 'N/A'} />
        <StatCard icon={Clock} label="Next Draw"
          value={nextDrawDate ? format(new Date(nextDrawDate), 'MMM d') : '—'}
          change={nextDrawDate ? format(new Date(nextDrawDate), 'yyyy') : 'TBD'} />
      </motion.div>

      {/* Recent Scores + Latest Draw */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="grid md:grid-cols-2 gap-6">

        {/* Recent Scores */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Scores</h2>
          <div className="space-y-3">
            {stats?.scores?.length > 0 ? stats.scores.slice(0, 5).map((score, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <div>
                  <p className="font-bold text-2xl text-primary-600 dark:text-primary-400">{score.score}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(score.date), { addSuffix: true })}
                  </p>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{score.courseInfo || '—'}</span>
              </div>
            )) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-6">No scores yet. Add your first score!</p>
            )}
          </div>
        </Card>

        {/* Latest Draw */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Latest Draw</h2>
          {latestDraw ? (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-xl">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Winning Numbers</p>
                <div className="flex gap-2 flex-wrap">
                  {(latestDraw.winningNumbers || [latestDraw.winningNumber]).map((n, i) => (
                    <span key={i} className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-600 text-white font-bold text-sm">
                      {n}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: '5 Match', val: latestDraw.distribution?.fiveMatch?.winners?.length || 0, color: 'text-yellow-600' },
                  { label: '4 Match', val: latestDraw.distribution?.fourMatch?.winners?.length || 0, color: 'text-blue-600' },
                  { label: '3 Match', val: latestDraw.distribution?.threeMatch?.winners?.length || 0, color: 'text-green-600' },
                ].map(({ label, val, color }) => (
                  <div key={label} className="p-3 bg-gray-50 dark:bg-dark-700 rounded-lg text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                    <p className={`text-2xl font-bold ${color}`}>{val}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 text-center">
                Prize Pool: <span className="font-semibold text-gray-700 dark:text-gray-300">${latestDraw.prizePool}</span>
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No draws yet</p>
              {nextDrawDate && (
                <p className="text-sm text-primary-600 dark:text-primary-400 mt-2">
                  Next draw: {format(new Date(nextDrawDate), 'MMMM d, yyyy')}
                </p>
              )}
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
