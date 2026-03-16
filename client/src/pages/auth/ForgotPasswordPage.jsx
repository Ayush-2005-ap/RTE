import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { EnvelopeIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import api from '../../services/api'
import { toast } from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return toast.error('Please enter your email')

    try {
      setLoading(true)
      await api.post('/auth/forgot-password', { email })
      setSubmitted(true)
      toast.success('Reset link sent to your email!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ paddingTop: '64px', background: '#F5EFE0', minHeight: '100vh' }}
      className="flex items-center justify-center px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-white rounded-3xl p-8 shadow-card text-center">
          {submitted ? (
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="py-4">
              <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ background: 'rgba(46,125,50,0.1)' }}>
                <CheckCircleIcon className="w-8 h-8" style={{ color: '#2E7D32' }} />
              </div>
              <h2 className="text-h2 font-display mb-4" style={{ color: '#1A2744' }}>Check your email</h2>
              <p className="text-sm text-muted mb-8 leading-relaxed">
                We've sent a password reset link to <span className="font-semibold text-ink">{email}</span>. 
                Please check your inbox (and spam folder) to proceed.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-sm font-semibold hover:underline"
                style={{ color: '#E8872A' }}
              >
                Didn't receive it? Try again
              </button>
            </motion.div>
          ) : (
            <>
              <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                style={{ background: 'rgba(232,135,42,0.12)' }}>
                <EnvelopeIcon className="w-8 h-8" style={{ color: '#E8872A' }} />
              </div>
              <h1 className="text-h2 font-display mb-2" style={{ color: '#1A2744' }}>Forgot password?</h1>
              <p className="text-sm text-muted mb-8">Enter your email address and we'll send you a reset link.</p>
              <form onSubmit={handleSubmit} className="text-left space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">Email address</label>
                  <input 
                    type="email" 
                    placeholder="you@example.com" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
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
                      <ArrowPathIcon className="w-4 h-4 animate-spin" /> Sending...
                    </>
                  ) : 'Send Reset Link'}
                </button>
              </form>
            </>
          )}
          <p className="mt-6 text-sm text-muted border-t pt-6" style={{ borderColor: 'rgba(26,39,68,0.06)' }}>
            Remembered it? <Link to="/login" className="font-semibold" style={{ color: '#1A2744' }}>Back to login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
