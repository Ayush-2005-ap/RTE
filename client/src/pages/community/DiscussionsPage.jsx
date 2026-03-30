import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChatBubbleLeftRightIcon, PlusIcon } from '@heroicons/react/24/outline'
import api from '../../services/api'
import { formatDistanceToNow } from 'date-fns'

export default function DiscussionsPage() {
  const [discussions, setDiscussions] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        setLoading(true)
        const res = await api.get('/questions?limit=20&sort=popular')
        setDiscussions(res.data.data.questions)
      } catch (err) {
        console.error('Error fetching discussions:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDiscussions()
  }, [])

  return (
    <div style={{ paddingTop: '64px' }}>
      <div className="py-12 px-4" style={{ background: 'linear-gradient(135deg,#1A2744,#243356)' }}>
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest mb-2 block" style={{ color: '#E8872A' }}>Community</span>
            <h1 className="text-h1 text-white" style={{ fontFamily: "'Playfair Display',serif" }}>Discussions</h1>
            <p className="text-white/60 text-sm mt-1">Open conversations about RTE implementation and advocacy</p>
          </div>
          <Link to="/community/ask" className="btn-primary whitespace-nowrap">
            <PlusIcon className="w-4 h-4" /> Start Discussion
          </Link>
        </div>
      </div>

      <div className="py-8 px-4" style={{ background: '#F5EFE0', minHeight: '60vh' }}>
        <div className="max-w-4xl mx-auto space-y-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
            </div>
          ) : (
            discussions.map((d, i) => (
              <motion.div key={d._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                <Link to={`/community/questions/${d._id}`}>
                  <div className="bg-white rounded-2xl p-5 card-hover border"
                    style={{ borderColor: d.isPinned ? 'rgba(232,135,42,0.3)' : 'rgba(26,39,68,0.07)',
                             background: d.isPinned ? 'rgba(232,135,42,0.02)' : 'white' }}>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: d.isPinned ? 'rgba(232,135,42,0.12)' : 'rgba(26,39,68,0.06)' }}>
                        <ChatBubbleLeftRightIcon className="w-5 h-5"
                          style={{ color: d.isPinned ? '#E8872A' : '#888' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap gap-2 mb-1.5">
                          {d.isPinned && <span className="badge text-xs" style={{ background: 'rgba(232,135,42,0.15)', color: '#E8872A', padding: '2px 8px', borderRadius: '99px', fontSize: '11px' }}>📌 Pinned</span>}
                          <span className="badge-muted text-xs">{d.category}</span>
                          <span className="badge-muted text-xs">{d.state}</span>
                        </div>
                        <h3 className="font-semibold text-ink leading-snug mb-2">{d.title}</h3>
                        <div className="text-xs text-muted">
                          by {d.authorName} · {formatDistanceToNow(new Date(d.createdAt), { addSuffix: true })} ·{' '}
                          <span className="font-semibold" style={{ color: '#1A2744' }}>{d.answerCount} replies</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
          {!loading && discussions.length === 0 && (
            <div className="text-center py-20 text-muted">
              <p>No discussions found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
