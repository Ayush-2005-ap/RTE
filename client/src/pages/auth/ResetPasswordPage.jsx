import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LockClosedIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import api from '../../services/api'
import { toast } from 'react-hot-toast'
import useAuthStore from '../../store/authStore'

export default function ResetPasswordPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const { setUser, setAccessToken } = useAuthStore()
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password.length < 8) return toast.error('Password must be at least 8 characters')
    if (password !== confirmPassword) return toast.error('Passwords do not match')

    try {
      setLoading(true)
      const res = await api.patch(`/auth/reset-password/${token}`, { password })
      
      if (res.data.status === 'success') {
        const { user, accessToken } = res.data.data
        setUser(user)
        setAccessToken(accessToken)
        toast.success('Password reset successfully!')
        navigate('/')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ paddingTop: '64px', background: '#F5EFE0', minHeight: '100vh' }}
      className="flex items-center justify-center px-4 py-16">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        <div className="bg-white rounded-3xl p-8 shadow-card">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'rgba(46,125,50,0.1)' }}>
              <LockClosedIcon className="w-8 h-8" style={{ color: '#2E7D32' }} />
            </div>
            <h1 className="text-h2 font-display" style={{ color: '#1A2744' }}>Set new password</h1>
            <p className="text-sm text-muted mt-1">Please enter your new password below.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5">New Password</label>
              <input
                type="password"
                placeholder="Minimum 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-rte"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5">Confirm New Password</label>
              <input
                type="password"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="input-rte"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full justify-center py-3.5"
            >
              {loading ? (
                <>
                  <ArrowPathIcon className="w-4 h-4 animate-spin" /> Resetting...
                </>
              ) : 'Update Password'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
