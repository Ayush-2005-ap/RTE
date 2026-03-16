import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { ArrowRightIcon, MapPinIcon, ChatBubbleLeftRightIcon, DocumentTextIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

/* ─── Mock Data ───────────────────────────────────── */
const stats = [
  { label: 'States Tracked', value: 36,   suffix: '' },
  { label: 'Students Covered', value: 260, suffix: 'M+' },
  { label: 'Grievances Filed', value: 12400, suffix: '+' },
  { label: 'Resources Indexed', value: 3200, suffix: '+' },
]

const featuredStates = [
  { name: 'Kerala',       slug: 'kerala',       score: 91, label: 'Excellent', region: 'South' },
  { name: 'Himachal Pradesh', slug: 'himachal-pradesh', score: 84, label: 'Good',  region: 'North' },
  { name: 'Tamil Nadu',   slug: 'tamil-nadu',   score: 79, label: 'Good',  region: 'South' },
  { name: 'Karnataka',    slug: 'karnataka',    score: 72, label: 'Good',  region: 'South' },
  { name: 'Maharashtra',  slug: 'maharashtra',  score: 65, label: 'Average', region: 'West' },
  { name: 'Uttar Pradesh',slug: 'uttar-pradesh',score: 38, label: 'Poor',  region: 'North' },
]

const latestNews = [
  { id: 1, title: 'Centre Releases Annual RTE Compliance Report 2024-25', state: 'National', date: 'Mar 10, 2025', category: 'Policy' },
  { id: 2, title: 'Kerala Achieves 95% Enrollment Under RTE Provisions', state: 'Kerala', date: 'Mar 8, 2025', category: 'Achievement' },
  { id: 3, title: 'UP Govt Allocates ₹2,400 Cr for School Infrastructure', state: 'Uttar Pradesh', date: 'Mar 6, 2025', category: 'Budget' },
]

const recentQuestions = [
  { id: 1, title: 'Can a private school deny admission to a child from EWS category?', answers: 7, state: 'Maharashtra' },
  { id: 2, title: 'What documents are required for RTE admission in Karnataka?', answers: 4, state: 'Karnataka' },
  { id: 3, title: 'Is a school allowed to charge uniform fees from RTE students?', answers: 12, state: 'Delhi' },
]

/* ─── Animated Counter ────────────────────────────── */
function AnimatedCounter({ value, suffix, duration = 2000 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const end = value
    const step = end / (duration / 16)
    const timer = setInterval(() => {
      start = Math.min(start + step, end)
      setDisplay(Math.floor(start))
      if (start >= end) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [inView, value, duration])

  return (
    <span ref={ref}>
      {display.toLocaleString('en-IN')}{suffix}
    </span>
  )
}

/* ─── Score Colour Helper ─────────────────────────── */
function scoreColor(score) {
  if (score >= 75) return { bg: 'rgba(46,125,50,0.12)', text: '#2E7D32', bar: '#2E7D32' }
  if (score >= 50) return { bg: 'rgba(232,135,42,0.14)', text: '#E8872A', bar: '#E8872A' }
  return { bg: 'rgba(198,40,40,0.12)', text: '#C62828', bar: '#C62828' }
}

/* ─── Section Reveal Variants ─────────────────────── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

export default function HomePage() {
  const heroRef = useRef(null)
  const [typed, setTyped] = useState('')
  const headline = 'Every child deserves an education.'

  /* Typewriter effect for hero headline */
  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      i++
      setTyped(headline.slice(0, i))
      if (i >= headline.length) clearInterval(timer)
    }, 38)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="overflow-x-hidden">
      {/* ─── HERO ─────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(160deg,#1A2744 0%,#243356 55%,#1c3a5e 100%)' }}
      >
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle,#E8872A,transparent)' }} />
          <div className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full opacity-8"
            style={{ background: 'radial-gradient(circle,#E8872A,transparent)' }} />
          {/* Book illustration SVG */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.06, scale: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <svg width="600" height="500" viewBox="0 0 600 500" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="100" y="80" width="190" height="340" rx="8" fill="white" />
              <rect x="310" y="80" width="190" height="340" rx="8" fill="white" />
              <line x1="120" y1="130" x2="270" y2="130" stroke="#E8872A" strokeWidth="4" strokeLinecap="round"/>
              <line x1="120" y1="155" x2="270" y2="155" stroke="#ccc" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="120" y1="175" x2="220" y2="175" stroke="#ccc" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="120" y1="195" x2="270" y2="195" stroke="#ccc" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="330" y1="130" x2="480" y2="130" stroke="#E8872A" strokeWidth="4" strokeLinecap="round"/>
              <line x1="330" y1="155" x2="480" y2="155" stroke="#ccc" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="330" y1="175" x2="430" y2="175" stroke="#ccc" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </motion.div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className="badge-saffron text-sm mb-6 inline-block" style={{
              background: 'rgba(232,135,42,0.18)', color: '#f0a952', padding: '6px 16px', borderRadius: '99px', fontSize: '13px', fontWeight: 600
            }}>
              Right to Education Act 2009
            </span>
          </motion.div>

          {/* Headline with typewriter */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-hero text-white mb-6"
            style={{ fontFamily: "'Playfair Display', serif", minHeight: '1.2em' }}
          >
            {typed}
            <span className="animate-pulse" style={{ color: '#E8872A' }}>|</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            className="text-xl text-white/65 max-w-2xl mx-auto mb-10"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Track compliance across 36 states, file grievances, access legal resources, and connect with a community fighting for every child's right to a free and fair education.
          </motion.p>

          {/* CTA Row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link to="/states" className="btn-primary text-base px-8 py-4 rounded-xl">
              Explore State Compliance <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <Link to="/grievances/file" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base text-white transition-all duration-200 border-2"
              style={{ borderColor: 'rgba(255,255,255,0.28)' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}
            >
              File a Grievance
            </Link>
          </motion.div>

          {/* Quick search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0, duration: 0.6 }}
            className="max-w-xl mx-auto"
          >
            <Link to="/search">
              <div className="flex items-center gap-3 px-5 py-4 rounded-2xl cursor-text transition-all"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.18)' }}>
                <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <span className="text-white/40 text-sm">Search states, news, questions, documents…</span>
                <span className="ml-auto text-xs text-white/25 font-mono border border-white/20 px-1.5 py-0.5 rounded">⌘K</span>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-white/30 text-xs tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-0.5 h-8 rounded-full"
            style={{ background: 'linear-gradient(to bottom, rgba(232,135,42,0.7), transparent)' }}
          />
        </motion.div>
      </section>

      {/* ─── STATS ────────────────────────────────────── */}
      <section className="py-16 md:py-20" style={{ background: '#F5EFE0' }}>
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((s) => (
              <motion.div
                key={s.label}
                variants={fadeUp}
                className="text-center p-6 rounded-2xl card-hover"
                style={{ background: 'white', boxShadow: '0 2px 16px rgba(26,39,68,0.07)' }}
              >
                <div className="font-display font-bold mb-1"
                  style={{ fontSize: 'clamp(28px,4vw,42px)', color: '#1A2744' }}>
                  <AnimatedCounter value={s.value} suffix={s.suffix} />
                </div>
                <p className="text-muted text-sm">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── STATE COMPLIANCE ─────────────────────────── */}
      <section className="py-16 md:py-24 px-4" style={{ background: 'white' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4"
          >
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest mb-2 block" style={{ color: '#E8872A' }}>State Compliance</span>
              <h2 className="text-h1" style={{ fontFamily: "'Playfair Display', serif", color: '#1A2744' }}>
                How is your state doing?
              </h2>
            </div>
            <Link to="/states" className="btn-secondary text-sm whitespace-nowrap">
              View All States <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {featuredStates.map((state) => {
              const c = scoreColor(state.score)
              return (
                <motion.div key={state.slug} variants={fadeUp}>
                  <Link to={`/states/${state.slug}`}>
                    <div className="p-5 rounded-2xl card-hover border"
                      style={{ borderColor: 'rgba(26,39,68,0.08)', background: 'white' }}>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-ink">{state.name}</h3>
                          <p className="text-xs text-muted">{state.region} India</p>
                        </div>
                        <span className="badge font-bold text-sm px-3 py-1 rounded-full"
                          style={{ background: c.bg, color: c.text }}>
                          {state.score}
                        </span>
                      </div>
                      {/* Score bar */}
                      <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(26,39,68,0.08)' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${state.score}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                          className="h-full rounded-full"
                          style={{ background: c.bar }}
                        />
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs font-semibold" style={{ color: c.text }}>{state.label}</span>
                        <span className="text-xs text-muted flex items-center gap-1">
                          View details <ArrowRightIcon className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── NEWS + COMMUNITY ─────────────────────────── */}
      <section className="py-16 md:py-24 px-4" style={{ background: '#F5EFE0' }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          {/* News */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <span className="text-xs font-semibold uppercase tracking-widest mb-2 block" style={{ color: '#E8872A' }}>Latest News</span>
            <h2 className="text-h2 mb-6 font-display" style={{ color: '#1A2744' }}>What's happening</h2>
            <div className="space-y-4">
              {latestNews.map((n) => (
                <Link key={n.id} to={`/news/${n.id}`}>
                  <div className="p-4 rounded-xl card-hover bg-white border"
                    style={{ borderColor: 'rgba(26,39,68,0.07)' }}>
                    <div className="flex gap-2 mb-2">
                      <span className="badge-navy text-xs">{n.state}</span>
                      <span className="badge-saffron text-xs">{n.category}</span>
                    </div>
                    <p className="font-medium text-ink text-sm">{n.title}</p>
                    <p className="text-muted text-xs mt-1">{n.date}</p>
                  </div>
                </Link>
              ))}
            </div>
            <Link to="/news" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold"
              style={{ color: '#E8872A' }}>
              All news <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </motion.div>

          {/* Community Q&A */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <span className="text-xs font-semibold uppercase tracking-widest mb-2 block" style={{ color: '#E8872A' }}>Community</span>
            <h2 className="text-h2 mb-6 font-display" style={{ color: '#1A2744' }}>Recent questions</h2>
            <div className="space-y-4">
              {recentQuestions.map((q) => (
                <Link key={q.id} to={`/community/questions/${q.id}`}>
                  <div className="p-4 rounded-xl card-hover bg-white border"
                    style={{ borderColor: 'rgba(26,39,68,0.07)' }}>
                    <p className="font-medium text-ink text-sm mb-2">{q.title}</p>
                    <div className="flex items-center gap-3 text-xs text-muted">
                      <span className="badge-navy text-xs">{q.state}</span>
                      <span className="flex items-center gap-1">
                        <ChatBubbleLeftRightIcon className="w-3.5 h-3.5" />
                        {q.answers} answers
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <Link to="/community/questions" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold"
              style={{ color: '#E8872A' }}>
              Browse all questions <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── FEATURES STRIP ───────────────────────────── */}
      <section className="py-16 md:py-24 px-4" style={{ background: 'white' }}>
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-h1 text-center mb-16"
            style={{ fontFamily: "'Playfair Display',serif", color: '#1A2744' }}
          >
            Everything you need to{' '}
            <span className="saffron-underline" style={{ color: '#E8872A' }}>take action</span>
          </motion.h2>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: MapPinIcon, title: 'State Tracker', desc: 'Track RTE Act compliance scores for all 36 states in real-time with interactive maps.', href: '/states', color: '#1A2744' },
              { icon: ShieldCheckIcon, title: 'File Grievances', desc: 'Submit complaints with evidence. Get a reference number and track resolution progress.', href: '/grievances/file', color: '#E8872A' },
              { icon: ChatBubbleLeftRightIcon, title: 'Community Forum', desc: 'Ask questions, get expert answers, and discuss RTE provisions with fellow citizens.', href: '/community/questions', color: '#2E7D32' },
              { icon: DocumentTextIcon, title: 'Legal Resources', desc: 'Access acts, judgements, reports and policy documents for every state.', href: '/blog', color: '#C62828' },
            ].map((f, i) => (
              <motion.div key={f.title} variants={fadeUp}>
                <Link to={f.href}>
                  <div className="p-6 rounded-2xl card-hover h-full border"
                    style={{ borderColor: 'rgba(26,39,68,0.07)', background: 'white' }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: f.color + '18' }}>
                      <f.icon className="w-6 h-6" style={{ color: f.color }} />
                    </div>
                    <h3 className="font-semibold text-ink mb-2">{f.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── CTA BANNER ───────────────────────────────── */}
      <section className="py-20 px-4" style={{ background: 'linear-gradient(135deg,#1A2744,#243356)' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-h1 text-white mb-4" style={{ fontFamily: "'Playfair Display',serif" }}>
            Join thousands of citizens <br className="hidden sm:block" />
            advocating for education.
          </h2>
          <p className="text-white/60 mb-8 text-lg">
            Register for free to ask questions, track grievances, and make your voice heard.
          </p>
          <Link to="/register" className="btn-primary text-lg px-10 py-4">
            Get Started Free <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
