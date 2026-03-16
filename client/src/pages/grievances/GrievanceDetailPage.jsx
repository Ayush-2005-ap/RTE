import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

const stages = [
  { key: 'filed',     label: 'Filed',     desc: 'Grievance received and logged.' },
  { key: 'reviewing', label: 'Under Review', desc: 'Our team is examining the complaint.' },
  { key: 'resolved',  label: 'Resolved',  desc: 'Issue has been addressed.' },
]

const stageColor = { filed: '#1A2744', reviewing: '#E8872A', resolved: '#2E7D32', escalated: '#C62828' }

const mockData = {
  'RTE-2025-48391': {
    id: 'RTE-2025-48391', category: 'Denial of Admission', state: 'Maharashtra',
    status: 'reviewing', date: 'Mar 8, 2025', school: 'Sunrise English Academy',
    description: 'The school denied RTE/EWS admission despite our eligibility. We submitted all required documents on Jan 15, 2025. The school management verbally said seats were full but refused to provide written confirmation.',
    adminNotes: [
      { date: 'Mar 9, 2025', note: 'Grievance received and assigned to District Education Officer, Pune.' },
      { date: 'Mar 11, 2025', note: "DEO has contacted the school. Awaiting school's response within 7 working days." },
    ],
  },
}

export default function GrievanceDetailPage() {
  const { id } = useParams()
  const g = mockData[id] || {
    id, category: 'Grievance', state: 'India', status: 'filed', date: 'Recent',
    school: 'Unknown School', description: 'No details available.', adminNotes: [],
  }

  const currentStageIdx = stages.findIndex(s => s.key === g.status)
  const isEscalated = g.status === 'escalated'

  return (
    <div style={{ paddingTop: '64px' }}>
      <div className="py-10 px-4" style={{ background: '#F5EFE0', minHeight: '100vh' }}>
        <div className="max-w-2xl mx-auto">
          <Link to="/grievances/my" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink mb-6 transition-colors">
            <ArrowLeftIcon className="w-4 h-4" /> My Grievances
          </Link>

          {/* Header card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 mb-5 shadow-card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-mono-rte text-sm font-bold" style={{ color: '#E8872A' }}>{g.id}</p>
                <h1 className="text-h2 font-display mt-1" style={{ color: '#1A2744' }}>{g.category}</h1>
                <p className="text-sm text-muted mt-1">{g.state} · {g.school} · Filed {g.date}</p>
              </div>
              <span className="badge font-semibold px-3 py-1.5 rounded-full text-sm flex-shrink-0"
                style={{ background: stageColor[g.status] + '18', color: stageColor[g.status] }}>
                {isEscalated ? '🚨 Escalated' : g.status.charAt(0).toUpperCase() + g.status.slice(1)}
              </span>
            </div>
            <p className="text-sm text-ink leading-relaxed">{g.description}</p>
          </motion.div>

          {/* Status Tracker */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 mb-5 shadow-sm">
            <h2 className="font-semibold text-ink mb-5">Grievance Status</h2>
            <div className="space-y-4">
              {stages.map((stage, i) => {
                const isDone = i < currentStageIdx
                const isActive = i === currentStageIdx
                const color = isDone ? '#2E7D32' : isActive ? stageColor[g.status] : '#ccc'
                return (
                  <div key={stage.key} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <motion.div
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.15 }}
                        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
                        style={{ background: color }}
                      >
                        {isDone ? '✓' : i + 1}
                      </motion.div>
                      {i < stages.length - 1 && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 32 }}
                          transition={{ delay: i * 0.15 + 0.1, duration: 0.4 }}
                          className="w-0.5 mt-1"
                          style={{ background: isDone ? '#2E7D32' : 'rgba(26,39,68,0.1)' }}
                        />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className="font-semibold text-sm" style={{ color: isActive ? color : isDone ? '#2E7D32' : '#aaa' }}>
                        {stage.label}
                        {isActive && <span className="ml-2 text-xs font-normal text-muted">(Current)</span>}
                      </p>
                      <p className="text-xs text-muted mt-0.5">{stage.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Admin notes */}
          {g.adminNotes.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-semibold text-ink mb-4">Updates from Authorities</h2>
              <div className="space-y-4">
                {g.adminNotes.map((note, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#E8872A' }} />
                    <div>
                      <p className="text-xs text-muted mb-0.5">{note.date}</p>
                      <p className="text-sm text-ink">{note.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
