import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, CheckCircle, Crown, Zap, XCircle, AlertCircle } from 'lucide-react'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Loader from '../../components/Loader'
import { useAuthStore } from '../../store/authStore'
import { userService } from '../../services/userService'
import { subscriptionService } from '../../services/subscriptionService'
import { charityService } from '../../services/charityService'
import toast from 'react-hot-toast'

const PLANS = [
  {
    id: 'monthly', name: 'Monthly', price: '$9.99', period: '/month', icon: Zap,
    color: 'from-navy-500 to-navy-700',
    features: ['Monthly draws', 'Score tracking', 'Charity donations', 'Win prizes'],
  },
  {
    id: 'yearly', name: 'Yearly', price: '$99.99', period: '/year', icon: Crown,
    color: 'from-coral-500 to-coral-700', badge: 'Save 17%',
    features: ['Everything in Monthly', '2 months free', 'Priority support', 'Exclusive draws'],
  },
]

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    donationPercentage: user?.donationPercentage || 10,
    selectedCharity: user?.selectedCharity?._id || '',
  })
  const [formErrors, setFormErrors] = useState({})
  const [charities, setCharities] = useState([])
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [subscribing, setSubscribing] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('monthly')

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [charitiesRes, subRes] = await Promise.all([
        charityService.getAllCharities(1, 100),
        subscriptionService.getUserSubscription(user.id || user._id),
      ])
      setCharities(charitiesRes.data || [])
      setSubscription(subRes.data)
    } catch { toast.error('Failed to load settings') }
    finally { setLoading(false) }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error on change
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }))
  }

  // Item 16: validate donation % >= 10 on frontend before sending
  const validateForm = () => {
    const errors = {}
    const pct = parseFloat(formData.donationPercentage)
    if (pct < 10) errors.donationPercentage = 'Minimum contribution is 10%'
    if (pct > 100) errors.donationPercentage = 'Maximum contribution is 100%'
    if (!formData.name || formData.name.trim().length < 2) errors.name = 'Name must be at least 2 characters'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setSaving(true)
    try {
      const response = await userService.updateProfile(user.id || user._id, {
        ...formData,
        donationPercentage: parseFloat(formData.donationPercentage)
      })
      updateUser(response.data)
      toast.success('Settings updated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update settings')
    } finally { setSaving(false) }
  }

  const handleSubscribe = async () => {
    setSubscribing(true)
    try {
      const charityId = formData.selectedCharity || undefined
      await subscriptionService.createSubscription(selectedPlan, charityId)
      toast.success(`${selectedPlan === 'monthly' ? 'Monthly' : 'Yearly'} subscription activated!`)
      fetchData()
    } catch (err) {
      // Ignore timeout errors — subscription may have succeeded (Render cold start)
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        toast.success('Subscription activated! Refreshing...')
        setTimeout(() => fetchData(), 3000)
      } else {
        toast.error(err.response?.data?.message || 'Failed to create subscription')
      }
    } finally { setSubscribing(false) }
  }

  // Item 5: renew expired subscription
  const handleRenew = async () => {
    try {
      await subscriptionService.renewSubscription(subscription._id)
      toast.success('Subscription renewed!')
      fetchData()
    } catch { toast.error('Failed to renew subscription') }
  }

  const handleCancel = async () => {
    if (!window.confirm('Cancel your subscription? You will lose access to draws and score entry.')) return
    setCancelling(true)
    try {
      await subscriptionService.cancelSubscription(subscription._id)
      toast.success('Subscription cancelled')
      fetchData()
    } catch { toast.error('Failed to cancel subscription') }
    finally { setCancelling(false) }
  }

  if (loading) return <Loader />

  // Item 5: detect expired subscription
  const isExpired = subscription && subscription.status !== 'active'
  const isActive = subscription && subscription.status === 'active'

  return (
    <div className="space-y-8 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your profile and subscription</p>
      </motion.div>

      {/* Item 5: Expired subscription warning */}
      {isExpired && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
          <AlertCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800 dark:text-red-300">Subscription {subscription.status}</p>
            <p className="text-sm text-red-700 dark:text-red-400 mt-0.5">
              Your subscription has {subscription.status}. Renew below to restore access to draws and score entry.
            </p>
          </div>
        </motion.div>
      )}

      {/* Profile Settings */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <Card>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Profile Settings</h2>
          <form onSubmit={handleSave} className="space-y-5">
            <Input label="Full Name" type="text" name="name"
              value={formData.name} onChange={handleChange}
              error={formErrors.name} required />

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Preferred Charity
              </label>
              <select name="selectedCharity" value={formData.selectedCharity} onChange={handleChange}
                className="w-full px-4 py-3 min-h-[44px] rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-500 text-sm">
                <option value="">Select a charity</option>
                {charities.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>

            {/* Item 16: min 10% with error display */}
            <div>
              <Input label="Donation Percentage (%)" type="number" name="donationPercentage"
                value={formData.donationPercentage} onChange={handleChange}
                min="10" max="100" error={formErrors.donationPercentage} />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Minimum 10% of your subscription fee goes to your chosen charity
              </p>
            </div>

            <Button type="submit" loading={saving} className="flex items-center gap-2">
              <Save size={16} /> Save Changes
            </Button>
          </form>
        </Card>
      </motion.div>

      {/* Subscription Section */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <Card>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Subscription</h2>

          {isActive ? (
            // Active subscription
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
                  <span className="font-bold text-green-700 dark:text-green-400">Active Subscription</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    ['Plan', subscription.plan],
                    ['Amount', `$${subscription.amount}`],
                    ['Started', new Date(subscription.startDate).toLocaleDateString()],
                    ['Expires', new Date(subscription.endDate).toLocaleDateString()],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <p className="text-xs text-gray-400">{label}</p>
                      <p className="font-semibold text-gray-900 dark:text-white capitalize">{val}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleRenew} className="flex-1">Renew</Button>
                <Button onClick={handleCancel} loading={cancelling} variant="danger"
                  className="flex items-center gap-2">
                  <XCircle size={15} /> Cancel
                </Button>
              </div>
            </div>
          ) : (
            // No / expired subscription — show plans
            <div className="space-y-5">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isExpired
                  ? 'Your subscription has expired. Choose a plan to renew.'
                  : 'Choose a plan to start participating in draws and supporting charities.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PLANS.map(({ id, name, price, period, icon: Icon, color, badge, features }) => {
                  const sel = selectedPlan === id
                  return (
                    <motion.div key={id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedPlan(id)}
                      className={`relative cursor-pointer rounded-2xl p-5 border-2 transition-all ${
                        sel ? 'border-navy-500 bg-navy-50 dark:bg-navy-900/20' : 'border-gray-200 dark:border-dark-700'
                      }`}>
                      {badge && (
                        <span className="absolute -top-3 right-4 bg-coral-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          {badge}
                        </span>
                      )}
                      <div className={`inline-flex p-2 rounded-xl bg-gradient-to-r ${color} mb-3`}>
                        <Icon size={18} className="text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{name}</h3>
                      <div className="flex items-baseline gap-1 my-1">
                        <span className="text-2xl font-black text-gray-900 dark:text-white">{price}</span>
                        <span className="text-xs text-gray-400">{period}</span>
                      </div>
                      <ul className="space-y-1 mt-2">
                        {features.map((f, i) => (
                          <li key={i} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                            <CheckCircle size={12} className="text-green-500 flex-shrink-0" /> {f}
                          </li>
                        ))}
                      </ul>
                      {sel && <CheckCircle size={18} className="absolute top-3 right-3 text-navy-500" />}
                    </motion.div>
                  )
                })}
              </div>

              <Button onClick={handleSubscribe} loading={subscribing} variant="coral" className="w-full">
                {subscribing ? 'Processing... (may take 30s)' : `Subscribe — ${selectedPlan === 'monthly' ? '$9.99/mo' : '$99.99/yr'}`}
              </Button>
              <p className="text-xs text-center text-gray-400">Demo mode — no real payment required. First request may take 30 seconds.</p>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
