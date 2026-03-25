import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Star, CalendarPlus } from 'lucide-react'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Modal from '../../components/Modal'
import Loader from '../../components/Loader'
import { charityService } from '../../services/charityService'
import toast from 'react-hot-toast'

const emptyCharity = { name: '', description: '', website: '' }
const emptyEvent = { title: '', description: '', date: '', location: '' }

export default function AdminCharities() {
  const [charities, setCharities] = useState([])
  const [loading, setLoading] = useState(true)
  const [charityModal, setCharityModal] = useState(false)
  const [eventModal, setEventModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [selectedCharity, setSelectedCharity] = useState(null)
  const [charityForm, setCharityForm] = useState(emptyCharity)
  const [eventForm, setEventForm] = useState(emptyEvent)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchCharities() }, [])

  const fetchCharities = async () => {
    try {
      setLoading(true)
      const res = await charityService.getAllCharities(1, 100)
      setCharities(res.data || [])
    } catch { toast.error('Failed to load charities') }
    finally { setLoading(false) }
  }

  const openAdd = () => { setEditing(null); setCharityForm(emptyCharity); setCharityModal(true) }
  const openEdit = (c) => { setEditing(c); setCharityForm({ name: c.name, description: c.description, website: c.website || '' }); setCharityModal(true) }
  const openAddEvent = (c) => { setSelectedCharity(c); setEventForm(emptyEvent); setEventModal(true) }

  const handleSaveCharity = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        await charityService.updateCharity(editing._id, charityForm)
        toast.success('Charity updated!')
      } else {
        await charityService.createCharity(charityForm)
        toast.success('Charity created!')
      }
      setCharityModal(false)
      fetchCharities()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save charity')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this charity?')) return
    try {
      await charityService.deleteCharity(id)
      toast.success('Charity deleted')
      fetchCharities()
    } catch { toast.error('Failed to delete') }
  }

  const handleSetFeatured = async (id) => {
    try {
      await charityService.setFeatured(id)
      toast.success('Featured charity updated!')
      fetchCharities()
    } catch { toast.error('Failed to set featured') }
  }

  const handleAddEvent = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await charityService.addEvent(selectedCharity._id, eventForm)
      toast.success('Event added!')
      setEventModal(false)
      fetchCharities()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add event')
    } finally { setSaving(false) }
  }

  const handleDeleteEvent = async (charityId, eventId) => {
    try {
      await charityService.deleteEvent(charityId, eventId)
      toast.success('Event deleted')
      fetchCharities()
    } catch { toast.error('Failed to delete event') }
  }

  if (loading) return <Loader />

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Charities</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Create, edit, feature charities and manage events</p>
        </div>
        <Button onClick={openAdd} className="flex items-center gap-2"><Plus size={18} /> Add Charity</Button>
      </motion.div>

      <div className="space-y-4">
        {charities.map((charity, i) => (
          <motion.div key={charity._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{charity.name}</h3>
                    {charity.isFeatured && (
                      <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Star size={10} /> Featured
                      </span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${charity.isActive ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                      {charity.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{charity.description}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Total Donations: <span className="font-semibold">${charity.totalDonations}</span>
                  </p>

                  {/* Events */}
                  {charity.events?.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">UPCOMING EVENTS</p>
                      <div className="space-y-1">
                        {charity.events.map(ev => (
                          <div key={ev._id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-dark-700 rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{ev.title}</p>
                              <p className="text-xs text-gray-400">{new Date(ev.date).toLocaleDateString()} {ev.location && `· ${ev.location}`}</p>
                            </div>
                            <button onClick={() => handleDeleteEvent(charity._id, ev._id)}
                              className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Button size="sm" onClick={() => openEdit(charity)} variant="secondary" className="flex items-center gap-1">
                    <Pencil size={14} /> Edit
                  </Button>
                  <Button size="sm" onClick={() => handleSetFeatured(charity._id)}
                    className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white">
                    <Star size={14} /> Feature
                  </Button>
                  <Button size="sm" onClick={() => openAddEvent(charity)} variant="secondary"
                    className="flex items-center gap-1">
                    <CalendarPlus size={14} /> Add Event
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(charity._id)}
                    className="flex items-center gap-1">
                    <Trash2 size={14} /> Delete
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charity Modal */}
      <Modal isOpen={charityModal} onClose={() => setCharityModal(false)}
        title={editing ? 'Edit Charity' : 'Add Charity'} size="md">
        <form onSubmit={handleSaveCharity} className="space-y-4">
          <Input label="Name" name="name" value={charityForm.name}
            onChange={e => setCharityForm(p => ({ ...p, name: e.target.value }))} required />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea name="description" value={charityForm.description} required
              onChange={e => setCharityForm(p => ({ ...p, description: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={3} />
          </div>
          <Input label="Website (optional)" name="website" value={charityForm.website}
            onChange={e => setCharityForm(p => ({ ...p, website: e.target.value }))} />
          <div className="flex gap-3">
            <Button type="submit" loading={saving} className="flex-1">{editing ? 'Update' : 'Create'}</Button>
            <Button type="button" variant="secondary" onClick={() => setCharityModal(false)} className="flex-1">Cancel</Button>
          </div>
        </form>
      </Modal>

      {/* Event Modal */}
      <Modal isOpen={eventModal} onClose={() => setEventModal(false)}
        title={`Add Event — ${selectedCharity?.name}`} size="md">
        <form onSubmit={handleAddEvent} className="space-y-4">
          <Input label="Event Title" value={eventForm.title} required
            onChange={e => setEventForm(p => ({ ...p, title: e.target.value }))} />
          <Input label="Date" type="date" value={eventForm.date} required
            onChange={e => setEventForm(p => ({ ...p, date: e.target.value }))} />
          <Input label="Location (optional)" value={eventForm.location}
            onChange={e => setEventForm(p => ({ ...p, location: e.target.value }))} />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (optional)</label>
            <textarea value={eventForm.description}
              onChange={e => setEventForm(p => ({ ...p, description: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={2} />
          </div>
          <div className="flex gap-3">
            <Button type="submit" loading={saving} className="flex-1">Add Event</Button>
            <Button type="button" variant="secondary" onClick={() => setEventModal(false)} className="flex-1">Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
