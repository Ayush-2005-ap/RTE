import { useState } from 'react'
import { Link, useLocation, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ChartBarIcon, UsersIcon, ShieldCheckIcon, MapIcon,
  NewspaperIcon, DocumentTextIcon, Cog6ToothIcon, BellIcon,
} from '@heroicons/react/24/outline'

const navItems = [
  { label: 'Dashboard', icon: ChartBarIcon, href: '/admin' },
  { label: 'Users', icon: UsersIcon, href: '/admin/users' },
  { label: 'Moderation', icon: ShieldCheckIcon, href: '/admin/moderation' },
  { label: 'States', icon: MapIcon, href: '/admin/states' },
  { label: 'News', icon: NewspaperIcon, href: '/admin/news' },
  { label: 'Blog', icon: DocumentTextIcon, href: '/admin/blog' },
]

const stats = [
  { label: 'Total Users', value: '1,248', change: '+24 this week', color: '#1A2744' },
  { label: 'Questions', value: '847', change: '+12 today', color: '#E8872A' },
  { label: 'Grievances Filed', value: '423', change: '+3 today', color: '#2E7D32' },
  { label: 'Resolved', value: '318', change: '75% resolution rate', color: '#558B2F' },
]

const recentGrievances = [
  { id: 'RTE-2025-48391', category: 'Denial of Admission', state: 'Maharashtra', status: 'reviewing', date: 'Mar 12' },
  { id: 'RTE-2025-47201', category: 'Illegal Fees', state: 'Delhi', status: 'filed', date: 'Mar 11' },
  { id: 'RTE-2025-46893', category: 'Teacher Shortage', state: 'UP', status: 'escalated', date: 'Mar 10' },
  { id: 'RTE-2025-45022', category: 'Discrimination', state: 'Bihar', status: 'resolved', date: 'Mar 9' },
]

const statusColor = { filed: '#1A2744', reviewing: '#E8872A', resolved: '#2E7D32', escalated: '#C62828' }

export default function AdminDashboardPage() {
  const location = useLocation()
  const isExactAdmin = location.pathname === '/admin'

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
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-h2 font-display" style={{ color: '#1A2744' }}>Dashboard</h1>
          <div className="flex gap-2">
            <button className="p-2 bg-white rounded-xl shadow-sm text-muted hover:text-ink transition-colors">
              <BellIcon className="w-5 h-5" />
            </button>
            <button className="p-2 bg-white rounded-xl shadow-sm text-muted hover:text-ink transition-colors">
              <Cog6ToothIcon className="w-5 h-5" />
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
              <Link to="/grievances/my" className="text-xs font-semibold" style={{ color: '#E8872A' }}>View all</Link>
            </div>
            <div className="space-y-3">
              {recentGrievances.map(g => (
                <div key={g.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(26,39,68,0.03)' }}>
                  <div>
                    <p className="text-xs font-mono font-semibold" style={{ color: '#1A2744' }}>{g.id}</p>
                    <p className="text-sm text-ink">{g.category} <span className="text-muted">· {g.state}</span></p>
                  </div>
                  <div className="text-right">
                    <span className="badge text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: statusColor[g.status] + '18', color: statusColor[g.status] }}>
                      {g.status}
                    </span>
                    <p className="text-xs text-muted mt-1">{g.date}</p>
                  </div>
                </div>
              ))}
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
      </main>
    </div>
  )
}
