import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MagnifyingGlassIcon, FunnelIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

const statesData = [
  { name: 'Andhra Pradesh',     slug: 'andhra-pradesh',    score: 62, region: 'South' },
  { name: 'Arunachal Pradesh',  slug: 'arunachal-pradesh', score: 41, region: 'North East' },
  { name: 'Assam',              slug: 'assam',             score: 49, region: 'North East' },
  { name: 'Bihar',              slug: 'bihar',             score: 34, region: 'East' },
  { name: 'Chhattisgarh',       slug: 'chhattisgarh',      score: 53, region: 'Central' },
  { name: 'Goa',                slug: 'goa',               score: 77, region: 'West' },
  { name: 'Gujarat',            slug: 'gujarat',           score: 69, region: 'West' },
  { name: 'Haryana',            slug: 'haryana',           score: 64, region: 'North' },
  { name: 'Himachal Pradesh',   slug: 'himachal-pradesh',  score: 84, region: 'North' },
  { name: 'Jharkhand',          slug: 'jharkhand',         score: 39, region: 'East' },
  { name: 'Karnataka',          slug: 'karnataka',         score: 72, region: 'South' },
  { name: 'Kerala',             slug: 'kerala',            score: 91, region: 'South' },
  { name: 'Madhya Pradesh',     slug: 'madhya-pradesh',    score: 58, region: 'Central' },
  { name: 'Maharashtra',        slug: 'maharashtra',       score: 65, region: 'West' },
  { name: 'Manipur',            slug: 'manipur',           score: 44, region: 'North East' },
  { name: 'Meghalaya',          slug: 'meghalaya',         score: 47, region: 'North East' },
  { name: 'Mizoram',            slug: 'mizoram',           score: 55, region: 'North East' },
  { name: 'Nagaland',           slug: 'nagaland',          score: 43, region: 'North East' },
  { name: 'Odisha',             slug: 'odisha',            score: 57, region: 'East' },
  { name: 'Punjab',             slug: 'punjab',            score: 68, region: 'North' },
  { name: 'Rajasthan',          slug: 'rajasthan',         score: 55, region: 'North' },
  { name: 'Sikkim',             slug: 'sikkim',            score: 70, region: 'North East' },
  { name: 'Tamil Nadu',         slug: 'tamil-nadu',        score: 79, region: 'South' },
  { name: 'Telangana',          slug: 'telangana',         score: 66, region: 'South' },
  { name: 'Tripura',            slug: 'tripura',           score: 52, region: 'North East' },
  { name: 'Uttar Pradesh',      slug: 'uttar-pradesh',     score: 38, region: 'North' },
  { name: 'Uttarakhand',        slug: 'uttarakhand',       score: 62, region: 'North' },
  { name: 'West Bengal',        slug: 'west-bengal',       score: 60, region: 'East' },
  { name: 'Delhi',              slug: 'delhi',             score: 71, region: 'North' },
  { name: 'Jammu & Kashmir',    slug: 'jammu-kashmir',     score: 48, region: 'North' },
  { name: 'Ladakh',             slug: 'ladakh',            score: 46, region: 'North' },
  { name: 'Chandigarh',         slug: 'chandigarh',        score: 73, region: 'North' },
  { name: 'Puducherry',         slug: 'puducherry',        score: 75, region: 'South' },
  { name: 'Andaman & Nicobar',  slug: 'andaman-nicobar',   score: 59, region: 'Islands' },
  { name: 'Lakshadweep',        slug: 'lakshadweep',       score: 63, region: 'Islands' },
  { name: 'Dadra & NH',         slug: 'dadra-nh',          score: 60, region: 'West' },
]

const regions = ['All', 'North', 'South', 'East', 'West', 'Central', 'North East', 'Islands']

function scoreColor(score) {
  if (score >= 75) return { bg: 'rgba(46,125,50,0.1)', text: '#2E7D32', bar: '#2E7D32', label: 'Excellent' }
  if (score >= 60) return { bg: 'rgba(46,125,50,0.07)', text: '#558B2F', bar: '#558B2F', label: 'Good' }
  if (score >= 45) return { bg: 'rgba(232,135,42,0.12)', text: '#E8872A', bar: '#E8872A', label: 'Average' }
  return { bg: 'rgba(198,40,40,0.1)', text: '#C62828', bar: '#C62828', label: 'Poor' }
}

export default function StatesListPage() {
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('All')
  const [sort, setSort] = useState('score-desc')

  const filtered = statesData
    .filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) &&
      (region === 'All' || s.region === region)
    )
    .sort((a, b) => {
      if (sort === 'score-desc') return b.score - a.score
      if (sort === 'score-asc') return a.score - b.score
      return a.name.localeCompare(b.name)
    })

  const topStates = [...statesData].sort((a,b) => b.score - a.score).slice(0, 3)
  const bottomStates = [...statesData].sort((a,b) => a.score - b.score).slice(0, 3)

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

      {/* Best / Worst */}
      <div className="py-8 px-4" style={{ background: '#F5EFE0' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl" style={{ background: 'rgba(46,125,50,0.08)', border: '1px solid rgba(46,125,50,0.2)' }}>
              <h3 className="font-semibold text-sm mb-3" style={{ color: '#2E7D32' }}>🏆 Top Performing</h3>
              <div className="space-y-2">
                {topStates.map((s, i) => (
                  <div key={s.slug} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-ink">
                      <span className="font-mono-rte font-bold text-xs w-5" style={{ color: '#2E7D32' }}>#{i+1}</span>
                      {s.name}
                    </div>
                    <span className="font-bold text-sm" style={{ color: '#2E7D32' }}>{s.score}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-5 rounded-2xl" style={{ background: 'rgba(198,40,40,0.06)', border: '1px solid rgba(198,40,40,0.18)' }}>
              <h3 className="font-semibold text-sm mb-3" style={{ color: '#C62828' }}>⚠️ Needs Attention</h3>
              <div className="space-y-2">
                {bottomStates.map((s) => (
                  <div key={s.slug} className="flex items-center justify-between">
                    <Link to={`/states/${s.slug}`} className="text-sm text-ink hover:underline">{s.name}</Link>
                    <span className="font-bold text-sm" style={{ color: '#C62828' }}>{s.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="py-6 px-4 bg-white border-b" style={{ borderColor: 'rgba(26,39,68,0.08)' }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search states…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-rte pl-9 text-sm py-2.5"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {regions.map(r => (
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
            className="input-rte text-sm py-2.5 w-auto"
            style={{ maxWidth: '180px' }}
          >
            <option value="score-desc">Score: High → Low</option>
            <option value="score-asc">Score: Low → High</option>
            <option value="name">Name A → Z</option>
          </select>
        </div>
      </div>

      {/* State Grid */}
      <div className="py-10 px-4" style={{ background: '#F5EFE0' }}>
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-muted mb-6">{filtered.length} states found</p>
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            layout
          >
            {filtered.map((state, i) => {
              const c = scoreColor(state.score)
              return (
                <motion.div
                  key={state.slug}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  layout
                >
                  <Link to={`/states/${state.slug}`}>
                    <div className="p-5 rounded-2xl card-hover bg-white border h-full"
                      style={{ borderColor: 'rgba(26,39,68,0.08)' }}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-ink text-sm leading-snug">{state.name}</h3>
                          <p className="text-xs text-muted mt-0.5">{state.region}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-xl" style={{ color: c.text }}>{state.score}</div>
                          <div className="text-xs font-semibold" style={{ color: c.text }}>{c.label}</div>
                        </div>
                      </div>
                      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(26,39,68,0.07)' }}>
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${state.score}%`, background: c.bar }} />
                      </div>
                      <div className="mt-3 flex justify-end">
                        <span className="text-xs text-muted flex items-center gap-1">
                          View <ArrowRightIcon className="w-3 h-3" />
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
    </div>
  )
}
