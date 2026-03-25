import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, X, CreditCard } from 'lucide-react'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import Input from '../../components/Input'
import Loader from '../../components/Loader'
import { adminService } from '../../services/adminService'
import { winnerService } from '../../services/winnerService'
import toast from 'react-hot-toast'

export default function AdminWinners() {
  const [winners, setWinners] = useState([])
  const [loading, setLoading] = useState(true)
  const [rejectModal, setRejectModal] = useState(false)
  const [payModal, setPayModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [transactionId, setTransactionId] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => { fetchWinners() }, [])

  const fetchWinners = async () => {
    try {
      setLoading(true)
      const res = await adminService.getWinnerVerificationQueue(1, 50)
      setWinners(res.data || [])
    } catch { toast.error('Failed to load winners') }
    finally { setLoading(false) }
  }

  const handleApprove = async (winnerId) => {
    setProcessing(true)
    try {
      await winnerService.verifyWinner(winnerId, true)
      toast.success('Winner approved')
      fetchWinners()
    } catch { toast.error('Failed to approve') }
    finally { setProcessing(false) }
  }

  const handleReject = async (e) => {
    e.preventDefault()
    if (!rejectionReason.trim()) return toast.error('Please enter a reason')
    setProcessing(true)
    try {
      await winnerService.verifyWinner(selected._id, false, rejectionReason)
      toast.success('Winner rejected')
      setRejectModal(false)
      setRejectionReason('')
      fetchWinners()
    } catch { toast.error('Failed to reject') }
    finally { setProcessing(false) }
  }

  const handlePayment = async (e) => {
    e.preventDefault()
    if (!transactionId.trim()) return toast.error('Please enter transaction ID')
    setProcessing(true)
    try {
      await winnerService.processPayment(selected._id, transactionId)
      toast.success('Payment processed')
      setPayModal(false)
      setTransactionId('')
      fetchWinners()
    } catch { toast.error('Failed to process payment') }
    finally { setProcessing(false) }
  }

  if (loading) return <Loader />

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Verify Winners</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Review winner claims and process payments</p>
      </motion.div>

      <div className="space-y-3">
        {winners.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No pending verifications</p>
          </Card>
        ) : winners.map((w, i) => (
          <motion.div key={w._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-navy-50 dark:bg-navy-900/20 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-xl font-black text-navy-600 dark:text-navy-400">{w.matchCount}</span>
                    <span className="text-xs text-gray-400">match</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{w.user?.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{w.user?.email}</p>
                    <p className="text-sm font-semibold text-coral-600 dark:text-coral-400">${w.prizeAmount?.toFixed(2)}</p>
                  </div>
                  {w.proofImageUrl && (
                    <a href={w.proofImageUrl} target="_blank" rel="noreferrer"
                      className="text-sm text-navy-600 dark:text-navy-400 hover:underline">
                      View Proof
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {w.verificationStatus === 'pending' && (
                    <>
                      <Button size="sm" loading={processing} onClick={() => handleApprove(w._id)}
                        className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white">
                        <Check size={14} /> Approve
                      </Button>
                      <Button size="sm" variant="danger"
                        onClick={() => { setSelected(w); setRejectModal(true) }}
                        className="flex items-center gap-1.5">
                        <X size={14} /> Reject
                      </Button>
                    </>
                  )}
                  {w.verificationStatus === 'approved' && w.paymentStatus === 'pending' && (
                    <Button size="sm" onClick={() => { setSelected(w); setPayModal(true) }}
                      className="flex items-center gap-1.5 bg-navy-600 hover:bg-navy-700 text-white">
                      <CreditCard size={14} /> Process Payment
                    </Button>
                  )}
                  {w.paymentStatus === 'paid' && (
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                      ✓ Paid
                    </span>
                  )}
                  {w.verificationStatus === 'rejected' && (
                    <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-semibold rounded-full">
                      Rejected
                    </span>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Reject Modal */}
      <Modal isOpen={rejectModal} onClose={() => setRejectModal(false)} title="Reject Winner" size="sm">
        <form onSubmit={handleReject} className="space-y-4">
          <Input label="Rejection Reason" value={rejectionReason} required
            onChange={e => setRejectionReason(e.target.value)}
            placeholder="Why are you rejecting this claim?" />
          <div className="flex gap-3">
            <Button type="submit" loading={processing} variant="danger" className="flex-1">Reject</Button>
            <Button type="button" variant="secondary" onClick={() => setRejectModal(false)} className="flex-1">Cancel</Button>
          </div>
        </form>
      </Modal>

      {/* Payment Modal */}
      <Modal isOpen={payModal} onClose={() => setPayModal(false)} title="Process Payment" size="sm">
        <form onSubmit={handlePayment} className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Processing payment of <strong className="text-gray-900 dark:text-white">${selected?.prizeAmount?.toFixed(2)}</strong> to <strong className="text-gray-900 dark:text-white">{selected?.user?.name}</strong>
          </p>
          <Input label="Transaction ID" value={transactionId} required
            onChange={e => setTransactionId(e.target.value)}
            placeholder="e.g. TXN123456789" />
          <div className="flex gap-3">
            <Button type="submit" loading={processing} className="flex-1">Confirm Payment</Button>
            <Button type="button" variant="secondary" onClick={() => setPayModal(false)} className="flex-1">Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
