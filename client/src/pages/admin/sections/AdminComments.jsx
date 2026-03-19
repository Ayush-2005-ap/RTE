import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import api from '../../../services/api'
import { toast } from 'react-hot-toast'

export default function AdminComments() {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => { fetchComments() }, [page])

  const fetchComments = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/comments/all?page=${page}&limit=20`)
      setComments(res.data.data.comments)
      setTotalPages(res.data.data.totalPages)
    } catch { toast.error('Failed to load comments') }
    finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this comment permanently?')) return
    try {
      await api.delete(`/comments/${id}`)
      toast.success('Comment deleted')
      fetchComments()
    } catch { toast.error('Failed to delete') }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#1A2744' }}>Comments Moderation</h1>
        <p className="text-sm text-gray-500 mt-1">Review and delete comments on Blog Posts and News articles</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden p-6">
        {loading ? (
          <div className="flex justify-center py-8"><ArrowPathIcon className="w-8 h-8 animate-spin text-gray-300" /></div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No comments found.</div>
        ) : (
          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c._id} className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold text-gray-800">{c.authorName}</span>
                      <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full ${c.contentType === 'blog' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                        {c.contentType}
                      </span>
                      <span className="text-xs text-gray-400">• {new Date(c.createdAt).toLocaleString()}</span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">"{c.body}"</p>
                    
                    <div className="text-xs text-gray-500">
                        Posted on: <span className="font-semibold">{c.contentId?.title || 'Unknown Post (Might be deleted)'}</span>
                    </div>
                  </div>
                  
                  <button 
                      onClick={() => handleDelete(c._id)} 
                      className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  >
                      <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-6">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${p === page ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                style={p === page ? { background: '#1A2744' } : {}}>{p}</button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
