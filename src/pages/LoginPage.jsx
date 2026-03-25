import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Mail, Lock } from 'lucide-react'
import Button from '../components/Button'
import Input from '../components/Input'
import { useAuthStore } from '../store/authStore'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authService.login(form.email, form.password)
      setAuth(res.user, res.token)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-ivory-50 dark:bg-dark-950">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="w-full max-w-md">

        {/* Logo mark */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-navy-600 to-coral-500 rounded-2xl mb-4">
            <Heart size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to continue your impact</p>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-card border border-gray-100 dark:border-dark-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Email" type="email" value={form.email} required
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              placeholder="you@example.com" />
            <Input label="Password" type="password" value={form.password} required
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              placeholder="••••••••" />
            <Button type="submit" loading={loading} variant="coral" className="w-full mt-2">
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-navy-600 dark:text-navy-400 hover:underline">
              Sign up free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
