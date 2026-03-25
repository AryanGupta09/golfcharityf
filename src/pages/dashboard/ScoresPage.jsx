import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Pencil } from 'lucide-react'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Modal from '../../components/Modal'
import Loader from '../../components/Loader'
import { scoreService } from '../../services/scoreService'
import toast from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'

const emptyForm = { score: '', date: new Date().toISOString().split('T')[0], courseInfo: '' }

export default function ScoresPage() {
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingScore, setEditingScore] = useState(null) // null = add mode, object = edit mode
  const [formData, setFormData] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { fetchScores() }, [])

  const fetchScores = async () => {
    try {
      setLoading(true)
      const res = await scoreService.getUserScores()
      setScores(res.data || [])
    } catch { toast.error('Failed to load scores') }
    finally { setLoading(false) }
  }

  const openAdd = () => {
    setEditingScore(null)
    setFormData(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (score) => {
    setEditingScore(score)
    setFormData({
      score: score.score,
      date: new Date(score.date).toISOString().split('T')[0],
      courseInfo: score.courseInfo || ''
    })
    setModalOpen(true)
  }

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const s = parseInt(formData.score)
    if (!s || s < 1 || s > 45) return toast.error('Score must be between 1 and 45')

    setSubmitting(true)
    try {
      if (editingScore) {
        await scoreService.editScore(editingScore._id, { score: s, date: formData.date, courseInfo: formData.courseInfo })
        toast.success('Score updated!')
      } else {
        await scoreService.addScore(s, formData.date, formData.courseInfo)
        toast.success('Score added!')
      }
      setModalOpen(false)
      fetchScores()
    } catch (err) {
      // Items 5 & 6: subscription required error
      if (err.response?.status === 403 && err.response?.data?.code === 'SUBSCRIPTION_REQUIRED') {
        toast.error(err.response.data.message, { duration: 5000 })
        setModalOpen(false)
      } else {
        toast.error(err.response?.data?.message || err.response?.data?.errors?.[0] || 'Failed to save score')
      }
    } finally { setSubmitting(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this score?')) return
    try {
      await scoreService.deleteScore(id)
      toast.success('Score deleted')
      fetchScores()
    } catch { toast.error('Failed to delete score') }
  }

  if (loading) return <Loader />

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Golf Scores</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Last 5 scores tracked (oldest auto-removed)</p>
        </div>
        <Button onClick={openAdd} className="flex items-center gap-2">
          <Plus size={18} /> Add Score
        </Button>
      </motion.div>

      {/* Scores */}
      <div className="grid gap-4">
        {scores.length > 0 ? scores.map((score, i) => (
          <motion.div key={score._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">{score.score}</div>
                  <p className="text-xs text-gray-400 mt-1">Score</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{score.courseInfo || 'No course'}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(score.date), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(score)}
                  className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                  <Pencil size={18} />
                </button>
                <button onClick={() => handleDelete(score._id)}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </Card>
          </motion.div>
        )) : (
          <Card className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No scores yet. Add your first score!</p>
          </Card>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}
        title={editingScore ? 'Edit Score' : 'Add New Score'} size="md">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Score (1–45)" type="number" name="score"
            value={formData.score} onChange={handleChange} min="1" max="45" required />
          <Input label="Date" type="date" name="date"
            value={formData.date} onChange={handleChange} required />
          <Input label="Course (optional)" type="text" name="courseInfo"
            value={formData.courseInfo} onChange={handleChange} placeholder="e.g. Pebble Beach" />
          <div className="flex gap-3">
            <Button type="submit" loading={submitting} className="flex-1">
              {editingScore ? 'Update Score' : 'Add Score'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
