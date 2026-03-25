import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Star, Calendar, ExternalLink, DollarSign } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import Modal from '../components/Modal'
import Loader from '../components/Loader'
import { charityService } from '../services/charityService'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

export default function CharitiesPage() {
  const { isAuthenticated } = useAuthStore()
  const [charities, setCharities] = useState([])
  const [featured, setFeatured] = useState(null)
  const [loading, setLoading] = useState(true)
  const [donateModal, setDonateModal] = useState(false)
  const [selectedCharity, setSelectedCharity] = useState(null)
  const [donateAmount, setDonateAmount] = useState('')
  const [donateMsg, setDonateMsg] = useState('')
  const [donating, setDonating] = useState(false)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [allRes, featuredRes] = await Promise.all([
        charityService.getAllCharities(1, 50),
        charityService.getFeaturedCharity()
      ])
      setCharities(allRes.data || [])
      setFeatured(featuredRes.data)
    } catch { toast.error('Failed to load charities') }
    finally { setLoading(false) }
  }

  const openDonate = (charity) => {
    if (!isAuthenticated) return toast.error('Please login to donate')
    setSelectedCharity(charity)
    setDonateAmount('')
    setDonateMsg('')
    setDonateModal(true)
  }

  const handleDonate = async (e) => {
    e.preventDefault()
    const amount = parseFloat(donateAmount)
    if (!amount || amount < 1) return toast.error('Minimum donation is $1')
    setDonating(true)
    try {
      await charityService.makeDonation(selectedCharity._id, amount, donateMsg)
      toast.success(`$${amount} donated to ${selectedCharity.name}!`)
      setDonateModal(false)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Donation failed')
    } finally { setDonating(false) }
  }

  if (loading) return <Loader />

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 max-w-6xl mx-auto">

      {/* Featured Charity Spotlight */}
      {featured && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Star size={20} className="text-yellow-500" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wide">Spotlight Charity</h2>
          </div>
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary-600 to-accent-600 p-8 text-white">
            <div className="absolute top-4 right-4">
              <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Star size={12} /> Featured
              </span>
            </div>
            <h3 className="text-3xl font-bold mb-3">{featured.name}</h3>
            <p className="text-white/90 mb-4 max-w-2xl">{featured.description}</p>
            <div className="flex items-center gap-6 mb-6">
              <div>
                <p className="text-white/70 text-sm">Total Raised</p>
                <p className="text-2xl font-bold">${featured.totalDonations}</p>
              </div>
              {featured.website && (
                <a href={featured.website} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1 text-white/80 hover:text-white text-sm underline">
                  <ExternalLink size={14} /> Visit Website
                </a>
              )}
            </div>
            <Button onClick={() => openDonate(featured)}
              className="bg-white text-primary-700 hover:bg-white/90 flex items-center gap-2">
              <Heart size={16} /> Donate Now
            </Button>
          </div>
        </motion.div>
      )}

      {/* All Charities */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">All Charities</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {charities.map((charity, i) => (
            <motion.div key={charity._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="h-full flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{charity.name}</h3>
                  {charity.isFeatured && <Star size={16} className="text-yellow-500 flex-shrink-0" />}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex-1 mb-4">{charity.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-400">Total Raised</p>
                    <p className="font-bold text-gray-900 dark:text-white">${charity.totalDonations}</p>
                  </div>
                  {charity.website && (
                    <a href={charity.website} target="_blank" rel="noreferrer"
                      className="text-primary-600 dark:text-primary-400 hover:underline text-sm flex items-center gap-1">
                      <ExternalLink size={12} /> Website
                    </a>
                  )}
                </div>

                {/* Upcoming Events */}
                {charity.events?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Upcoming Events</p>
                    {charity.events.slice(0, 2).map(ev => (
                      <div key={ev._id} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <Calendar size={12} className="text-primary-500 flex-shrink-0" />
                        <span>{ev.title} — {new Date(ev.date).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                )}

                <Button onClick={() => openDonate(charity)} variant="secondary"
                  className="w-full flex items-center justify-center gap-2 mt-auto">
                  <DollarSign size={16} /> Donate
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Donate Modal */}
      <Modal isOpen={donateModal} onClose={() => setDonateModal(false)}
        title={`Donate to ${selectedCharity?.name}`} size="sm">
        <form onSubmit={handleDonate} className="space-y-4">
          <Input label="Amount ($)" type="number" value={donateAmount} min="1" required
            onChange={e => setDonateAmount(e.target.value)} placeholder="e.g. 25" />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message (optional)</label>
            <textarea value={donateMsg} onChange={e => setDonateMsg(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={2} placeholder="Leave a message..." />
          </div>
          <div className="flex gap-3">
            <Button type="submit" loading={donating} className="flex-1">Donate ${donateAmount || '0'}</Button>
            <Button type="button" variant="secondary" onClick={() => setDonateModal(false)} className="flex-1">Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
