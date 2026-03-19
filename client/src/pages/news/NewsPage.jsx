import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MagnifyingGlassIcon, ArrowRightIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import api from '../../services/api'
import { toast } from 'react-hot-toast'

const categories = ['All', 'policy', 'infrastructure', 'teacher', 'curriculum', 'admission', 'funding', 'governance', 'other']
const stateFilters = ['All', 'All India', 'Andhra Pradesh', 'Assam', 'Bihar', 'Delhi', 'Gujarat', 'Karnataka', 'Kerala', 'Maharashtra', 'Uttar Pradesh']

function categoryColor(cat) {
  const m = { policy: '#1A2744', infrastructure: '#2E7D32', funding: '#E8872A', governance: '#C62828', teacher: '#558B2F' }
  return m[cat?.toLowerCase()] || '#888'
}

export default function NewsPage() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [stateFilter, setStateFilter] = useState('All')

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      setLoading(true)
      const res = await api.get('/news?limit=50')
      setNews(res.data.data.news)
    } catch {
      toast.error('Failed to load news')
    } finally {
      setLoading(false)
    }
  }

  const filtered = news.filter(n =>
    n.title?.toLowerCase().includes(search.toLowerCase()) &&
    (category === 'All' || n.category === category) &&
    (stateFilter === 'All' || n.state === stateFilter)
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
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search news…" value={search} onChange={e => setSearch(e.target.value)} className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2744]" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all capitalize"
                style={{
                  background: category === c ? '#1A2744' : 'white',
                  color: category === c ? 'white' : '#888',
                  borderColor: category === c ? '#1A2744' : 'rgba(26,39,68,0.12)'
                }}>
                {c}
              </button>
            ))}
            <div className="ml-auto">
              <select value={stateFilter} onChange={e => setStateFilter(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none" style={{ maxWidth: '180px' }}>
                {stateFilters.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* News Grid */}
      <div className="py-10 px-4 min-h-[50vh]" style={{ background: '#F5EFE0' }}>
        <div className="max-w-6xl mx-auto">
          {loading ? (
             <div className="flex justify-center py-20"><ArrowPathIcon className="w-8 h-8 animate-spin text-gray-400" /></div>
          ) : filtered.length === 0 ? (
             <div className="text-center py-20 text-gray-500">No news articles found.</div>
          ) : (
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
               {filtered.map((n, i) => (
                 <motion.div key={n._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="h-full">
                   <Link to={`/news/${n._id}`} className="block h-full">
                     <div className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow border h-full flex flex-col" style={{ borderColor: 'rgba(26,39,68,0.07)' }}>
                       {n.imageUrl && (
                         <div className="h-40 w-full overflow-hidden">
                           <img src={n.imageUrl} alt="" className="w-full h-full object-cover" />
                         </div>
                       )}
                       <div className="p-5 flex-1 flex flex-col">
                         <div className="flex gap-2 mb-3">
                           <span className="text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider" style={{ background: categoryColor(n.category) + '15', color: categoryColor(n.category) }}>
                             {n.category}
                           </span>
                           <span className="text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider bg-gray-100 text-gray-600">
                             {n.state}
                           </span>
                         </div>
                         <h3 className="font-semibold text-lg text-gray-900 leading-snug mb-2">{n.title}</h3>
                         <p className="text-sm text-gray-500 line-clamp-2 mb-4">{n.summary}</p>
                         <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                           <span className="text-xs text-gray-400">{n.source} · {new Date(n.publishedAt).toLocaleDateString()}</span>
                           <ArrowRightIcon className="w-4 h-4 text-gray-400" />
                         </div>
                       </div>
                     </div>
                   </Link>
                 </motion.div>
               ))}
             </div>
          )}
        </div>
      </div>
    </div>
  )
}
