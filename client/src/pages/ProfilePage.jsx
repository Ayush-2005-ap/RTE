import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPinIcon, PencilSquareIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import useAuthStore from '../store/authStore'
import api from '../services/api'

export default function ProfilePage() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState({ questionsAsked: 0, grievancesFiled: 0, answersPosted: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchUserStats()
    }
  }, [user])

  const fetchUserStats = async () => {
    try {
      setLoading(true)
      // We can use the public stats or create a specific user stats endpoint
      // For now, let's fetch based on what we have available
      const [grievancesRes, questionsRes] = await Promise.all([
        api.get('/grievances/my'),
        api.get('/questions/my').catch(() => ({ data: { results: 0 } })) // Fallback if not implemented
      ])
      
      setStats({
        grievancesFiled: grievancesRes.data.results || 0,
        questionsAsked: questionsRes.data.results || 0,
        answersPosted: 0
      })
    } catch {
      // Silent fail for stats, keep defaults
    } finally {
      setLoading(false)
    }
  }

  const joinDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown'

  if (!user) return null;
  return (
    <div style={{ paddingTop: '64px' }}>
      <div className="py-16 px-4" style={{ background: 'linear-gradient(135deg,#1A2744,#243356)' }}>
        <div className="max-w-3xl mx-auto flex items-end gap-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#E8872A,#f0a952)' }}>
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-h1 text-white font-display">{user.name}</h1>
            <p className="text-white/60 text-sm mt-1 flex items-center gap-2">
              <MapPinIcon className="w-3.5 h-3.5" /> {user.state} · {user.userType} · Joined {joinDate}
            </p>
          </div>
          <button className="ml-auto btn-ghost text-white/70 hover:text-white flex items-center gap-1">
            <PencilSquareIcon className="w-4 h-4" /> Edit
          </button>
        </div>
      </div>

      <div className="py-10 px-4" style={{ background: '#F5EFE0' }}>
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(stats).map(([key, val]) => (
              <div key={key} className="bg-white rounded-2xl p-5 text-center shadow-sm">
                <div className="font-bold text-2xl font-display" style={{ color: '#1A2744' }}>{val}</div>
                <p className="text-xs text-muted capitalize mt-1">{key.replace(/([A-Z])/g, ' $1')}</p>
              </div>
            ))}
          </div>

          {/* Account Details */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-ink mb-4">Account Details</h2>
            <dl className="space-y-3 text-sm">
              {[
                { label: 'Email', value: user.email },
                { label: 'State', value: user.state },
                { label: 'User Type', value: user.userType },
                { label: 'Member Since', value: joinDate },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'rgba(26,39,68,0.06)' }}>
                  <dt className="text-muted">{item.label}</dt>
                  <dd className="font-semibold text-ink">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Quick Links */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Link to="/grievances/my" className="bg-white rounded-2xl p-5 card-hover border flex items-center gap-3" style={{ borderColor: 'rgba(26,39,68,0.07)' }}>
              <div className="w-10 h-10 rounded-xl" style={{ background: 'rgba(232,135,42,0.12)' }} />
              <div>
                <p className="font-semibold text-sm text-ink">My Grievances</p>
                <p className="text-xs text-muted">{stats.grievancesFiled} filed</p>
              </div>
            </Link>
            <Link to="/community/questions" className="bg-white rounded-2xl p-5 card-hover border flex items-center gap-3" style={{ borderColor: 'rgba(26,39,68,0.07)' }}>
              <div className="w-10 h-10 rounded-xl" style={{ background: 'rgba(26,39,68,0.08)' }} />
              <div>
                <p className="font-semibold text-sm text-ink">My Questions</p>
                <p className="text-xs text-muted">{stats.questionsAsked} asked</p>
              </div>
            </Link>
          </div>

          {/* Password Security */}
          <PasswordSecuritySection />
        </div>
      </div>
    </div>
  )
}

function PasswordSecuritySection() {
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (form.newPassword.length < 8) return toast.error('New password must be at least 8 characters')
    if (form.newPassword !== form.confirmPassword) return toast.error('New passwords do not match')

    try {
      setLoading(true)
      await api.patch('/auth/update-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      })
      toast.success('Password updated successfully!')
      setExpanded(false)
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-500/10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-semibold text-ink">Security & Privacy</h2>
          <p className="text-xs text-muted">Manage your login credentials</p>
        </div>
        {!expanded && (
          <button onClick={() => setExpanded(true)} className="text-xs font-semibold px-4 py-2 rounded-xl bg-navy/5 text-navy hover:bg-navy/10 transition-all">
            Change Password
          </button>
        )}
      </div>

      {expanded && (
        <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} onSubmit={handleUpdate} className="space-y-4 pt-4 border-t border-navy/5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-muted mb-1 uppercase tracking-wider">Current Password</label>
              <input 
                type="password" 
                className="input-rte bg-navy/[0.02]" 
                required 
                value={form.currentPassword}
                onChange={e => setForm({...form, currentPassword: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted mb-1 uppercase tracking-wider">New Password</label>
              <input 
                type="password" 
                className="input-rte bg-navy/[0.02]" 
                required 
                value={form.newPassword}
                onChange={e => setForm({...form, newPassword: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted mb-1 uppercase tracking-wider">Confirm New Password</label>
              <input 
                type="password" 
                className="input-rte bg-navy/[0.02]" 
                required 
                value={form.confirmPassword}
                onChange={e => setForm({...form, confirmPassword: e.target.value})}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center py-2.5 text-sm">
              {loading ? 'Updating...' : 'Update Password'}
            </button>
            <button type="button" onClick={() => setExpanded(false)} className="btn-secondary px-6 py-2.5 text-sm">
              Cancel
            </button>
          </div>
        </motion.form>
      )}
    </div>
  )
}

