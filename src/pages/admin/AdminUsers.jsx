import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trash2, UserX, ChevronLeft, ChevronRight } from 'lucide-react'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Loader from '../../components/Loader'
import { adminService } from '../../services/adminService'
import { userService } from '../../services/userService'
import toast from 'react-hot-toast'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => { fetchUsers() }, [page])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await adminService.getUserManagement(page, 10)
      setUsers(res.data || [])
      setTotalPages(res.pages || 1)
    } catch { toast.error('Failed to load users') }
    finally { setLoading(false) }
  }

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, newRole)
      toast.success('Role updated')
      fetchUsers()
    } catch { toast.error('Failed to update role') }
  }

  // Item 21: deactivate subscription only
  const handleDeactivate = async (userId) => {
    if (!window.confirm('Deactivate this user\'s subscription?')) return
    try {
      await adminService.deactivateUserSubscription(userId)
      toast.success('Subscription deactivated')
      fetchUsers()
    } catch { toast.error('Failed to deactivate') }
  }

  // Item 21: delete user — backend cancels subscription first
  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Delete user "${userName}"? This will also cancel their subscription.`)) return
    try {
      await userService.deleteUser(userId)
      toast.success('User deleted')
      fetchUsers()
    } catch { toast.error('Failed to delete user') }
  }

  if (loading) return <Loader />

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Users</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">View, manage roles, and delete users</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-dark-700">
                {['Name', 'Email', 'Role', 'Subscription', 'Actions'].map(h => (
                  <th key={h} className="text-left py-4 px-5 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-gray-400">No users found</td></tr>
              ) : users.map((u, i) => (
                <motion.tr key={u._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-gray-50 dark:border-dark-800 hover:bg-gray-50 dark:hover:bg-dark-700/50">
                  <td className="py-3.5 px-5 font-medium text-gray-900 dark:text-white">{u.name}</td>
                  <td className="py-3.5 px-5 text-gray-500 dark:text-gray-400">{u.email}</td>
                  <td className="py-3.5 px-5">
                    {/* Item 19/20: role change — admin can do this, user cannot (protected by backend) */}
                    <select value={u.role} onChange={e => handleRoleChange(u._id, e.target.value)}
                      className="px-2 py-1 min-h-[36px] bg-gray-100 dark:bg-dark-600 rounded-lg text-sm font-medium text-gray-900 dark:text-white border-0 focus:ring-2 focus:ring-navy-500">
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      u.subscriptionStatus === 'active'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-dark-600 text-gray-500 dark:text-gray-400'
                    }`}>
                      {u.subscriptionStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2">
                      {u.subscriptionStatus === 'active' && (
                        <Button size="sm" variant="secondary" onClick={() => handleDeactivate(u._id)}
                          className="flex items-center gap-1 text-xs">
                          <UserX size={13} /> Deactivate
                        </Button>
                      )}
                      {/* Item 21: delete user with subscription cancellation */}
                      <Button size="sm" variant="danger" onClick={() => handleDelete(u._id, u.name)}
                        className="flex items-center gap-1">
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 dark:border-dark-700">
              <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1} className="flex items-center gap-1">
                  <ChevronLeft size={14} /> Prev
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages} className="flex items-center gap-1">
                  Next <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
