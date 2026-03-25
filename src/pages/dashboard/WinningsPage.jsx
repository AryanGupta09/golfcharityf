import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Upload, CheckCircle, XCircle, Clock } from 'lucide-react'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Modal from '../../components/Modal'
import Loader from '../../components/Loader'
import StatCard from '../../components/StatCard'
import { winnerService } from '../../services/winnerService'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

const statusConfig = {
  approved: { label: 'Approved', color: 'text-green-600 dark:text-green-400', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'text-red-600 dark:text-red-400', icon: XCircle },
  pending:  { label: 'Pending',  color: 'text-amber-600 dark:text-amber-400', icon: Clock },
}

export default function WinningsPage() {
  const { user } = useAuthStore()
  const [winnings, setWinnings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedWinner, setSelectedWinner] = useState(null)
  const [proofUrl, setProofUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { fetchWinnings() }, [])

  const fetchWinnings = async () => {
    try {
      setLoading(true)
      const res = await winnerService.getUserWins(user.id || user._id)
      setWinnings(res.data)
    } catch { toast.error('Failed to load winnings') }
    finally { setLoading(false) }
  }

  const handleUploadProof = async (e) => {
    e.preventDefault()
    if (!proofUrl) return toast.error('Please enter a proof image URL')
    setSubmitting(true)
    try {
      await winnerService.uploadProof(selectedWinner._id, proofUrl)
      toast.success('Proof uploaded!')
      setModalOpen(false)
      setProofUrl('')
      fetchWinnings()
    } catch { toast.error('Failed to upload proof') }
    finally { setSubmitting(false) }
  }

  if (loading) return <Loader />

  const { totalWins = 0, approvedWins = 0, totalWinnings = 0, wins = [] } = winnings || {}

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Winnings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Your prize history and claims</p>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4">
        <StatCard icon={Trophy} label="Total Wins" value={totalWins} color="navy" />
        <StatCard icon={CheckCircle} label="Approved" value={approvedWins} color="green" />
        <StatCard icon={Trophy} label="Total Earned" value={`$${totalWinnings}`} color="coral" />
      </motion.div>

      {/* Wins list */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="space-y-3">
        {wins.length > 0 ? wins.map((win, i) => {
          const status = statusConfig[win.verificationStatus] || statusConfig.pending
          const StatusIcon = status.icon
          return (
            <motion.div key={win._id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}>
              <Card>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-navy-50 dark:bg-navy-900/20 flex flex-col items-center justify-center">
                      <span className="text-xl font-black text-navy-600 dark:text-navy-400">{win.matchCount}</span>
                      <span className="text-xs text-gray-400">match</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">${win.prizeAmount?.toFixed(2)}</p>
                      <div className={`flex items-center gap-1 text-sm ${status.color}`}>
                        <StatusIcon size={13} />
                        <span>{status.label}</span>
                      </div>
                      {win.paymentStatus === 'paid' && (
                        <span className="text-xs text-green-600 dark:text-green-400">✓ Paid</span>
                      )}
                    </div>
                  </div>

                  {win.verificationStatus === 'pending' && !win.proofImageUrl && (
                    <Button size="sm" variant="secondary"
                      onClick={() => { setSelectedWinner(win); setModalOpen(true) }}
                      className="flex items-center gap-1.5 flex-shrink-0">
                      <Upload size={14} /> Upload Proof
                    </Button>
                  )}
                  {win.proofImageUrl && win.verificationStatus === 'pending' && (
                    <span className="text-xs text-amber-600 dark:text-amber-400 flex-shrink-0">Proof submitted — awaiting review</span>
                  )}
                  {win.verificationStatus === 'rejected' && win.rejectionReason && (
                    <span className="text-xs text-red-500 flex-shrink-0 max-w-[160px] text-right">{win.rejectionReason}</span>
                  )}
                </div>
              </Card>
            </motion.div>
          )
        }) : (
          <Card className="text-center py-16">
            <Trophy className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
            <p className="text-gray-500 dark:text-gray-400 font-medium">No wins yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Keep adding scores to enter monthly draws!</p>
          </Card>
        )}
      </motion.div>

      {/* Upload Proof Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Upload Proof of Win" size="sm">
        <form onSubmit={handleUploadProof} className="space-y-4">
          <Input label="Proof Image URL" type="url" value={proofUrl}
            onChange={e => setProofUrl(e.target.value)}
            placeholder="https://example.com/proof.jpg" required />
          <div className="flex gap-3">
            <Button type="submit" loading={submitting} className="flex-1">Upload</Button>
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
