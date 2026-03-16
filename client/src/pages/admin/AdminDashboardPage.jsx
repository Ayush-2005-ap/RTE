import { useState, useEffect } from 'react'
import { Link, NavLink, Routes, Route, Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ChartBarIcon, UsersIcon, ShieldCheckIcon, MapIcon,
  NewspaperIcon, DocumentTextIcon, Cog6ToothIcon, BellIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import api from '../../services/api'
import { toast } from 'react-hot-toast'

const navItems = [
  { label: 'Dashboard', icon: ChartBarIcon, href: '/admin' },
  { label: 'Users', icon: UsersIcon, href: '/admin/users' },
  { label: 'Moderation', icon: ShieldCheckIcon, href: '/admin/moderation' },
  { label: 'States', icon: MapIcon, href: '/admin/states' },
  { label: 'News', icon: NewspaperIcon, href: '/admin/news' },
  { label: 'Blog', icon: DocumentTextIcon, href: '/admin/blog' },
]

const statusColor = { filed: '#1A2744', reviewing: '#E8872A', resolved: '#2E7D32', escalated: '#C62828' }

function DashboardOverview() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const res = await api.get('/stats/admin')
      if (res.data.status === 'success') {
        setData(res.data.data)
      }
    } catch {
      toast.error('Failed to load admin statistics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <ArrowPathIcon className="w-10 h-10 animate-spin text-navy" style={{ color: '#1A2744' }} />
        <p className="mt-4 text-muted font-semibold">Loading Dashboard Data...</p>
      </div>
    )
  }

  const stats = [
    { label: 'Total Users', value: data?.summary?.totalUsers || 0, change: `+${data?.growth?.usersThisWeek || 0} this week`, color: '#1A2744' },
    { label: 'Questions', value: data?.summary?.totalQuestions || 0, change: `+${data?.growth?.questionsThisWeek || 0} this week`, color: '#E8872A' },
    { label: 'Grievances Filed', value: data?.summary?.totalGrievances || 0, change: `+${data?.growth?.grievancesThisWeek || 0} this week`, color: '#2E7D32' },
    { label: 'Resolved', value: data?.summary?.resolvedGrievances || 0, change: `${data?.summary?.resolutionRate || 0}% resolution rate`, color: '#558B2F' },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-h2 font-display" style={{ color: '#1A2744' }}>Dashboard</h1>
        <div className="flex gap-2">
          <button className="p-2 bg-white rounded-xl shadow-sm text-muted hover:text-ink transition-colors" onClick={fetchStats}>
            <ArrowPathIcon className="w-5 h-5 text-muted hover:text-navy" />
          </button>
          <button className="p-2 bg-white rounded-xl shadow-sm text-muted hover:text-ink transition-colors">
            <BellIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted font-semibold uppercase tracking-wider">{s.label}</p>
              <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
            </div>
            <div className="font-bold text-3xl font-display" style={{ color: s.color }}>{s.value}</div>
            <p className="text-xs text-muted mt-1">{s.change}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Grievances */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-ink">Recent Grievances</h2>
            <Link to="/admin/moderation" className="text-xs font-semibold" style={{ color: '#E8872A' }}>Explore queue</Link>
          </div>
          <div className="space-y-3">
            {!data?.recentGrievances?.length ? (
              <div className="py-10 text-center text-muted text-sm italic">No recent grievances filed.</div>
            ) : (
              data.recentGrievances.map(g => (
                <div key={g._id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(26,39,68,0.03)' }}>
                  <div>
                    <p className="text-xs font-mono font-semibold" style={{ color: '#1A2744' }}>{g.refNumber}</p>
                    <p className="text-sm text-ink capitalize">{g.category.replace('-', ' ')} <span className="text-muted">· {g.state}</span></p>
                  </div>
                  <div className="text-right">
                    <span className="badge text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: statusColor[g.status] + '18', color: statusColor[g.status] }}>
                      {g.status}
                    </span>
                    <p className="text-xs text-muted mt-1">{new Date(g.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top States */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold text-ink mb-4">State Compliance Overview</h2>
          <div className="space-y-3">
            {[
              { name: 'Kerala', score: 91, color: '#2E7D32' },
              { name: 'Himachal Pradesh', score: 84, color: '#2E7D32' },
              { name: 'Tamil Nadu', score: 79, color: '#2E7D32' },
              { name: 'Uttar Pradesh', score: 38, color: '#C62828' },
              { name: 'Bihar', score: 34, color: '#C62828' },
            ].map(s => (
              <div key={s.name} className="flex items-center gap-3">
                <span className="text-sm text-ink w-32 flex-shrink-0">{s.name}</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(26,39,68,0.07)' }}>
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${s.score}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full" style={{ background: s.color }}
                  />
                </div>
                <span className="text-sm font-bold w-8 flex-shrink-0 text-right" style={{ color: s.color }}>{s.score}</span>
              </div>
            ))}
          </div>
          <Link to="/states" className="mt-4 inline-flex text-xs font-semibold" style={{ color: '#E8872A' }}>
            View all states →
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

function ModerationPage() {
  const [grievances, setGrievances] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGrievances()
  }, [])

  const fetchGrievances = async () => {
    try {
      setLoading(true)
      const res = await api.get('/grievances') // Admin endpoint to get all
      if (res.data.status === 'success') {
        setGrievances(res.data.data.grievances)
      }
    } catch {
      toast.error('Failed to load grievances')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      const res = await api.patch(`/grievances/${id}/status`, { status })
      if (res.data.status === 'success') {
        toast.success('Status updated')
        fetchGrievances()
      }
    } catch {
      toast.error('Failed to update status')
    }
  }

  if (loading) return <div className="py-20 text-center">Loading grievances...</div>

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-h2 font-display mb-6" style={{ color: '#1A2744' }}>Moderation Queue</h1>
      
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-navy/5">
        <table className="w-full text-left border-collapse">
          <thead style={{ background: 'rgba(26,39,68,0.03)' }}>
            <tr>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted">Ref#</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted">User</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted">Category</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted">Status</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy/5">
            {grievances.map(g => (
              <tr key={g._id} className="hover:bg-navy/[0.01] transition-colors">
                <td className="p-4 text-sm font-mono font-bold" style={{ color: '#1A2744' }}>{g.refNumber}</td>
                <td className="p-4 text-sm">
                  <p className="font-semibold text-ink">{g.author?.name || 'Unknown'}</p>
                  <p className="text-xs text-muted">{g.state}</p>
                </td>
                <td className="p-4 text-sm capitalize">{g.category.replace('-', ' ')}</td>
                <td className="p-4">
                  <span className="badge text-xs font-semibold px-2 py-1 rounded-full"
                    style={{ background: statusColor[g.status] + '18', color: statusColor[g.status] }}>
                    {g.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <select 
                    className="text-xs bg-navy/5 border-none rounded-lg px-2 py-1 focus:ring-1 focus:ring-orange/50 transition-all cursor-pointer"
                    value={g.status}
                    onChange={(e) => updateStatus(g._id, e.target.value)}
                  >
                    <option value="filed">Filed</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="resolved">Resolved</option>
                    <option value="escalated">Escalated</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!grievances.length && (
          <div className="py-20 text-center text-muted italic">No grievances in queue.</div>
        )}
      </div>
    </motion.div>
  )
}

export default function AdminDashboardPage() {
  return (
    <div style={{ paddingTop: '64px', display: 'flex', minHeight: '100vh', background: '#F5EFE0' }}>
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 hidden md:flex flex-col"
        style={{ background: '#1A2744', minHeight: 'calc(100vh - 64px)', position: 'sticky', top: '64px' }}>
        <div className="p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <NavLink key={item.href} to={item.href} end={item.href === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive ? 'text-white' : 'text-white/60 hover:text-white hover:bg-white/8'
                }`
              }
              style={({ isActive }) => isActive ? { background: 'rgba(232,135,42,0.18)', color: '#f0a952' } : {}}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <Link to="/" className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors">
            ← Back to site
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Routes>
          <Route index element={<DashboardOverview />} />
          <Route path="moderation" element={<ModerationPage />} />
          <Route path="users" element={<div className="py-20 text-center text-muted">User management coming soon.</div>} />
          <Route path="news" element={<div className="py-20 text-center text-muted">News management coming soon.</div>} />
          <Route path="blog" element={<div className="py-20 text-center text-muted">Blog management coming soon.</div>} />
          <Route path="states" element={<div className="py-20 text-center text-muted">States content management coming soon.</div>} />
        </Routes>
      </main>
    </div>
  )
}
