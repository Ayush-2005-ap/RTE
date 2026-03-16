import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  return (
    <div style={{ paddingTop: '64px', background: '#F5EFE0', minHeight: '100vh' }}
      className="flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-3xl p-8 shadow-card">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#E8872A,#f0a952)' }}>
              <span className="text-white font-bold font-display">RTE</span>
            </div>
            <h1 className="text-h2 font-display" style={{ color: '#1A2744' }}>Welcome back</h1>
            <p className="text-sm text-muted mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={e => e.preventDefault()} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5">Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="input-rte"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="input-rte pr-11"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors">
                  {showPw ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex justify-end mt-1.5">
                <Link to="/forgot-password" className="text-xs font-semibold" style={{ color: '#E8872A' }}>
                  Forgot password?
                </Link>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full justify-center py-3.5 text-base">
              Sign in
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold" style={{ color: '#1A2744' }}>Create one</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
