import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

const allResults = [
  { type: 'question', id: 1, title: 'Can a private school deny EWS admission under RTE?', state: 'Maharashtra', link: '/community/questions/1' },
  { type: 'news', id: 1, title: 'Centre Releases Annual RTE Compliance Report 2024-25', state: 'National', link: '/news/1' },
  { type: 'blog', slug: 'understanding-rte-25-percent-quota', title: "Understanding the 25% EWS Quota Under RTE", link: '/blog/understanding-rte-25-percent-quota' },
  { type: 'state', slug: 'kerala', title: 'Kerala — Compliance Score: 91', link: '/states/kerala' },
  { type: 'news', id: 2, title: 'Kerala Achieves 95% Enrollment Under RTE', state: 'Kerala', link: '/news/2' },
  { type: 'question', id: 3, title: 'Can a school charge uniform fees from RTE students?', state: 'Delhi', link: '/community/questions/3' },
]

const typeConfig = {
  question: { label: 'Q&A', color: '#1A2744', bg: 'rgba(26,39,68,0.1)' },
  news:     { label: 'News', color: '#E8872A', bg: 'rgba(232,135,42,0.12)' },
  blog:     { label: 'Blog', color: '#2E7D32', bg: 'rgba(46,125,50,0.1)' },
  state:    { label: 'State', color: '#558B2F', bg: 'rgba(85,139,47,0.1)' },
}

const tabs = ['All', 'Questions', 'News', 'Blog', 'States']

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQ = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQ)
  const [tab, setTab] = useState('All')

  const filtered = allResults.filter(r => {
    const matchQuery = r.title.toLowerCase().includes(query.toLowerCase())
    const matchTab = tab === 'All' ||
      (tab === 'Questions' && r.type === 'question') ||
      (tab === 'News' && r.type === 'news') ||
      (tab === 'Blog' && r.type === 'blog') ||
      (tab === 'States' && r.type === 'state')
    return matchQuery && matchTab
  })

  useEffect(() => {
    if (query) setSearchParams({ q: query })
  }, [query])

  return (
    <div style={{ paddingTop: '64px' }}>
      {/* Search Bar */}
      <div className="py-10 px-4" style={{ background: 'linear-gradient(135deg,#1A2744,#243356)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="relative mb-4">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search states, questions, news, blog…"
              className="w-full pl-12 pr-5 py-4 rounded-2xl text-white text-lg placeholder-white/30"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.15)', fontFamily: "'DM Sans', sans-serif" }}
            />
          </div>
          {query && <p className="text-white/50 text-sm">{filtered.length} results for "<strong className="text-white/80">{query}</strong>"</p>}
        </div>
      </div>

      {/* Tabs + Results */}
      <div className="border-b bg-white" style={{ borderColor: 'rgba(26,39,68,0.08)' }}>
        <div className="max-w-3xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all"
              style={{ borderColor: tab === t ? '#E8872A' : 'transparent', color: tab === t ? '#E8872A' : '#888' }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="py-8 px-4" style={{ background: '#F5EFE0', minHeight: '60vh' }}>
        <div className="max-w-3xl mx-auto">
          {!query ? (
            <div className="text-center py-20 text-muted">
              <MagnifyingGlassIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Start typing to search…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-muted">No results found for "{query}".</div>
          ) : (
            <div className="space-y-3">
              {filtered.map((r, i) => {
                const tc = typeConfig[r.type] || typeConfig.news
                return (
                  <motion.div key={`${r.type}-${r.id || r.slug}`}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Link to={r.link}>
                      <div className="bg-white rounded-xl p-4 card-hover border flex items-center gap-4"
                        style={{ borderColor: 'rgba(26,39,68,0.07)' }}>
                        <span className="badge text-xs flex-shrink-0 font-semibold"
                          style={{ background: tc.bg, color: tc.color }}>
                          {tc.label}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-ink truncate">{r.title}</p>
                          {r.state && <p className="text-xs text-muted mt-0.5">{r.state}</p>}
                        </div>
                        <span className="text-muted text-xs flex-shrink-0">→</span>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
