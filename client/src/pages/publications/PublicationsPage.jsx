import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MagnifyingGlassIcon, DocumentArrowDownIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import api from '../../services/api'
import { toast } from 'react-hot-toast'

const categories = ['All', 'Research', 'Policy Guide', 'Report', 'Legal', 'Other']

export default function PublicationsPage() {
  const [publications, setPublications] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  useEffect(() => {
    fetchPublications()
  }, [])

  const fetchPublications = async () => {
    try {
      setLoading(true)
      const res = await api.get('/publications?limit=50')
      setPublications(res.data.data.publications)
    } catch {
      toast.error('Failed to load publications')
    } finally {
      setLoading(false)
    }
  }

  const filtered = publications.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) &&
    (category === 'All' || p.category === category.toLowerCase())
  )

  const handleDownload = async (pub) => {
    try {
      // Trigger download tracking
      await api.get(`/publications/${pub._id}/download`)
      window.open(pub.pdfUrl, '_blank')
      
      // Update local count visually
      setPublications(publications.map(p => 
        p._id === pub._id ? { ...p, downloads: p.downloads + 1 } : p
      ))
    } catch {
      toast.error('Failed to track download')
      window.open(pub.pdfUrl, '_blank') // still open even if tracking fails test
    }
  }

  return (
    <div style={{ paddingTop: '64px' }}>
      <div className="py-12 px-4" style={{ background: 'linear-gradient(135deg,#1A2744,#243356)' }}>
        <div className="max-w-6xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest mb-2 block" style={{ color: '#E8872A' }}>RTE Resources</span>
          <h1 className="text-h1 text-white" style={{ fontFamily: "'Playfair Display',serif" }}>Publications</h1>
          <p className="text-white/60 text-sm mt-2 max-w-lg">In-depth research reports, policy guides, and legal documents.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="py-4 px-4 bg-white border-b" style={{ borderColor: 'rgba(26,39,68,0.08)' }}>
        <div className="max-w-6xl mx-auto space-y-3">
          <div className="relative max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search publications…" value={search} onChange={e => setSearch(e.target.value)} className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2744]" />
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
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="py-10 px-4 min-h-[50vh]" style={{ background: '#F5EFE0' }}>
        <div className="max-w-6xl mx-auto">
          {loading ? (
             <div className="flex justify-center py-20"><ArrowPathIcon className="w-8 h-8 animate-spin text-gray-400" /></div>
          ) : filtered.length === 0 ? (
             <div className="text-center py-20 text-gray-500">No publications found.</div>
          ) : (
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filtered.map((pub, i) => (
                 <motion.div key={pub._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="h-full">
                    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border h-full flex flex-col" style={{ borderColor: 'rgba(26,39,68,0.07)' }}>
                       {pub.thumbnailUrl ? (
                         <div className="h-44 w-full mb-5 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
                           <img src={pub.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                         </div>
                       ) : (
                         <div className="h-44 w-full mb-5 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center text-gray-300">
                             <DocumentArrowDownIcon className="w-16 h-16 opacity-30" />
                         </div>
                       )}
                       
                       <div className="flex-1 flex flex-col">
                         <div className="flex gap-2 mb-3">
                           <span className="text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider bg-blue-50 text-blue-700">
                             {pub.category}
                           </span>
                           <span className="text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider bg-gray-100 text-gray-600">
                             {new Date(pub.publishedAt || pub.createdAt).getFullYear()}
                           </span>
                         </div>
                         <h3 className="font-bold text-lg text-gray-900 leading-snug mb-2 font-serif">{pub.title}</h3>
                         <p className="text-sm text-gray-500 line-clamp-3 mb-6">{pub.description}</p>
                         
                         <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                             <div className="text-xs font-semibold text-gray-400">
                                 {pub.downloads} {pub.downloads === 1 ? 'Download' : 'Downloads'}
                             </div>
                             <button onClick={() => handleDownload(pub)} className="flex items-center gap-2 px-4 py-2 bg-[#E8872A] hover:bg-[#d07823] text-white rounded-xl text-sm font-semibold transition-colors">
                                 <DocumentArrowDownIcon className="w-4 h-4" /> Download
                             </button>
                         </div>
                       </div>
                    </div>
                 </motion.div>
               ))}
             </div>
          )}
        </div>
      </div>
    </div>
  )
}
