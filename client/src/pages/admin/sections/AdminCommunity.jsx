import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrashIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import api from '../../../services/api'
import { toast } from 'react-hot-toast'

export default function AdminCommunity() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loadingAction, setLoadingAction] = useState(null)

  useEffect(() => { fetchQuestions() }, [page])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/questions?page=${page}&limit=10`)
      setQuestions(res.data.data.questions)
      setTotalPages(res.data.data.totalPages)
    } catch { toast.error('Failed to load questions') }
    finally { setLoading(false) }
  }

  const handleDeleteQ = async (id) => {
    if (!confirm('Delete this question and all its answers permanently?')) return
    try {
      setLoadingAction(id)
      await api.delete(`/questions/${id}`)
      toast.success('Question deleted')
      fetchQuestions()
    } catch { toast.error('Failed to delete') }
    finally { setLoadingAction(null) }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#1A2744' }}>Community Moderation</h1>
        <p className="text-sm text-gray-500 mt-1">Manage Q&A, remove inappropriate content</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden p-6">
        <h2 className="font-semibold text-lg text-gray-800 mb-4 border-b pb-4">Recent Questions</h2>
        
        {loading ? (
          <div className="flex justify-center py-8"><ArrowPathIcon className="w-8 h-8 animate-spin text-gray-300" /></div>
        ) : questions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No questions found.</div>
        ) : (
          <div className="space-y-4">
            {questions.map((q) => (
              <div key={q._id} className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 text-lg mb-1">{q.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">"{q.body}"</p>
                    
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <span className="font-semibold text-gray-700">{q.authorName}</span>
                        <span>•</span>
                        <span>{new Date(q.createdAt).toLocaleString()}</span>
                        <span>•</span>
                        <span className="text-orange-600 font-semibold bg-orange-50 px-2 py-0.5 rounded-full">{q.category}</span>
                        <span>•</span>
                        <span className={`${q.status === 'answered' ? 'text-green-600' : 'text-gray-500'} font-semibold`}>{q.answerCount} answers</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <a href={`/community/questions/${q._id}`} target="_blank" rel="noreferrer" className="text-xs font-semibold text-blue-600 hover:underline">View Full Thread →</a>
                    <button 
                        onClick={() => handleDeleteQ(q._id)} 
                        disabled={loadingAction === q._id}
                        className="flex items-center gap-1.5 px-3 py-1.5 mt-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                        <TrashIcon className="w-4 h-4" /> Delete Question
                    </button>
                  </div>
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
