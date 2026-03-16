import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PlusIcon } from '@heroicons/react/24/outline'

const statusConfig = {
  filed:     { label: 'Filed',     color: '#1A2744', bg: 'rgba(26,39,68,0.1)' },
  reviewing: { label: 'Reviewing', color: '#E8872A', bg: 'rgba(232,135,42,0.12)' },
  resolved:  { label: 'Resolved',  color: '#2E7D32', bg: 'rgba(46,125,50,0.12)' },
  escalated: { label: 'Escalated', color: '#C62828', bg: 'rgba(198,40,40,0.1)' },
}

const mockGrievances = [
  { id: 'RTE-2025-48391', category: 'Denial of Admission', state: 'Maharashtra', status: 'reviewing', date: 'Mar 8, 2025', lastUpdate: '2 days ago' },
  { id: 'RTE-2025-31204', category: 'Illegal Fees',         state: 'Karnataka',  status: 'resolved',  date: 'Feb 15, 2025', lastUpdate: '3 weeks ago' },
  { id: 'RTE-2025-19837', category: 'Infrastructure Issues', state: 'Delhi',     status: 'filed',     date: 'Jan 29, 2025', lastUpdate: '6 weeks ago' },
]

export default function MyGrievancesPage() {
  return (
    <div style={{ paddingTop: '64px' }}>
      <div className="py-12 px-4" style={{ background: 'linear-gradient(135deg,#1A2744,#243356)' }}>
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest mb-2 block" style={{ color: '#E8872A' }}>My Account</span>
            <h1 className="text-h1 text-white" style={{ fontFamily: "'Playfair Display',serif" }}>My Grievances</h1>
          </div>
          <Link to="/grievances/file" className="btn-primary whitespace-nowrap">
            <PlusIcon className="w-4 h-4" /> New Grievance
          </Link>
        </div>
      </div>

      <div className="py-8 px-4" style={{ background: '#F5EFE0', minHeight: '60vh' }}>
        <div className="max-w-3xl mx-auto space-y-4">
          {mockGrievances.map((g, i) => {
            const sc = statusConfig[g.status]
            return (
              <motion.div key={g.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Link to={`/grievances/${g.id}`}>
                  <div className="bg-white rounded-2xl p-5 card-hover border" style={{ borderColor: 'rgba(26,39,68,0.07)' }}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono-rte text-xs font-semibold" style={{ color: '#1A2744' }}>{g.id}</span>
                        </div>
                        <p className="font-semibold text-ink">{g.category}</p>
                        <p className="text-xs text-muted mt-1">{g.state} · Filed {g.date}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="badge font-semibold text-xs px-3 py-1.5 rounded-full"
                          style={{ background: sc.bg, color: sc.color }}>
                          {sc.label}
                        </span>
                        <p className="text-xs text-muted mt-2">Updated {g.lastUpdate}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
