import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MagnifyingGlassIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

const newsData = [
  { id: 1, title: 'Centre Releases Annual RTE Compliance Report 2024-25', summary: 'The Ministry of Education released its annual report showing marginal improvement in RTE implementation across states. Kerala, Himachal Pradesh and Tamil Nadu top the charts.', state: 'National', category: 'Policy', date: 'Mar 10, 2025', source: 'Ministry of Education' },
  { id: 2, title: 'Kerala Achieves 95% Enrollment Under RTE Provisions', summary: 'Kerala has achieved a record 95% enrollment rate for children from economically weaker sections under the RTE Act, making it the best performing state for the third consecutive year.', state: 'Kerala', category: 'Achievement', date: 'Mar 8, 2025', source: 'The Hindu' },
  { id: 3, title: 'UP Govt Allocates ₹2,400 Cr for School Infrastructure Under RTE', summary: 'The Uttar Pradesh government has announced a ₹2,400 crore fund for upgrading school infrastructure to meet RTE norms across the state\'s 1.6 lakh government schools.', state: 'Uttar Pradesh', category: 'Budget', date: 'Mar 6, 2025', source: 'Times of India' },
  { id: 4, title: 'Private Schools Sue Against RTE 25% Quota in Gujarat High Court', summary: 'A group of private unaided schools in Gujarat has filed a petition challenging the implementation modalities of the 25% EWS quota under RTE Section 12(1)(c).', state: 'Gujarat', category: 'Legal', date: 'Mar 4, 2025', source: 'Indian Express' },
  { id: 5, title: 'Delhi Launches Digital RTE Application Portal for 2025-26 Admissions', summary: "Delhi government launches a new online portal for seamless RTE admissions, enabling parents to apply from their smartphones without visiting government offices.", state: 'Delhi', category: 'Technology', date: 'Feb 28, 2025', source: 'Hindustan Times' },
  { id: 6, title: 'Supreme Court Directs States to Ensure Teacher Pupil Ratio Under RTE', summary: 'The Supreme Court bench has directed all states to file compliance reports on teacher-pupil ratios as mandated under Schedule of the RTE Act, 2009.', state: 'National', category: 'Legal', date: 'Feb 22, 2025', source: 'LiveLaw' },
]

const categories = ['All', 'Policy', 'Achievement', 'Budget', 'Legal', 'Technology']
const stateFilters = ['All', 'National', 'Kerala', 'Uttar Pradesh', 'Gujarat', 'Delhi', 'Maharashtra']

function categoryColor(cat) {
  const m = { Policy: '#1A2744', Achievement: '#2E7D32', Budget: '#E8872A', Legal: '#C62828', Technology: '#558B2F' }
  return m[cat] || '#888'
}

export default function NewsPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [state, setState] = useState('All')

  const filtered = newsData.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) &&
    (category === 'All' || n.category === category) &&
    (state === 'All' || n.state === state)
  )

  return (
    <div style={{ paddingTop: '64px' }}>
      <div className="py-12 px-4" style={{ background: 'linear-gradient(135deg,#1A2744,#243356)' }}>
        <div className="max-w-6xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest mb-2 block" style={{ color: '#E8872A' }}>News & Updates</span>
          <h1 className="text-h1 text-white" style={{ fontFamily: "'Playfair Display',serif" }}>RTE News Archive</h1>
          <p className="text-white/60 text-sm mt-2 max-w-lg">Stay current with RTE Act developments, court orders, state policies, and achievements.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="py-4 px-4 bg-white border-b" style={{ borderColor: 'rgba(26,39,68,0.08)' }}>
        <div className="max-w-6xl mx-auto space-y-3">
          <div className="relative max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input type="text" placeholder="Search news…" value={search} onChange={e => setSearch(e.target.value)} className="input-rte pl-9 text-sm py-2.5" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                style={{
                  background: category === c ? '#1A2744' : 'white',
                  color: category === c ? 'white' : '#888',
                  borderColor: category === c ? '#1A2744' : 'rgba(26,39,68,0.12)'
                }}>
                {c}
              </button>
            ))}
            <div className="ml-auto">
              <select value={state} onChange={e => setState(e.target.value)} className="input-rte text-sm py-1.5" style={{ maxWidth: '180px' }}>
                {stateFilters.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* News Grid */}
      <div className="py-10 px-4" style={{ background: '#F5EFE0' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((n, i) => (
              <motion.div key={n.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                <Link to={`/news/${n.id}`}>
                  <div className="bg-white rounded-2xl p-5 card-hover border h-full flex flex-col"
                    style={{ borderColor: 'rgba(26,39,68,0.07)' }}>
                    <div className="flex gap-2 mb-3">
                      <span className="badge text-xs px-2.5 py-1 rounded-full font-semibold"
                        style={{ background: categoryColor(n.category) + '15', color: categoryColor(n.category) }}>
                        {n.category}
                      </span>
                      <span className="badge-navy text-xs">{n.state}</span>
                    </div>
                    <h3 className="font-semibold text-ink leading-snug mb-2 flex-1">{n.title}</h3>
                    <p className="text-sm text-muted line-clamp-2 mb-4">{n.summary}</p>
                    <div className="flex items-center justify-between mt-auto pt-2 border-t" style={{ borderColor: 'rgba(26,39,68,0.06)' }}>
                      <span className="text-xs text-muted">{n.source} · {n.date}</span>
                      <ArrowRightIcon className="w-3.5 h-3.5 text-muted" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted">No news found.</div>
          )}
        </div>
      </div>
    </div>
  )
}
