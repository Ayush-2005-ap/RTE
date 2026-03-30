import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronUpIcon, ArrowLeftIcon, CheckBadgeIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import api from '../../services/api'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'react-hot-toast'

export default function QuestionDetailPage() {
  const { id } = useParams()
  const [q, setQ] = useState(null)
  const [answers, setAnswers] = useState([])
  const [loading, setLoading] = useState(true)
  const [answer, setAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [upvoted, setUpvoted] = useState(false)
  const [authorName, setAuthorName] = useState('')

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/questions/${id}`)
        setQ(res.data.data.question)
        setAnswers(res.data.data.answers)
      } catch (err) {
        console.error('Error fetching question:', err)
        toast.error('Failed to load question')
      } finally {
        setLoading(false)
      }
    }
    fetchQuestion()
  }, [id])

  const handleUpvote = async () => {
    if (upvoted) return
    try {
      await api.post(`/questions/${id}/upvote`)
      setQ({ ...q, upvoteCount: q.upvoteCount + 1 })
      setUpvoted(true)
      toast.success('Question upvoted!')
    } catch (err) {
      toast.error('Failed to upvote')
    }
  }

  const handlePostAnswer = async () => {
    if (!answer.trim()) return toast.error('Please write an answer')
    try {
      setSubmitting(true)
      const res = await api.post(`/questions/${id}/answers`, {
        body: answer,
        authorName: authorName || 'Anonymous'
      })
      setAnswers([res.data.data.answer, ...answers])
      setAnswer('')
      setSubmitting(false)
      toast.success('Answer posted!')
    } catch (err) {
      toast.error('Failed to post answer')
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
    </div>
  )

  if (!q) return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-4">Question not found</h2>
        <Link to="/community/questions" className="btn-primary">Back to Forum</Link>
      </div>
    </div>
  )

  return (
    <div style={{ paddingTop: '64px' }}>
      <div className="py-8 px-4" style={{ background: '#F5EFE0', minHeight: '100vh' }}>
        <div className="max-w-3xl mx-auto">
          {/* Back */}
          <Link to="/community/questions" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink mb-6 transition-colors">
            <ArrowLeftIcon className="w-4 h-4" /> Back to questions
          </Link>

          {/* Question */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 mb-6 shadow-card">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="badge-navy text-xs">{q.state}</span>
              <span className="badge-saffron text-xs">{q.category}</span>
              {q.tags?.map(t => (
                <span key={t} className="px-2 py-0.5 rounded-full text-xs"
                  style={{ background: 'rgba(26,39,68,0.06)', color: '#1A2744' }}>#{t}</span>
              ))}
            </div>
            <h1 className="text-h2 font-display mb-4" style={{ color: '#1A2744' }}>{q.title}</h1>
            <div className="prose prose-sm max-w-none text-ink mb-6 whitespace-pre-wrap">
              {q.body}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted">
                <span className="font-semibold text-ink">{q.authorName}</span> · {q.state} · {formatDistanceToNow(new Date(q.createdAt), { addSuffix: true })}
              </div>
              <button onClick={handleUpvote}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: upvoted ? 'rgba(232,135,42,0.12)' : 'rgba(26,39,68,0.06)',
                  color: upvoted ? '#E8872A' : '#888',
                }}>
                <ChevronUpIcon className="w-4 h-4" />
                {q.upvoteCount} Upvotes
              </button>
            </div>
          </motion.div>

          {/* Answers */}
          <h2 className="font-display font-bold text-lg mb-4" style={{ color: '#1A2744' }}>
            {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
          </h2>
          <div className="space-y-5 mb-8">
            {answers.map((a, i) => (
              <motion.div key={a._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-5 shadow-sm border"
                style={{ borderColor: a.isVerified ? 'rgba(46,125,50,0.3)' : 'rgba(26,39,68,0.07)',
                         background: a.isVerified ? 'rgba(46,125,50,0.02)' : 'white' }}>
                {a.isVerified && (
                  <div className="flex items-center gap-1.5 mb-3 text-xs font-semibold" style={{ color: '#2E7D32' }}>
                    <CheckBadgeIcon className="w-4 h-4" /> Verified Answer
                  </div>
                )}
                <div className="prose prose-sm max-w-none text-ink mb-4 whitespace-pre-wrap">
                  {a.body}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted">
                    <span className="font-semibold text-ink">{a.authorName}</span> · {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted">
                    <ChevronUpIcon className="w-3.5 h-3.5" /> {a.upvoteCount}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Post Answer */}
          <div className="bg-white rounded-2xl p-5 shadow-card">
            <h3 className="font-semibold text-ink mb-3">Post your answer</h3>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-muted mb-1">Your Name (Optional)</label>
              <input type="text" value={authorName} onChange={e => setAuthorName(e.target.value)}
                placeholder="Anonymous" className="input-rte text-sm py-2" />
            </div>
            <textarea value={answer} onChange={e => setAnswer(e.target.value)}
              placeholder="Share your knowledge or experience…"
              rows={5} className="input-rte resize-none mb-3" />
            <button onClick={handlePostAnswer} disabled={submitting} className="btn-primary flex items-center gap-2">
              <PaperAirplaneIcon className="w-4 h-4" /> {submitting ? 'Posting...' : 'Post Answer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
