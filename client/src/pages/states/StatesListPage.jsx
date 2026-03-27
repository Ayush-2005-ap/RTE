import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import api from '../../services/api'
import { toast } from 'react-hot-toast'
import IndiaMap from '../../components/ui/IndiaMap'

const MAP_LEGEND = [
  { color: '#2E7D32', label: 'Excellent (75+)' },
  { color: '#558B2F', label: 'Good (60–74)' },
  { color: '#E65100', label: 'Average (45–59)' },
  { color: '#B71C1C', label: 'Poor (<45)' },
  { color: '#3B4F7A', label: 'No Data' },
]

export default function StatesListPage() {
  const navigate = useNavigate()
  const [statesData, setStatesData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStates()
  }, [])

  const fetchStates = async () => {
    try {
      setLoading(true)
      const res = await api.get('/states')
      setStatesData(res.data.data.states)
    } catch {
      toast.error('Failed to load state data')
    } finally {
      setLoading(false)
    }
  }

  const topStates = [...statesData]
    .sort((a, b) => (b.complianceScore || 0) - (a.complianceScore || 0))
    .slice(0, 3)
  const bottomStates = [...statesData]
    .sort((a, b) => (a.complianceScore || 0) - (b.complianceScore || 0))
    .slice(0, 3)

  return (
    <div style={{ paddingTop: '64px' }}>

      {/* Page Header */}
      <div className="py-16 px-4" style={{ background: 'linear-gradient(135deg,#1A2744,#243356)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="text-xs font-semibold uppercase tracking-widest mb-3 block" style={{ color: '#E8872A' }}>
              State Dashboard
            </span>
            <h1 className="text-h1 text-white mb-3" style={{ fontFamily: "'Playfair Display',serif" }}>
              RTE Compliance Tracker
            </h1>
            <p className="text-white/60 max-w-xl">
              Explore how all 36 states and UTs are performing on Right to Education Act implementation.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Interactive India Map + Rankings */}
      <div className="py-12 px-4" style={{ background: '#faefd4ff', minHeight: 'calc(100vh - 64px)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col lg:flex-row gap-8 items-start"
          >
            {/* Map column */}
            <div className="w-full lg:w-[58%] flex-shrink-0">
              <h2 className="text-xl font-bold mb-1 font-serif" style={{ color: '#1A2744' }}>
                Interactive State Map
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Hover over any state to see its RTE compliance details. Click to explore further.
              </p>

              <div
                className="rounded-2xl overflow-hidden shadow-xl"
                style={{ background: 'rgba(255, 248, 221, 1)', padding: '12px 10px 8px' }}
              >
                <IndiaMap
                  statesData={statesData}
                  onStateClick={slug => slug && navigate(`/states/${slug}`)}
                />
              </div>

              {/* Legend */}
              <div className="mt-4 flex flex-wrap gap-3">
                {MAP_LEGEND.map(l => (
                  <div key={l.label} className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                    <span className="inline-block w-3 h-3 rounded-sm" style={{ background: l.color }} />
                    {l.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Rankings column */}
            <div className="flex-1 w-full">
              <h2 className="text-xl font-bold mb-1 font-serif" style={{ color: '#1A2744' }}>
                State Rankings
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Top and bottom performers on RTE compliance.
              </p>

              {loading ? (
                <div className="flex justify-center py-12">
                  <ArrowPathIcon className="w-7 h-7 animate-spin text-gray-400" />
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  {/* Top performers */}
                  <div className="p-5 rounded-2xl" style={{ background: 'rgba(46,125,50,0.08)', border: '1px solid rgba(46,125,50,0.2)' }}>
                    <h3 className="font-semibold text-sm mb-3" style={{ color: '#2E7D32' }}>🏆 Top Performing</h3>
                    <div className="space-y-2">
                      {topStates.length === 0 ? (
                        <p className="text-xs text-gray-400 italic">No data available yet</p>
                      ) : topStates.map((s, i) => (
                        <div key={s._id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                            <span className="font-mono text-xs w-5" style={{ color: '#2E7D32' }}>#{i + 1}</span>
                            <Link to={`/states/${s.slug}`} className="hover:underline">{s.name}</Link>
                          </div>
                          <span className="font-bold text-sm" style={{ color: '#2E7D32' }}>{s.complianceScore}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Needs attention */}
                  <div className="p-5 rounded-2xl" style={{ background: 'rgba(198,40,40,0.06)', border: '1px solid rgba(198,40,40,0.18)' }}>
                    <h3 className="font-semibold text-sm mb-3" style={{ color: '#C62828' }}>⚠️ Needs Attention</h3>
                    <div className="space-y-2">
                      {bottomStates.length === 0 ? (
                        <p className="text-xs text-gray-400 italic">No data available yet</p>
                      ) : bottomStates.map((s, i) => (
                        <div key={s._id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                            <span className="font-mono text-xs w-5" style={{ color: '#C62828' }}>#{i + 1}</span>
                            <Link to={`/states/${s.slug}`} className="hover:underline">{s.name}</Link>
                          </div>
                          <span className="font-bold text-sm" style={{ color: '#C62828' }}>{s.complianceScore}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick stats */}
                  <div className="p-5 rounded-2xl" style={{ background: 'rgba(26,39,68,0.05)', border: '1px solid rgba(26,39,68,0.1)' }}>
                    <h3 className="font-semibold text-sm mb-3" style={{ color: '#1A2744' }}>📊 Overview</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Total States</p>
                        <p className="text-2xl font-bold" style={{ color: '#1A2744' }}>{statesData.length || 36}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Data Available</p>
                        <p className="text-2xl font-bold" style={{ color: '#1A2744' }}>
                          {statesData.filter(s => s.complianceScore).length}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Avg Score</p>
                        <p className="text-2xl font-bold" style={{ color: '#E8872A' }}>
                          {statesData.length
                            ? Math.round(statesData.reduce((acc, s) => acc + (s.complianceScore || 0), 0) / statesData.length)
                            : '—'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Excellent</p>
                        <p className="text-2xl font-bold" style={{ color: '#2E7D32' }}>
                          {statesData.filter(s => (s.complianceScore || 0) >= 75).length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

    </div>
  )
}
