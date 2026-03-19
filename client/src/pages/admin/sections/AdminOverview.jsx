import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowPathIcon, NewspaperIcon, DocumentTextIcon, BookOpenIcon, ChatBubbleLeftRightIcon, UsersIcon, ChatBubbleOvalLeftIcon } from '@heroicons/react/24/outline'
import api from '../../../services/api'
import { toast } from 'react-hot-toast'

const CARD_COLORS = ['#1A2744', '#E8872A', '#2E7D32', '#7B1FA2', '#1565C0', '#C62828', '#00695C']

export default function AdminOverview() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchStats() }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const res = await api.get('/stats/admin')
      if (res.data.status === 'success') setData(res.data.data)
    } catch {
      toast.error('Failed to load dashboard statistics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24">
      <ArrowPathIcon className="w-10 h-10 animate-spin" style={{ color: '#1A2744' }} />
      <p className="mt-4 text-sm font-semibold text-gray-500">Loading Dashboard...</p>
    </div>
  )

  const s = data?.summary || {}
  const g = data?.growth || {}

  const statCards = [
    { label: 'Total Users',    value: s.totalUsers || 0,         sub: `+${g.usersThisWeek || 0} this week`,    icon: UsersIcon,               color: CARD_COLORS[0] },
    { label: 'News Articles',  value: s.totalNews || 0,          sub: `+${g.newsThisWeek || 0} this week`,     icon: NewspaperIcon,            color: CARD_COLORS[1] },
    { label: 'Blog Posts',     value: s.totalBlogs || 0,         sub: `+${g.blogsThisWeek || 0} this week`,    icon: DocumentTextIcon,         color: CARD_COLORS[2] },
    { label: 'Publications',   value: s.totalPublications || 0,  sub: 'PDFs uploaded',                          icon: BookOpenIcon,             color: CARD_COLORS[3] },
    { label: 'Q&A Questions',  value: s.totalQuestions || 0,     sub: `+${g.questionsThisWeek || 0} this week`, icon: ChatBubbleLeftRightIcon,  color: CARD_COLORS[4] },
    { label: 'Comments',       value: s.totalComments || 0,      sub: 'across blog & news',                     icon: ChatBubbleOvalLeftIcon,   color: CARD_COLORS[5] },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1A2744' }}>Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, Admin.</p>
        </div>
        <button onClick={fetchStats} className="p-2 bg-white rounded-xl shadow-sm hover:shadow transition-shadow">
          <ArrowPathIcon className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {statCards.map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-white p-5 rounded-2xl shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{s.label}</p>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${s.color}15` }}>
                <s.icon className="w-4 h-4" style={{ color: s.color }} />
              </div>
            </div>
            <div className="text-3xl font-bold font-display" style={{ color: s.color }}>{s.value}</div>
            <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Questions */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold mb-4" style={{ color: '#1A2744' }}>Recent Community Questions</h2>
          <div className="space-y-3">
            {data?.recentActivity?.questions?.length ? data.recentActivity.questions.map((q) => (
              <div key={q._id} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: q.status === 'answered' ? '#2E7D32' : '#E8872A' }} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{q.title}</p>
                  <p className="text-xs text-gray-400">{q.authorName} · {new Date(q.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${q.status === 'answered' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
                  {q.status}
                </span>
              </div>
            )) : <p className="text-sm text-gray-400 py-4 text-center">No questions yet.</p>}
          </div>
        </div>

        {/* Recent Comments */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold mb-4" style={{ color: '#1A2744' }}>Recent Comments</h2>
          <div className="space-y-3">
            {data?.recentActivity?.comments?.length ? data.recentActivity.comments.map((c) => (
              <div key={c._id} className="py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-gray-600">{c.authorName}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{c.contentType}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{c.body}</p>
              </div>
            )) : <p className="text-sm text-gray-400 py-4 text-center">No comments yet.</p>}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
