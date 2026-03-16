import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, DocumentTextIcon, NewspaperIcon, ScaleIcon, ChartBarIcon } from '@heroicons/react/24/outline'

const stateData = {
  kerala: { name: 'Kerala', region: 'South India', score: 91, label: 'Excellent', contactEmail: 'rte@kerala.gov.in',
    breakdown: { enrollment: 95, infrastructure: 88, teachers: 93, funding: 90 },
    content: {
      acts: [
        { title: 'Kerala RTE Rules 2011', date: '2011-08-03', type: 'PDF' },
        { title: 'Amendment to Kerala Education Rules', date: '2019-05-14', type: 'PDF' },
      ],
      reports: [
        { title: 'DISE Report Kerala 2023-24', date: '2024-01-10', type: 'PDF' },
      ],
      news: [
        { title: 'Kerala achieves 95% RTE enrollment', date: 'Mar 2025' },
      ],
    }
  },
  'uttar-pradesh': {
    name: 'Uttar Pradesh', region: 'North India', score: 38, label: 'Poor', contactEmail: 'rte@up.gov.in',
    breakdown: { enrollment: 42, infrastructure: 31, teachers: 38, funding: 40 },
    content: { acts: [], reports: [], news: [] },
  },
}

const tabs = ['Overview', 'Acts & Rules', 'Reports', 'News', 'Contact']

function ScoreGauge({ score }) {
  const c = score >= 75 ? '#2E7D32' : score >= 50 ? '#E8872A' : '#C62828'
  const radius = 54
  const circ = 2 * Math.PI * radius
  const dash = (score / 100) * circ

  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(26,39,68,0.08)" strokeWidth="12" />
        <motion.circle
          cx="70" cy="70" r={radius} fill="none"
          stroke={c} strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${circ}`}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
        />
        <text x="70" y="66" textAnchor="middle" fontSize="28" fontWeight="800" fill={c} fontFamily="DM Sans">{score}</text>
        <text x="70" y="84" textAnchor="middle" fontSize="11" fill="#888" fontFamily="DM Sans">/100</text>
      </svg>
    </div>
  )
}

export default function StateDetailPage() {
  const { stateSlug } = useParams()
  const [activeTab, setActiveTab] = useState('Overview')
  const state = stateData[stateSlug] || {
    name: stateSlug?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'State',
    region: 'India', score: 55, label: 'Average', contactEmail: 'rte@state.gov.in',
    breakdown: { enrollment: 55, infrastructure: 52, teachers: 57, funding: 56 },
    content: { acts: [], reports: [], news: [] },
  }
  const scoreColor = state.score >= 75 ? '#2E7D32' : state.score >= 50 ? '#E8872A' : '#C62828'

  return (
    <div style={{ paddingTop: '64px' }}>
      {/* Header */}
      <div className="py-12 px-4" style={{ background: 'linear-gradient(135deg,#1A2744,#243356)' }}>
        <div className="max-w-6xl mx-auto">
          <Link to="/states" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeftIcon className="w-4 h-4" /> Back to all states
          </Link>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest mb-2 block" style={{ color: '#E8872A' }}>{state.region}</span>
              <h1 className="text-h1 text-white mb-1" style={{ fontFamily: "'Playfair Display',serif" }}>{state.name}</h1>
              <span className="badge font-bold px-4 py-1.5 rounded-full text-sm" style={{ background: scoreColor + '22', color: scoreColor }}>
                {state.label}
              </span>
            </div>
            <ScoreGauge score={state.score} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b bg-white sticky top-16 z-30" style={{ borderColor: 'rgba(26,39,68,0.1)' }}>
        <div className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-4 py-3.5 text-sm font-semibold whitespace-nowrap transition-all border-b-2"
              style={{
                borderColor: activeTab === tab ? '#E8872A' : 'transparent',
                color: activeTab === tab ? '#E8872A' : '#888',
              }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="py-10 px-4" style={{ background: '#F5EFE0' }}>
        <div className="max-w-6xl mx-auto">
          {activeTab === 'Overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {Object.entries(state.breakdown).map(([key, val]) => {
                  const c2 = val >= 75 ? '#2E7D32' : val >= 50 ? '#E8872A' : '#C62828'
                  return (
                    <div key={key} className="p-5 bg-white rounded-2xl shadow-sm">
                      <p className="text-xs text-muted capitalize mb-1">{key}</p>
                      <div className="font-bold text-2xl mb-2" style={{ color: c2 }}>{val}%</div>
                      <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(26,39,68,0.07)' }}>
                        <motion.div
                          initial={{ width: 0 }} animate={{ width: `${val}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="h-full rounded-full" style={{ background: c2 }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-white rounded-2xl shadow-sm">
                  <h3 className="font-semibold text-ink mb-3">Quick Facts</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between"><dt className="text-muted">Compliance Score</dt><dd className="font-semibold" style={{ color: scoreColor }}>{state.score}/100</dd></div>
                    <div className="flex justify-between"><dt className="text-muted">Status</dt><dd className="font-semibold">{state.label}</dd></div>
                    <div className="flex justify-between"><dt className="text-muted">Region</dt><dd>{state.region}</dd></div>
                    <div className="flex justify-between"><dt className="text-muted">Contact</dt><dd>{state.contactEmail}</dd></div>
                  </dl>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-sm">
                  <h3 className="font-semibold text-ink mb-3">Take Action</h3>
                  <div className="space-y-3">
                    <Link to="/grievances/file" className="btn-primary w-full justify-center text-sm">File a Grievance</Link>
                    <Link to="/community/ask" className="btn-secondary w-full justify-center text-sm">Ask a Question</Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {(activeTab === 'Acts & Rules' || activeTab === 'Reports') && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="space-y-4">
                {(activeTab === 'Acts & Rules' ? state.content.acts : state.content.reports).length === 0 ? (
                  <div className="text-center py-16 text-muted">
                    <DocumentTextIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No documents available yet.</p>
                  </div>
                ) : (
                  (activeTab === 'Acts & Rules' ? state.content.acts : state.content.reports).map((doc, i) => (
                    <div key={i} className="p-4 bg-white rounded-xl flex items-center justify-between border"
                      style={{ borderColor: 'rgba(26,39,68,0.08)' }}>
                      <div>
                        <p className="font-medium text-ink text-sm">{doc.title}</p>
                        <p className="text-xs text-muted">{doc.date}</p>
                      </div>
                      <button className="btn-primary text-xs px-3 py-1.5">Download {doc.type}</button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'News' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {state.content.news.length === 0 ? (
                <div className="text-center py-16 text-muted">
                  <NewspaperIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No news available yet.</p>
                </div>
              ) : (
                state.content.news.map((n, i) => (
                  <div key={i} className="p-4 bg-white rounded-xl border mb-3" style={{ borderColor: 'rgba(26,39,68,0.08)' }}>
                    <p className="font-medium text-ink text-sm">{n.title}</p>
                    <p className="text-xs text-muted mt-1">{n.date}</p>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'Contact' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="max-w-lg bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="font-semibold text-ink mb-4">State RTE Authority Contact</h3>
                <p className="text-sm text-muted mb-2">For official grievances, contact the state RTE authority:</p>
                <a href={`mailto:${state.contactEmail}`} className="text-sm font-semibold" style={{ color: '#E8872A' }}>
                  {state.contactEmail}
                </a>
                <div className="mt-6 border-t pt-4" style={{ borderColor: 'rgba(26,39,68,0.08)' }}>
                  <p className="text-xs text-muted mb-3">Or file a grievance through our platform for tracking:</p>
                  <Link to="/grievances/file" className="btn-primary text-sm">File Grievance Online</Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
