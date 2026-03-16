import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import api from '../../services/api'
import { toast } from 'react-hot-toast'

const statusConfig = {
  filed:     { label: 'Filed',     color: '#1A2744', bg: 'rgba(26,39,68,0.1)' },
  reviewing: { label: 'Reviewing', color: '#E8872A', bg: 'rgba(232,135,42,0.12)' },
  resolved:  { label: 'Resolved',  color: '#2E7D32', bg: 'rgba(46,125,50,0.12)' },
  escalated: { label: 'Escalated', color: '#C62828', bg: 'rgba(198,40,40,0.1)' },
}

export default function MyGrievancesPage() {
  const [grievances, setGrievances] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGrievances()
  }, [])

  const fetchGrievances = async () => {
    try {
      setLoading(true)
      const res = await api.get('/grievances/my')
      if (res.data.status === 'success') {
        setGrievances(res.data.data.grievances)
      }
    } catch {
      toast.error('Failed to load grievances')
    } finally {
      setLoading(false)
    }
  }

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
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted">
              <ArrowPathIcon className="w-8 h-8 animate-spin mb-3" />
              <p>Loading your grievances...</p>
            </div>
          ) : grievances.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-dashed border-gray-300">
              <h3 className="text-lg font-semibold text-ink mb-2">No grievances found</h3>
              <p className="text-sm text-muted mb-6">You haven't filed any grievances yet. If you're facing RTE-related issues, we're here to help.</p>
              <Link to="/grievances/file" className="btn-primary inline-flex">File your first grievance</Link>
            </div>
          ) : (
            grievances.map((g, i) => {
              const sc = statusConfig[g.status] || statusConfig.filed
              const formattedDate = new Date(g.createdAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              })
              
              return (
                <motion.div key={g._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <Link to={`/grievances/${g._id}`}>
                    <div className="bg-white rounded-2xl p-5 card-hover border" style={{ borderColor: 'rgba(26,39,68,0.07)' }}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono-rte text-xs font-semibold" style={{ color: '#1A2744' }}>{g.refNumber}</span>
                          </div>
                          <p className="font-semibold text-ink capitalize">{g.category.replace('-', ' ')}</p>
                          <p className="text-xs text-muted mt-1">{g.state} · Filed {formattedDate}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="badge font-semibold text-xs px-3 py-1.5 rounded-full"
                            style={{ background: sc.bg, color: sc.color }}>
                            {sc.label}
                          </span>
                          <p className="text-xs text-muted mt-2">
                            {g.updatedAt === g.createdAt ? 'Recently filed' : `Updated ${new Date(g.updatedAt).toLocaleDateString()}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
