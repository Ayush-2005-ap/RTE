import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronUpIcon, ArrowLeftIcon, CheckBadgeIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'

const mockQuestion = {
  id: 1,
  title: 'Can a private unaided school deny admission to a child from EWS category even if they have reserved seats?',
  body: `We applied for RTE admission in a private unaided school in Maharashtra but were denied. The school claims their 25% quota is already full. However, as per our research, the admission list hasn't been published yet.

My daughter is 6 years old and we belong to the EWS category with all required documentation. The school's management told us verbally that they don't have seats but refused to give anything in writing.

What legal recourse do we have? Can we escalate this to the district education officer?`,
  author: { name: 'Priya Mehta', state: 'Maharashtra', type: 'Parent' },
  state: 'Maharashtra',
  category: 'Admissions',
  tags: ['EWS', 'private school', 'admission', 'Maharashtra'],
  upvotes: 24,
  createdAt: '2 days ago',
  answers: [
    {
      id: 1, isVerified: true,
      body: `Yes, this is clearly a violation of Section 12(1)(c) of the RTE Act 2009. Private unaided schools must reserve 25% seats for EWS/disadvantaged children and CANNOT deny admission once there are vacant seats in that quota.\n\nHere's what you should do:\n\n1. **File a written complaint** to the District Education Officer (DEO) with all documents\n2. **Request written rejection** from the school — they are legally obligated to provide one\n3. **Contact State RTE Authority** — in Maharashtra, reach out to the Municipal Corporation's Education Department\n4. **File an RTI** to check how many EWS seats are genuinely filled at that school\n\nThe school cannot verbally deny you. Get everything in writing.`,
      author: { name: 'Advocate Rajesh Singh', type: 'RTE Expert' },
      upvotes: 18,
      createdAt: '1 day ago',
    },
    {
      id: 2, isVerified: false,
      body: 'I faced a similar issue in Pune. We filed a complaint with the local District Education Officer and got admission within 2 weeks. Keep all your documents ready: income certificate, caste certificate, birth certificate, and address proof. Also take a photo of the school notice board if the admission list is not displayed.',
      author: { name: 'Rahul Patil', type: 'Parent' },
      upvotes: 7,
      createdAt: '18 hours ago',
    },
  ],
}

export default function QuestionDetailPage() {
  useParams()
  const q = mockQuestion
  const [answer, setAnswer] = useState('')
  const [upvoted, setUpvoted] = useState(false)

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
              {q.tags.map(t => (
                <span key={t} className="px-2 py-0.5 rounded-full text-xs"
                  style={{ background: 'rgba(26,39,68,0.06)', color: '#1A2744' }}>#{t}</span>
              ))}
            </div>
            <h1 className="text-h2 font-display mb-4" style={{ color: '#1A2744' }}>{q.title}</h1>
            <div className="prose prose-sm max-w-none text-ink mb-6">
              {q.body.split('\n\n').map((p, i) => <p key={i} className="mb-3">{p}</p>)}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted">
                <span className="font-semibold text-ink">{q.author.name}</span> · {q.author.type} from {q.author.state} · {q.createdAt}
              </div>
              <button onClick={() => setUpvoted(!upvoted)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: upvoted ? 'rgba(232,135,42,0.12)' : 'rgba(26,39,68,0.06)',
                  color: upvoted ? '#E8872A' : '#888',
                }}>
                <ChevronUpIcon className="w-4 h-4" />
                {upvoted ? q.upvotes + 1 : q.upvotes} Upvotes
              </button>
            </div>
          </motion.div>

          {/* Answers */}
          <h2 className="font-display font-bold text-lg mb-4" style={{ color: '#1A2744' }}>
            {q.answers.length} {q.answers.length === 1 ? 'Answer' : 'Answers'}
          </h2>
          <div className="space-y-5 mb-8">
            {q.answers.map((a, i) => (
              <motion.div key={a.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-5 shadow-sm border"
                style={{ borderColor: a.isVerified ? 'rgba(46,125,50,0.3)' : 'rgba(26,39,68,0.07)',
                         background: a.isVerified ? 'rgba(46,125,50,0.02)' : 'white' }}>
                {a.isVerified && (
                  <div className="flex items-center gap-1.5 mb-3 text-xs font-semibold" style={{ color: '#2E7D32' }}>
                    <CheckBadgeIcon className="w-4 h-4" /> Verified Answer
                  </div>
                )}
                <div className="prose prose-sm max-w-none text-ink mb-4">
                  {a.body.split('\n').map((line, li) => (
                    <p key={li} className={line.startsWith('**') ? 'font-semibold' : ''}>
                      {line.replace(/\*\*(.*?)\*\*/g, '$1')}
                    </p>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted">
                    <span className="font-semibold text-ink">{a.author.name}</span> · {a.author.type} · {a.createdAt}
                  </div>
                  <button className="flex items-center gap-1 text-xs text-muted hover:text-ink transition-colors">
                    <ChevronUpIcon className="w-3.5 h-3.5" /> {a.upvotes}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Post Answer */}
          <div className="bg-white rounded-2xl p-5 shadow-card">
            <h3 className="font-semibold text-ink mb-3">Post your answer</h3>
            <textarea value={answer} onChange={e => setAnswer(e.target.value)}
              placeholder="Share your knowledge or experience…"
              rows={5} className="input-rte resize-none mb-3" />
            <button className="btn-primary flex items-center gap-2">
              <PaperAirplaneIcon className="w-4 h-4" /> Post Answer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
