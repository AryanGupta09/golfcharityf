import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import Button from '../components/Button'
import Input from '../components/Input'
import { useAuthStore } from '../store/authStore'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match')
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      const res = await authService.signup(form.name, form.email, form.password)
      setAuth(res.user, res.token)
      toast.success('Account created!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed')
    } finally { setLoading(false) }
  }

  const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }))

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-ivory-50 dark:bg-dark-950">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-navy-600 to-coral-500 rounded-2xl mb-4">
            <Heart size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Join the community</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Play golf. Support charities. Win prizes.</p>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-card border border-gray-100 dark:border-dark-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Full Name" type="text" value={form.name} required
              onChange={set('name')} placeholder="Jane Smith" />
            <Input label="Email" type="email" value={form.email} required
              onChange={set('email')} placeholder="you@example.com" />
            <Input label="Password" type="password" value={form.password} required
              onChange={set('password')} placeholder="Min. 6 characters" />
            <Input label="Confirm Password" type="password" value={form.confirmPassword} required
              onChange={set('confirmPassword')} placeholder="••••••••" />
            <Button type="submit" loading={loading} variant="coral" className="w-full mt-2">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-navy-600 dark:text-navy-400 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
