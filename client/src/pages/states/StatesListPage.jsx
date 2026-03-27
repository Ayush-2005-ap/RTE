import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MagnifyingGlassIcon, ArrowRightIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import api from '../../services/api'
import { toast } from 'react-hot-toast'
import IndiaMap from '../../components/ui/IndiaMap'

const regionsList = ['All', 'North', 'South', 'East', 'West', 'Central', 'Northeast', 'UT']

function scoreColor(score) {
  if (score >= 75) return { bg: 'rgba(46,125,50,0.1)', text: '#2E7D32', bar: '#2E7D32', label: 'Excellent' }
  if (score >= 60) return { bg: 'rgba(46,125,50,0.07)', text: '#558B2F', bar: '#558B2F', label: 'Good' }
  if (score >= 45) return { bg: 'rgba(232,135,42,0.12)', text: '#E8872A', bar: '#E8872A', label: 'Average' }
  return { bg: 'rgba(198,40,40,0.1)', text: '#C62828', bar: '#C62828', label: 'Poor' }
}

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
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('All')
  const [sort, setSort] = useState('score-desc')

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

  const filtered = statesData
    .filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) &&
      (region === 'All' || s.region === region)
    )
    .sort((a, b) => {
      if (sort === 'score-desc') return (b.complianceScore || 0) - (a.complianceScore || 0)
      if (sort === 'score-asc') return (a.complianceScore || 0) - (b.complianceScore || 0)
      return a.name.localeCompare(b.name)
    })

  const topStates = [...statesData].sort((a,b) => (b.complianceScore||0) - (a.complianceScore||0)).slice(0, 3)
  const bottomStates = [...statesData].sort((a,b) => (a.complianceScore||0) - (b.complianceScore||0)).slice(0, 3)

  return (
    <div style={{ paddingTop: '64px' }}>
      {/* Page Header */}
      <div className="py-16 px-4" style={{ background: 'linear-gradient(135deg,#1A2744,#243356)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="text-xs font-semibold uppercase tracking-widest mb-3 block" style={{ color: '#E8872A' }}>State Dashboard</span>
            <h1 className="text-h1 text-white mb-3" style={{ fontFamily: "'Playfair Display',serif" }}>RTE Compliance Tracker</h1>
            <p className="text-white/60 max-w-xl">Explore how all 36 states and UTs are performing on Right to Education Act implementation.</p>
          </motion.div>
        </div>
      </div>

      {/* Interactive India Map Section */}
      <div className="py-12 px-4" style={{ background: '#F5EFE0' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col lg:flex-row gap-8 items-start"
          >
            {/* Map */}
            <div className="w-full lg:w-[58%] flex-shrink-0">
              <h2
                className="text-xl font-bold mb-1 font-serif"
                style={{ color: '#1A2744' }}
              >
                Interactive State Map
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Hover over any state to see its RTE compliance details. Click to explore further.
              </p>

              <div
                className="rounded-2xl overflow-hidden shadow-xl"
                style={{ background: 'linear-gradient(160deg, #0D1729 0%, #1A2744 100%)', padding: '12px 10px 8px' }}
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
                    <span
                      className="inline-block w-3 h-3 rounded-sm"
                      style={{ background: l.color }}
                    />
                    {l.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Best / Worst panels on right side */}
            <div className="flex-1 w-full">
              <h2
                className="text-xl font-bold mb-1 font-serif"
                style={{ color: '#1A2744' }}
              >
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
                  <div className="p-5 rounded-2xl" style={{ background: 'rgba(46,125,50,0.08)', border: '1px solid rgba(46,125,50,0.2)' }}>
                    <h3 className="font-semibold text-sm mb-3" style={{ color: '#2E7D32' }}>🏆 Top Performing</h3>
                    <div className="space-y-2">
                      {topStates.length === 0 ? (
                        <p className="text-xs text-gray-400 italic">No data available yet</p>
                      ) : topStates.map((s, i) => (
                        <div key={s._id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                            <span className="font-mono text-xs w-5" style={{ color: '#2E7D32' }}>#{i+1}</span>
                            <Link to={`/states/${s.slug}`} className="hover:underline">{s.name}</Link>
                          </div>
                          <span className="font-bold text-sm" style={{ color: '#2E7D32' }}>{s.complianceScore}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl" style={{ background: 'rgba(198,40,40,0.06)', border: '1px solid rgba(198,40,40,0.18)' }}>
                    <h3 className="font-semibold text-sm mb-3" style={{ color: '#C62828' }}>⚠️ Needs Attention</h3>
                    <div className="space-y-2">
                      {bottomStates.length === 0 ? (
                        <p className="text-xs text-gray-400 italic">No data available yet</p>
                      ) : bottomStates.map((s, i) => (
                        <div key={s._id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                            <span className="font-mono text-xs w-5" style={{ color: '#C62828' }}>#{i+1}</span>
                            <Link to={`/states/${s.slug}`} className="hover:underline">{s.name}</Link>
                          </div>
                          <span className="font-bold text-sm" style={{ color: '#C62828' }}>{s.complianceScore}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 bg-[#F5EFE0] min-h-[50vh]"><ArrowPathIcon className="w-8 h-8 animate-spin text-gray-400" /></div>
      ) : (
        <>

          {/* Filters */}
          <div className="py-6 px-4 bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search states…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A2744]"
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {regionsList.map(r => (
                  <button key={r} onClick={() => setRegion(r)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                    style={{
                      background: region === r ? '#1A2744' : 'white',
                      color: region === r ? 'white' : '#1A2744',
                      borderColor: region === r ? '#1A2744' : 'rgba(26,39,68,0.15)',
                    }}>
                    {r}
                  </button>
                ))}
              </div>
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="text-sm py-2.5 px-3 border border-gray-200 rounded-xl outline-none"
              >
                <option value="score-desc">Score: High → Low</option>
                <option value="score-asc">Score: Low → High</option>
                <option value="name">Name A → Z</option>
              </select>
            </div>
          </div>

          {/* State Grid */}
          <div className="py-10 px-4 min-h-[50vh]" style={{ background: '#F5EFE0' }}>
            <div className="max-w-7xl mx-auto">
              <p className="text-sm text-gray-500 mb-6 font-semibold">{filtered.length} states found</p>
              <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5" layout>
                {filtered.map((state, i) => {
                  const score = state.complianceScore || 0
                  const c = scoreColor(score)
                  return (
                    <motion.div key={state._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} layout>
                      <Link to={`/states/${state.slug}`}>
                        <div className="p-5 rounded-2xl hover:shadow-md bg-white border border-gray-100 h-full transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-gray-900 text-sm leading-snug">{state.name}</h3>
                              <p className="text-xs text-gray-500 mt-0.5">{state.region}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-xl" style={{ color: c.text }}>{score}</div>
                              <div className="text-[10px] uppercase tracking-wider font-bold" style={{ color: c.text }}>{state.complianceLabel || c.label}</div>
                            </div>
                          </div>
                          <div className="w-full h-1.5 rounded-full overflow-hidden bg-gray-100">
                            <div className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${score}%`, background: c.bar }} />
                          </div>
                          <div className="mt-4 flex justify-end">
                            <span className="text-xs text-gray-400 font-semibold hover:text-[#E8872A] flex items-center gap-1 transition-colors">
                              View Details <ArrowRightIcon className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </motion.div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
