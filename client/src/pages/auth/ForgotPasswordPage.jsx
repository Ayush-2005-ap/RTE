import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { EnvelopeIcon } from '@heroicons/react/24/outline'

export default function ForgotPasswordPage() {
  return (
    <div style={{ paddingTop: '64px', background: '#F5EFE0', minHeight: '100vh' }}
      className="flex items-center justify-center px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-white rounded-3xl p-8 shadow-card text-center">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
            style={{ background: 'rgba(232,135,42,0.12)' }}>
            <EnvelopeIcon className="w-8 h-8" style={{ color: '#E8872A' }} />
          </div>
          <h1 className="text-h2 font-display mb-2" style={{ color: '#1A2744' }}>Forgot password?</h1>
          <p className="text-sm text-muted mb-8">Enter your email address and we'll send you a reset link.</p>
          <form onSubmit={e => e.preventDefault()} className="text-left space-y-4">
            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5">Email address</label>
              <input type="email" placeholder="you@example.com" className="input-rte" />
            </div>
            <button type="submit" className="btn-primary w-full justify-center py-3.5">Send Reset Link</button>
          </form>
          <p className="mt-6 text-sm text-muted">
            Remembered it? <Link to="/login" className="font-semibold" style={{ color: '#1A2744' }}>Back to login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
