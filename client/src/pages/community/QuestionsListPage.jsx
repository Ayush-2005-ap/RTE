import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MagnifyingGlassIcon, ChevronUpIcon, ChatBubbleLeftRightIcon, CheckBadgeIcon, FunnelIcon } from '@heroicons/react/24/outline'

const questions = [
  { id: 1, title: 'Can a private unaided school deny admission to a child from EWS category even if they have reserved seats?', body: 'We applied for RTE admission in a private school in Maharashtra but were denied. The school claims their quota is full already.', author: 'Priya M.', state: 'Maharashtra', category: 'Admissions', tags: ['EWS', 'private school', 'admission'], answers: 7, upvotes: 24, status: 'answered', createdAt: '2 days ago' },
  { id: 2, title: 'What documents are required for RTE admission in Karnataka? The school asked for Aadhaar but we don\'t have one.', body: '', author: 'Suresh K.', state: 'Karnataka', category: 'Admissions', tags: ['documents', 'aadhaar', 'Karnataka'], answers: 4, upvotes: 18, status: 'open', createdAt: '4 days ago' },
  { id: 3, title: 'Is a school allowed to charge uniform fees from RTE students? Our school is demanding ₹1,200 annually.', body: '', author: 'Anita R.', state: 'Delhi', category: 'Fees & Charges', tags: ['uniform', 'fees', 'illegal charges'], answers: 12, upvotes: 47, status: 'answered', createdAt: '1 week ago' },
  { id: 5, title: 'Can the government school transfer an RTE admitted child mid-year to another school?', body: '', author: 'Meena T.', state: 'Tamil Nadu', category: 'Admissions', tags: ['transfer', 'mid-year'], answers: 0, upvotes: 5, status: 'open', createdAt: '5 hours ago' },
]

const categories = ['All', 'Admissions', 'Fees & Charges', 'Infrastructure', 'Teachers', 'Rights']

export default function QuestionsListPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [status, setStatus] = useState('all')

  const filtered = questions.filter(q =>
    q.title.toLowerCase().includes(search.toLowerCase()) &&
    (category === 'All' || q.category === category) &&
    (status === 'all' || q.status === status)
  )

  return (
    <div style={{ paddingTop: '64px' }}>
      {/* Header */}
      <div className="py-12 px-4" style={{ background: 'linear-gradient(135deg,#1A2744,#243356)' }}>
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest mb-2 block" style={{ color: '#E8872A' }}>Community</span>
            <h1 className="text-h1 text-white" style={{ fontFamily: "'Playfair Display',serif" }}>Q&A Forum</h1>
            <p className="text-white/60 text-sm mt-1">Get answers from our community of RTE advocates and experts</p>
          </div>
          <Link to="/community/ask" className="btn-primary whitespace-nowrap">Ask a Question</Link>
        </div>
      </div>

      {/* Filters */}
      <div className="py-4 px-4 bg-white border-b" style={{ borderColor: 'rgba(26,39,68,0.08)' }}>
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input type="text" placeholder="Search questions…" value={search}
              onChange={e => setSearch(e.target.value)} className="input-rte pl-9 text-sm py-2.5" />
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
            <div className="ml-auto flex gap-2">
              {['all','open','answered'].map(s => (
                <button key={s} onClick={() => setStatus(s)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border capitalize transition-all"
                  style={{
                    background: status === s ? '#E8872A' : 'white',
                    color: status === s ? 'white' : '#888',
                    borderColor: status === s ? '#E8872A' : 'rgba(26,39,68,0.12)'
                  }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="py-8 px-4" style={{ background: '#F5EFE0' }}>
        <div className="max-w-4xl mx-auto space-y-4">
          {filtered.map((q, i) => (
            <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Link to={`/community/questions/${q.id}`}>
                <div className="bg-white rounded-2xl p-5 card-hover border" style={{ borderColor: 'rgba(26,39,68,0.07)' }}>
                  <div className="flex gap-4">
                    {/* Vote column */}
                    <div className="flex flex-col items-center gap-1 pt-1 min-w-[40px]">
                      <ChevronUpIcon className="w-5 h-5 text-muted" />
                      <span className="font-bold text-sm" style={{ color: '#1A2744' }}>{q.upvotes}</span>
                    </div>
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="badge-navy text-xs">{q.state}</span>
                        <span className="badge-saffron text-xs">{q.category}</span>
                        {q.status === 'answered' && (
                          <span className="badge-success text-xs flex items-center gap-1">
                            <CheckBadgeIcon className="w-3 h-3" /> Answered
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-ink leading-snug mb-2 line-clamp-2">{q.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                        <span className="flex items-center gap-1">
                          <ChatBubbleLeftRightIcon className="w-3.5 h-3.5" /> {q.answers} {q.answers === 1 ? 'answer' : 'answers'}
                        </span>
                        <span>by {q.author}</span>
                        <span>{q.createdAt}</span>
                        {q.tags.map(t => (
                          <span key={t} className="px-2 py-0.5 rounded-full text-xs" style={{ background: 'rgba(26,39,68,0.06)', color: '#1A2744' }}>
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted">
              <p className="text-lg mb-2">No questions found.</p>
              <Link to="/community/ask" className="btn-primary mt-2 inline-flex">Ask the first question</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
