import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, DocumentTextIcon, NewspaperIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import api from '../../services/api'
import { toast } from 'react-hot-toast'

const tabs = ['Overview', 'Acts & Rules', 'Reports', 'News', 'Contact']

function ScoreGauge({ score }) {
  const c = score >= 75 ? '#2E7D32' : score >= 50 ? '#E8872A' : '#C62828'
  const radius = 54
  const circ = 2 * Math.PI * radius
  const dash = (score / 100) * circ

  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
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
        <text x="70" y="66" textAnchor="middle" fontSize="28" fontWeight="800" fill="#fff" fontFamily="DM Sans">{score}</text>
        <text x="70" y="84" textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.5)" fontFamily="DM Sans">/100</text>
      </svg>
    </div>
  )
}

export default function StateDetailPage() {
  const { stateSlug } = useParams()
  const [activeTab, setActiveTab] = useState('Overview')
  
  const [state, setState] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchState = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/states/${stateSlug}`)
        setState(res.data.data.state)
      } catch (err) {
        toast.error('Failed to load state data')
      } finally { setLoading(false) }
    }
    fetchState()
  }, [stateSlug])

  if (loading) return <div className="min-h-screen pt-32 flex justify-center"><ArrowPathIcon className="w-8 h-8 animate-spin text-gray-400" /></div>
  if (!state) return <div className="min-h-screen pt-32 text-center text-gray-500">State not found.</div>

  const score = state.complianceScore || 0
  const scoreColor = score >= 75 ? '#2E7D32' : score >= 50 ? '#E8872A' : '#C62828'
  const label = state.complianceLabel || 'No Data'

  // Dummy fallback data if not provided
  const breakdown = { enrollment: score, infrastructure: Math.max(0, score-5), teachers: Math.min(100, score+5), funding: score }
  const content = { acts: [], reports: [], news: [] }

  return (
    <div style={{ paddingTop: '64px' }}>
      {/* Header */}
      <div className="py-12 px-4" style={{ background: 'linear-gradient(135deg,#1A2744,#243356)' }}>
        <div className="max-w-6xl mx-auto">
          <Link to="/states" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors font-semibold">
            <ArrowLeftIcon className="w-4 h-4" /> Back to all states
          </Link>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest mb-2 block" style={{ color: '#E8872A' }}>{state.region}</span>
              <h1 className="text-5xl font-serif font-bold text-white mb-2">{state.name}</h1>
              <span className="font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-wider" style={{ background: scoreColor, color: '#fff' }}>
                Status: {label}
              </span>
            </div>
            <ScoreGauge score={score} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b bg-white sticky top-16 z-30">
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

      <div className="py-10 px-4 min-h-[50vh]" style={{ background: '#F5EFE0' }}>
        <div className="max-w-6xl mx-auto">
          {activeTab === 'Overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {Object.entries(breakdown).map(([key, val]) => {
                  const c2 = val >= 75 ? '#2E7D32' : val >= 50 ? '#E8872A' : '#C62828'
                  return (
                    <div key={key} className="p-5 bg-white rounded-2xl shadow-sm border border-gray-100">
                      <p className="text-xs font-semibold text-gray-400 capitalize mb-1 uppercase tracking-wider">{key}</p>
                      <div className="font-bold text-3xl mb-2 font-serif" style={{ color: c2 }}>{val}%</div>
                      <div className="w-full h-1.5 rounded-full bg-gray-100">
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
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-xl font-serif text-[#1A2744] mb-3">Quick Facts</h3>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-gray-50 pb-2"><dt className="text-gray-500 font-semibold">Compliance Score</dt><dd className="font-bold" style={{ color: scoreColor }}>{score}/100</dd></div>
                    <div className="flex justify-between border-b border-gray-50 pb-2"><dt className="text-gray-500 font-semibold">Status</dt><dd className="font-bold text-gray-800">{label}</dd></div>
                    <div className="flex justify-between border-b border-gray-50 pb-2"><dt className="text-gray-500 font-semibold">Region</dt><dd className="font-bold text-gray-800">{state.region}</dd></div>
                    <div className="flex justify-between"><dt className="text-gray-500 font-semibold">Key Issue</dt><dd className="font-bold text-gray-800 text-right max-w-[60%]">{state.keyIssue || 'Not documented'}</dd></div>
                  </dl>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
                  <h3 className="font-semibold text-xl font-serif text-[#1A2744] mb-2">Have a question regarding {state.name}?</h3>
                  <p className="text-gray-500 text-sm mb-6">Ask our community of experts and educators.</p>
                  <Link to="/community" className="px-6 py-3 bg-[#E8872A] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">Go to Community Q&A</Link>
                </div>
              </div>
            </motion.div>
          )}

          {(activeTab === 'Acts & Rules' || activeTab === 'Reports') && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="space-y-4">
                {(activeTab === 'Acts & Rules' ? content.acts : content.reports).length === 0 ? (
                  <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <DocumentTextIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-semibold">No documents available yet for {state.name}.</p>
                  </div>
                ) : null}
              </div>
            </motion.div>
          )}

          {activeTab === 'News' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {content.news.length === 0 ? (
                <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <NewspaperIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-semibold">No specific news tagged for {state.name}.</p>
                </div>
              ) : null}
            </motion.div>
          )}

          {activeTab === 'Contact' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="max-w-lg bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-semibold text-xl font-serif text-[#1A2744] mb-2">State RTE Authority</h3>
                <p className="text-sm text-gray-500 mb-6">For official inquiries regarding Right to Education in {state.name}, please contact the relevant state department:</p>
                
                <div className="p-4 bg-gray-50 rounded-xl">
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Official Email</span>
                  <a href={`mailto:${state.contactEmail}`} className="text-lg font-bold" style={{ color: '#E8872A' }}>
                    {state.contactEmail || 'Not available'}
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
