/**
 * BookScrollExperience.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Redesigned landing page — two-part cinematic experience:
 *
 *  SECTION 1 — Hero Slider (Swiper.js + EffectFade)
 *    • Dynamic slides fetched from /api/slides (falls back to static data)
 *    • Auto-scroll every 5 s, manual prev/next, dot pagination
 *    • Gradient fade-to-background at bottom, seamlessly leading into book
 *
 *  SECTION 2 — Scroll-Driven Book (GSAP ScrollTrigger)
 *    • Closed book appears centered as slider scrolls away
 *    • Scroll → cover opens with 3-D rotateY hinge animation
 *    • Each additional scroll phase flips to the next page via CSS animation
 *    • 10 pages total: Table of Contents → Chapters I–X (all inside book UI)
 *    • Book closes & fades out; remaining sections render below normally
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
import {
  ArrowRightIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  UsersIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'

gsap.registerPlugin(ScrollTrigger)

/* ════════════════════════════════════════════════════════════════════════════
   STATIC DATA
════════════════════════════════════════════════════════════════════════════ */

/** Fallback slides used when the API is unavailable */
const FALLBACK_SLIDES = [
  {
    id: 1,
    title: 'Every Child Deserves Quality Education',
    description:
      'The Right to Education Act 2009 ensures free and compulsory education for all children between 6 and 14 years across India.',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600&q=80',
    cta: { label: 'Know Your Rights', href: '/know-your-rte/about' },
    tag: 'RTE Act 2009',
  },
  {
    id: 2,
    title: 'Track Compliance Across All 36 States',
    description:
      'Real-time dashboards show how each Indian state is performing on RTE mandates — from enrollment ratios to infrastructure benchmarks.',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1600&q=80',
    cta: { label: 'View State Reports', href: '/states' },
    tag: 'State Compliance',
  },
  {
    id: 3,
    title: 'Centre Releases Annual RTE Compliance Report 2024–25',
    description:
      'A comprehensive national review highlighting progress, gaps, and critical interventions required to meet universal enrollment targets.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1600&q=80',
    cta: { label: 'Read Report', href: '/news' },
    tag: 'Latest News',
  },

  {
    id: 5,
    title: 'Join a Community of Education Advocates',
    description:
      'Ask questions, share experiences, and get answers from legal experts and fellow citizens championing every child\'s right to learn.',
    image: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=1600&q=80',
    cta: { label: 'Join Community', href: '/community/questions' },
    tag: 'Community',
  },
  {
    id: 6,
    title: 'Publications, Reports & Policy Updates',
    description:
      'Access our curated library of RTE-related judgements, government orders, research publications, and policy amendments.',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1600&q=80',
    cta: { label: 'Browse Library', href: '/blog' },
    tag: 'Publications',
  },
]

/** 10 pages shown inside the open book (index 0 = Contents, 1–10 = Chapters) */
const BOOK_PAGES = [
  {
    id: 'contents',
    type: 'contents',
    title: 'Table of Contents',
    items: [
      { num: 'I',    label: 'Preliminary — Definitions & Scope' },
      { num: 'II',   label: 'Right of Children to Free Education' },
      { num: 'III',  label: 'Duties of Government & Local Authority' },
      { num: 'IV',   label: 'Responsibilities of Schools' },
      { num: 'V',    label: 'Curriculum & Evaluation' },
      { num: 'VI',   label: 'Teachers & Their Qualifications' },
      { num: 'VII',  label: 'Protection of Rights' },
      { num: 'VIII', label: 'State Compliance Dashboard' },
      { num: 'IX',    label: 'Community & Resources' },
    ],
  },
  {
    id: 'ch1', type: 'chapter', chapter: 'Chapter I', color: '#1A2744',
    title: 'Preliminary — Definitions & Scope',
    body: 'The RTE Act 2009 applies to every child in India from age 6 to 14. It defines key terms including "child," "school," "elementary education," "capitation fee," and "screening procedure." Understanding these definitions is the foundation of asserting your rights effectively.',
    highlight: '6–14 years — the age band where education becomes a fundamental right.',
    href: '/know-your-rte/about',
  },
  {
    id: 'ch2', type: 'chapter', chapter: 'Chapter II', color: '#E9872B',
    title: 'Right of Children to Free Education',
    body: 'Every child has the right to free and compulsory elementary education in a neighbourhood school. No child shall be required to pay any fee, charge, or expense that would prevent them from pursuing and completing elementary education.',
    highlight: '25% reservation — all private unaided schools must admit EWS/DG children.',
    href: '/know-your-rte/rights',
  },
  {
    id: 'ch3', type: 'chapter', chapter: 'Chapter III', color: '#2E7D32',
    title: 'Duties of Government & Local Authority',
    body: 'Appropriate governments and local bodies must ensure free education, maintain school infrastructure, provide trained teachers, and prevent child labour. They are also responsible for special training provisions for out-of-school children.',
    highlight: 'Local bodies must open a neighbourhood school within 3 km of every habitation.',
    href: '/states',
  },
  {
    id: 'ch4', type: 'chapter', chapter: 'Chapter IV', color: '#C62828',
    title: 'Responsibilities of Schools',
    body: 'Schools must admit children without screening procedures or capitation fees, provide a safe and enabling environment, maintain Pupil-Teacher Ratios as specified, and ensure no child is subjected to physical or mental harassment.',
    highlight: 'PTR must not exceed 30:1 in any elementary classroom.',
    href: '/states',
  },
  {
    id: 'ch5', type: 'chapter', chapter: 'Chapter V', color: '#1A2744',
    title: 'Curriculum & Evaluation',
    body: "The curriculum should foster a child's all-round development with a focus on activity-based learning. No child shall be held back or expelled until completion of elementary education. The National Curriculum Framework guides all academic standards.",
    highlight: 'No detention policy applies throughout Class 1–8.',
    href: '/blog',
  },
  {
    id: 'ch6', type: 'chapter', chapter: 'Chapter VI', color: '#5C35A0',
    title: 'Teachers & Their Qualifications',
    body: 'All teachers must possess minimum qualifications laid down by the academic authority. States must ensure adequate training programmes, and vacant positions must be filled within a prescribed timeline to maintain quality teaching standards.',
    highlight: 'Teachers must complete prescribed training within 5 years of appointment.',
    href: '/know-your-rte/about',
  },
  {
    id: 'ch7', type: 'chapter', chapter: 'Chapter VII', color: '#E9872B',
    title: 'Protection of Rights',
    body: 'Any person who contravenes the Act — by demanding capitation fees, conducting screening, or employing unqualified teachers — is liable to fines and penalties. The NCPCR acts as the national oversight body for enforcement.',
    highlight: 'Fines up to ₹25,000 first offence; ₹50,000 for repeated violations.',
    href: '/grievances/file',
  },
  {
    id: 'ch8', type: 'chapter', chapter: 'Chapter VIII', color: '#2E7D32',
    title: 'State Compliance Dashboard',
    body: 'Track how every Indian state is implementing the RTE Act in real time. Our compliance scores cover infrastructure, teacher deployment, enrollment ratios, and financial allocation — giving you the full picture at a glance.',
    highlight: 'Kerala leads at 91% compliance; 8 states remain below 50%.',
    href: '/states',
  },
  {
    id: 'ch9', type: 'chapter', chapter: 'Chapter IX', color: '#1A2744',
    title: 'Community & Resources',
    body: 'Join thousands of parents, educators, and advocates in our community forum. Ask questions, share experiences, read expert blogs, and access our curated library of judgements, government orders, and research reports on child education rights.',
    highlight: '12,450+ questions answered by our expert community.',
    href: '/community/questions',
  },
]

/* Scroll architecture constants */
const TOTAL_PHASES = 2 + BOOK_PAGES.length + 1 // 14 phases
const VH_PER_PHASE = 80                          // 80vh each → 1120vh total

/* ════════════════════════════════════════════════════════════════════════════
   ROOT EXPORT
════════════════════════════════════════════════════════════════════════════ */
export default function BookScrollExperience() {
  const [isMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768,
  )
  const [reducedMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  if (isMobile || reducedMotion) return <StaticHero />
  return <BookScrollExperienceInner />
}

/* ── Static mobile / reduced-motion fallback ──────────────────────────────── */
function StaticHero() {
  return (
    <section style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#1A2744 0%,#243356 55%,#1c3a5e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px' }}>
      <div style={{ maxWidth: 640, textAlign: 'center', color: 'white' }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>📖</div>
        <div style={{ background: 'rgba(232,135,42,0.18)', color: '#f0a952', padding: '6px 16px', borderRadius: 99, fontSize: 13, fontWeight: 600, display: 'inline-block', marginBottom: 24 }}>Right to Education Act 2009</div>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(36px,8vw,60px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 16 }}>
          <span style={{ color: 'white' }}>Understanding Your</span><br />
          <span style={{ color: '#E9872B' }}>Right to Education</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 18, marginBottom: 32, lineHeight: 1.7 }}>Track compliance and connect with a community fighting for every child's right to education.</p>
        <Link to="/states" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#E9872B', color: 'white', padding: '14px 32px', borderRadius: 14, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
          Explore States <ArrowRightIcon style={{ width: 16, height: 16 }} />
        </Link>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   MAIN ANIMATED COMPONENT
════════════════════════════════════════════════════════════════════════════ */
function BookScrollExperienceInner() {
  /* ── Slide data (dynamic, falls back to static) ─────────────────────── */
  const [slides, setSlides] = useState(FALLBACK_SLIDES)
  useEffect(() => {
    const ctrl = new AbortController()
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/slides`, { signal: ctrl.signal })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (Array.isArray(data) && data.length > 0) setSlides(data) })
      .catch(() => {})
    return () => ctrl.abort()
  }, [])

  /* ── Refs ─────────────────────────────────────────────────────────────── */
  const outerRef        = useRef(null)
  const bookSectionRef  = useRef(null)
  const stickyPanelRef  = useRef(null)
  const bookBodyRef     = useRef(null)
  const bookCoverRef    = useRef(null)
  const lightBurstRef   = useRef(null)
  const progressRef     = useRef(null)
  const scrollHintRef   = useRef(null)
  const prevBtnRef      = useRef(null)
  const nextBtnRef      = useRef(null)

  /* ── Current page shown inside book ────────────────────────────────── */
  const [currentPage, setCurrentPage] = useState(-1)

  /* ── GSAP master timeline ────────────────────────────────────────────── */
  useGSAP(() => {
    const bookSection = bookSectionRef.current
    const panel       = stickyPanelRef.current
    const bookBody    = bookBodyRef.current
    const cover       = bookCoverRef.current
    const light       = lightBurstRef.current
    const bar         = progressRef.current
    const hint        = scrollHintRef.current
    if (!bookSection || !panel) return

    /* Idle breathing pulse before scroll starts */
    const breathe = gsap.to(bookBody, { scale: 1.018, duration: 1.8, yoyo: true, repeat: -1, ease: 'sine.inOut' })

    /* Initial states */
    gsap.set(bookBody, { opacity: 0, y: 70, scale: 0.82, rotateX: 14 })
    gsap.set(cover,    { rotateY: 0 })
    gsap.set(light,    { opacity: 0 })
    gsap.set(bar,      { scaleX: 0, transformOrigin: 'left center' })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: panel,
        start: 'top top',
        end: `+=${TOTAL_PHASES * VH_PER_PHASE}%`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate(self) {
          const p          = self.progress
          const openStart  = 1 / TOTAL_PHASES
          const openEnd    = 2.5 / TOTAL_PHASES
          const closeStart = (TOTAL_PHASES - 1) / TOTAL_PHASES
          if (p < openEnd || p >= closeStart) {
            setCurrentPage(-1)
          } else {
            const span = closeStart - openEnd
            const rel  = (p - openEnd) / span
            setCurrentPage(Math.min(Math.floor(rel * BOOK_PAGES.length), BOOK_PAGES.length - 1))
          }
        },
      },
      onStart:          () => breathe.pause(),
      onReverseComplete:() => breathe.play(),
    })

    /* Phase 1 — book rises */
    tl.to(bookBody, { opacity: 1, y: 0, scale: 1, rotateX: 5, duration: 1, ease: 'power3.out' }, 0)
    tl.to(hint, { opacity: 0, y: -18, duration: 0.4 }, 0.2)

    /* Phase 2 — cover opens */
    tl.to(cover, { rotateY: -165, duration: 1.6, ease: 'power2.inOut' }, 1)
    tl.to(light,  { opacity: 0.72, duration: 0.6, ease: 'power2.out'  }, 1.3)
    tl.to(light,  { opacity: 0,    duration: 0.7, ease: 'power2.in'   }, 2.1)

    /* Progress bar across full duration */
    tl.to(bar, { scaleX: 1, duration: TOTAL_PHASES, ease: 'none' }, 0)

    /* Phase final — book closes & fades */
    tl.to(cover,    { rotateY: 0, duration: 1, ease: 'power2.inOut' }, TOTAL_PHASES - 1.5)
    tl.to(bookBody, { scale: 0.5, opacity: 0, y: 90, duration: 1, ease: 'power2.in' }, TOTAL_PHASES - 0.9)

    const t = setTimeout(() => ScrollTrigger.refresh(), 300)
    document.fonts?.ready?.then(() => ScrollTrigger.refresh())
    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)
    return () => {
      breathe.kill()
      clearTimeout(t)
      window.removeEventListener('resize', onResize)
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, { scope: outerRef, dependencies: [] })

  /* Page-edge slices (right-side page stack illusion) */
  const pageSlices = Array.from({ length: 10 }, (_, i) => (
    <div key={i} style={{
      width: 6, height: 538,
      background: i % 2 === 0 ? '#fffdf5' : '#f4ecdc',
      border: '0.5px solid rgba(200,175,130,0.4)',
      borderRadius: '0 2px 2px 0',
      position: 'absolute', top: 4, right: -(8 + i * 6),
      zIndex: 2 - i,
      transition: 'transform 0.3s',
      transform: currentPage >= 0 ? `translateX(${Math.min(currentPage * 1.3, 12)}px)` : 'none',
    }} />
  ))

  return (
    <div ref={outerRef} style={{ position: 'relative' }}>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 1 — HERO SLIDER
      ══════════════════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>

        {/* Custom nav arrows */}
        {[{ ref: prevBtnRef, side: 'left',  Icon: ChevronLeftIcon  },
          { ref: nextBtnRef, side: 'right', Icon: ChevronRightIcon }].map(({ ref, side, Icon }) => (
          <button key={side} ref={ref} aria-label={`${side === 'left' ? 'Previous' : 'Next'} slide`}
            style={{
              position: 'absolute', [side]: 24, top: '50%', transform: 'translateY(-50%)',
              zIndex: 20, width: 50, height: 50, borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)',
              border: '1.5px solid rgba(255,255,255,0.25)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', transition: 'background 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(233,135,43,0.75)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)' }}
          >
            <Icon style={{ width: 22, height: 22 }} />
          </button>
        ))}

        <Swiper
          modules={[Autoplay, Navigation, Pagination, EffectFade]}
          effect="fade" speed={1000}
          autoplay={{ delay: 5500, disableOnInteraction: false, pauseOnMouseEnter: true }}
          loop
          navigation={{ prevEl: prevBtnRef.current, nextEl: nextBtnRef.current }}
          pagination={{ clickable: true, bulletClass: 'rte-bullet', bulletActiveClass: 'rte-bullet-active' }}
          onBeforeInit={swiper => {
            swiper.params.navigation.prevEl = prevBtnRef.current
            swiper.params.navigation.nextEl = nextBtnRef.current
          }}
          style={{ width: '100%', height: '100%' }}
        >
          {slides.map(slide => (
            <SwiperSlide key={slide.id}>
              <HeroSlide slide={slide} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Scroll-down indicator */}
        <div style={{ position: 'absolute', bottom: 48, left: '50%', transform: 'translateX(-50%)', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, animation: 'scrollBounce 2s ease-in-out infinite' }}>
          <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2.5px', color: 'rgba(255,255,255,0.6)' }}>Scroll to Explore</span>
          <div style={{ width: 1, height: 42, background: 'linear-gradient(180deg,rgba(255,255,255,0.65) 0%,transparent 100%)' }} />
        </div>

        {/* Gradient fade into book section */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 220, background: 'linear-gradient(to bottom,transparent,#F8F7F6)', zIndex: 10, pointerEvents: 'none' }} />
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 2 — SCROLL-DRIVEN BOOK
      ══════════════════════════════════════════════════════════════════ */}
      <div ref={bookSectionRef} style={{ position: 'relative', background: '#F8F7F6' }}>

        {/* Pinned panel */}
        <div ref={stickyPanelRef} style={{ width: '100%', height: '100vh', overflow: 'hidden', background: 'radial-gradient(ellipse at 50% 65%,#EDE4D5 0%,#F8F7F6 68%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>

          {/* Parchment noise overlay */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.4, backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")", pointerEvents: 'none', zIndex: 0 }} />

          {/* Progress bar */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 3, background: 'rgba(26,39,68,0.07)', zIndex: 100 }}>
            <div ref={progressRef} style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg,#E9872B,#f0a84a)', transformOrigin: 'left center', transform: 'scaleX(0)' }} />
          </div>

          {/* Scroll hint */}
          <div ref={scrollHintRef} style={{ position: 'absolute', bottom: 44, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, opacity: 0.7, zIndex: 50, pointerEvents: 'none' }}>
            <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2.5px', color: '#1A2744' }}>Keep Scrolling</span>
            <div style={{ width: 1, height: 40, background: 'linear-gradient(180deg,#1A2744 0%,transparent 100%)' }} />
          </div>

          {/* Page indicator dots */}
          {currentPage >= 0 && (
            <div style={{ position: 'absolute', top: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 5, zIndex: 60 }}>
              {BOOK_PAGES.map((_, i) => (
                <div key={i} style={{ width: i === currentPage ? 22 : 6, height: 6, borderRadius: 3, background: i === currentPage ? '#E9872B' : 'rgba(26,39,68,0.18)', transition: 'all 0.35s ease' }} />
              ))}
            </div>
          )}

          {/* Chapter label above book */}
          {currentPage >= 0 && BOOK_PAGES[currentPage] && (
            <div style={{ position: 'absolute', top: 60, left: '50%', transform: 'translateX(-50%)', zIndex: 60, textAlign: 'center', whiteSpace: 'nowrap' }}>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: BOOK_PAGES[currentPage].color || '#1A2744', opacity: 0.85 }}>
                {BOOK_PAGES[currentPage].chapter || 'Contents'}
              </span>
            </div>
          )}

          {/* ── THE BOOK ─────────────────────────────────────────────── */}
          <div style={{ perspective: '1400px', perspectiveOrigin: '50% 45%', position: 'relative', zIndex: 10 }}>
            <div ref={bookBodyRef} style={{ position: 'relative', width: 440, height: 560, transformStyle: 'preserve-3d', transform: 'rotateX(10deg)', willChange: 'transform', boxShadow: '0 55px 90px rgba(26,39,68,0.36), 0 20px 32px rgba(26,39,68,0.18)', opacity: 0 }}>

              {/* Inner pages (visible when cover open) */}
              <BookInner currentPage={currentPage} />

              {/* Right-edge page slices */}
              <div style={{ position: 'absolute', inset: 0, overflow: 'visible', zIndex: 2 }}>{pageSlices}</div>

              {/* Light burst */}
              <div ref={lightBurstRef} style={{ position: 'absolute', inset: 0, borderRadius: '2px 8px 8px 2px', background: 'radial-gradient(ellipse at 12% 50%,rgba(255,225,110,0.92) 0%,rgba(255,185,45,0.48) 42%,transparent 70%)', opacity: 0, pointerEvents: 'none', zIndex: 6 }} />

              {/* Bookmark */}
              <div style={{ position: 'absolute', bottom: -32, right: 80, width: 16, height: 56, background: 'linear-gradient(180deg,#E9872B,#c56d1a)', clipPath: 'polygon(0 0,100% 0,100% 84%,50% 100%,0 84%)', zIndex: 11, boxShadow: '2px 4px 14px rgba(26,39,68,0.22)' }} />

              {/* Cover */}
              <div ref={bookCoverRef} style={{ position: 'absolute', inset: 0, background: 'linear-gradient(140deg,#1c2d50 0%,#0d1a35 100%)', borderRadius: '2px 8px 8px 2px', transformOrigin: 'left center', transformStyle: 'preserve-3d', willChange: 'transform', overflow: 'hidden', zIndex: 10, boxShadow: 'inset -6px 0 24px rgba(0,0,0,0.45)' }}>
                {/* Spine */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: 34, height: '100%', background: 'linear-gradient(90deg,#050d1f,#0A192F)', borderRadius: '4px 0 0 4px' }} />
                {/* Embossed border */}
                <div style={{ position: 'absolute', inset: 16, border: '1.5px solid rgba(233,135,43,0.28)', borderRadius: 6, pointerEvents: 'none' }} />
                {/* Bars */}
                <div style={{ position: 'absolute', top: 32, left: 52, right: 20, height: 2, background: 'rgba(233,135,43,0.42)', borderRadius: 1 }} />
                <div style={{ position: 'absolute', bottom: 32, left: 52, right: 20, height: 2, background: 'rgba(233,135,43,0.42)', borderRadius: 1 }} />

                {/* Cover content */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '52px 24px 52px 54px', gap: 10 }}>
                  <div style={{ width: 54, height: 54, borderRadius: '50%', border: '1.5px solid rgba(233,135,43,0.38)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(233,135,43,0.18)', border: '1px solid rgba(233,135,43,0.32)' }} />
                  </div>
                  <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.38)', letterSpacing: '3px', textTransform: 'uppercase' }}>Government of India</span>
                  <div style={{ width: 40, height: 1, background: 'rgba(233,135,43,0.32)', margin: '4px 0' }} />
                  <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 900, color: '#E9872B', letterSpacing: '0.5px', lineHeight: 1.2, textTransform: 'uppercase' }}>Right to<br/>Education</span>
                  <div style={{ width: 60, height: 2, background: 'rgba(233,135,43,0.52)', margin: '6px 0' }} />
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.52)', letterSpacing: '2.5px', textTransform: 'uppercase' }}>RTE Act 2009</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 20 }}>
                    <div style={{ width: 24, height: 1, background: 'rgba(233,135,43,0.28)' }} />
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(233,135,43,0.5)' }} />
                    <div style={{ width: 24, height: 1, background: 'rgba(233,135,43,0.28)' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Global styles ──────────────────────────────────────────────── */}
      <style>{`
        @keyframes scrollBounce {
          0%,100% { transform:translateX(-50%) translateY(0); }
          50%      { transform:translateX(-50%) translateY(9px); }
        }
        .rte-bullet {
          display:inline-block; width:8px; height:8px; border-radius:50%;
          background:rgba(255,255,255,0.42); margin:0 4px; cursor:pointer;
          transition:all .3s;
        }
        .rte-bullet-active { width:28px; border-radius:4px; background:#E9872B; }
        .swiper-pagination  { bottom:62px !important; }

        @keyframes pageIn {
          from { opacity:0; transform:rotateY(-10deg) translateX(22px); }
          to   { opacity:1; transform:rotateY(0deg)  translateX(0); }
        }
        @keyframes pageOut {
          from { opacity:1; transform:rotateY(0deg)  translateX(0); }
          to   { opacity:0; transform:rotateY(10deg) translateX(-22px); }
        }
        .page-in  { animation:pageIn  .42s cubic-bezier(.25,.46,.45,.94) forwards; }
        .page-out { animation:pageOut .32s cubic-bezier(.55,.06,.68,.19) forwards; }
      `}</style>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   HERO SLIDE — individual carousel slide
════════════════════════════════════════════════════════════════════════════ */
function HeroSlide({ slide }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <img src={slide.image} alt={slide.title} loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      {/* Gradient overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right,rgba(8,13,35,0.9) 0%,rgba(8,13,35,0.62) 52%,rgba(8,13,35,0.22) 100%)' }} />

      {/* Content */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 88px', maxWidth: 860 }}>
        <div>
          <div style={{ display: 'inline-block', background: 'rgba(233,135,43,0.2)', color: '#f5b060', padding: '5px 16px', borderRadius: 99, fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 22, border: '1px solid rgba(233,135,43,0.28)', backdropFilter: 'blur(6px)' }}>
            {slide.tag}
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(28px,4vw,60px)', fontWeight: 900, lineHeight: 1.1, color: 'white', margin: '0 0 18px', maxWidth: 680, textShadow: '0 2px 24px rgba(0,0,0,0.28)' }}>
            {slide.title}
          </h1>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 'clamp(13px,1.4vw,17px)', color: 'rgba(255,255,255,0.68)', lineHeight: 1.74, marginBottom: 30, maxWidth: 520 }}>
            {slide.description}
          </p>
          {slide.cta && (
            <Link to={slide.cta.href} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 28px', borderRadius: 13, background: '#E9872B', color: 'white', fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 14, textDecoration: 'none', boxShadow: '0 8px 28px rgba(233,135,43,0.42)', transition: 'transform .2s,box-shadow .2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 14px 36px rgba(233,135,43,0.52)' }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 8px 28px rgba(233,135,43,0.42)' }}
            >
              {slide.cta.label}<ArrowRightIcon style={{ width: 15, height: 15 }} />
            </Link>
          )}
        </div>
      </div>

      {/* Decorative vertical label */}
      <div style={{ position: 'absolute', right: 44, top: '50%', transform: 'translateY(-50%) rotate(90deg)', fontSize: 9, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', whiteSpace: 'nowrap', fontFamily: "'DM Sans',sans-serif" }}>
        Right to Education Portal — India
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   BOOK INNER — content pages with flip animation
════════════════════════════════════════════════════════════════════════════ */
function BookInner({ currentPage }) {
  const [displayed, setDisplayed] = useState(null)
  const [cls, setCls]             = useState('')
  const prevRef = useRef(-1)

  useEffect(() => {
    const prev = prevRef.current
    prevRef.current = currentPage

    if (currentPage < 0) {
      if (prev >= 0) { setCls('page-out'); setTimeout(() => { setDisplayed(null); setCls('') }, 320) }
      return
    }
    if (prev < 0) {
      setDisplayed(BOOK_PAGES[currentPage]); setCls('page-in'); return
    }
    // page transition
    setCls('page-out')
    const t = setTimeout(() => { setDisplayed(BOOK_PAGES[currentPage]); setCls('page-in') }, 320)
    return () => clearTimeout(t)
  }, [currentPage])

  /* Closed book: decorative lines */
  if (!displayed) {
    return (
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#fffdf7,#f9f4ea)', borderRadius: '2px 8px 8px 2px', padding: '54px 46px', display: 'flex', flexDirection: 'column', gap: 14, overflow: 'hidden' }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 11, fontWeight: 700, color: '#1A2744', textTransform: 'uppercase', letterSpacing: 1, opacity: 0.35, marginBottom: 10 }}>Table of Contents</div>
        {[90,78,95,68,84,72,88,62,91,75].map((w,i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:10, opacity:0.14+i*0.05 }}>
            <div style={{ width:18, height:1.5, background:'#1A2744', borderRadius:1, flexShrink:0 }} />
            <div style={{ width:`${w}%`, height:1.5, background:'#1A2744', borderRadius:1 }} />
          </div>
        ))}
      </div>
    )
  }

  if (displayed.type === 'contents') {
    return (
      <div className={cls} style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,#fffdf7,#f9f4ea)', borderRadius:'2px 8px 8px 2px', padding:'42px 42px 42px 46px', overflow:'hidden' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, paddingBottom:12, borderBottom:'1.5px solid rgba(26,39,68,0.1)' }}>
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:800, color:'#1A2744' }}>Contents</span>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(26,39,68,0.28)', letterSpacing:'1px' }}>RTE ACT 2009</span>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
          {displayed.items.map(item => (
            <div key={item.num} style={{ display:'flex', alignItems:'baseline', gap:10 }}>
              <span style={{ fontFamily:"'Playfair Display',serif", fontSize:11, fontWeight:700, color:'#E9872B', minWidth:30, textAlign:'right' }}>{item.num}</span>
              <div style={{ flex:1, borderBottom:'1px dotted rgba(26,39,68,0.16)', marginBottom:2 }} />
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11.5, fontWeight:500, color:'#1A2744', maxWidth:264, lineHeight:1.35 }}>{item.label}</span>
            </div>
          ))}
        </div>
        <div style={{ position:'absolute', bottom:18, left:0, right:0, textAlign:'center', fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(26,39,68,0.26)', letterSpacing:'1.5px' }}>— i —</div>
      </div>
    )
  }

  /* Chapter page */
  const pageNum = BOOK_PAGES.findIndex(p => p.id === displayed.id)
  return (
    <div className={cls} style={{ position:'absolute', inset:0, background:'linear-gradient(165deg,#fffdf7,#fdf8ee)', borderRadius:'2px 8px 8px 2px', padding:'34px 40px 38px 46px', display:'flex', flexDirection:'column', overflow:'hidden' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:displayed.color, opacity:0.9 }}>{displayed.chapter}</span>
        <span style={{ fontFamily:"'DM Mono',monospace", fontSize:8.5, color:'rgba(26,39,68,0.26)', letterSpacing:'1px' }}>RTE ACT 2009</span>
      </div>
      {/* Color rule */}
      <div style={{ height:2, background:`linear-gradient(90deg,${displayed.color},transparent)`, borderRadius:1, marginBottom:14 }} />
      {/* Title */}
      <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(15px,1.8vw,19px)', fontWeight:800, color:'#1A2744', lineHeight:1.28, marginBottom:14 }}>{displayed.title}</h2>
      {/* Body */}
      <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12.5, color:'rgba(28,28,28,0.7)', lineHeight:1.78, flex:1, marginBottom:14 }}>{displayed.body}</p>
      {/* Callout */}
      <div style={{ padding:'10px 14px', background:`${displayed.color}0d`, borderLeft:`3px solid ${displayed.color}`, borderRadius:'0 8px 8px 0', marginBottom:14 }}>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:600, color:displayed.color, lineHeight:1.5, margin:0 }}>{displayed.highlight}</p>
      </div>
      {/* CTA */}
      {displayed.href && (
        <Link to={displayed.href} style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:11, fontWeight:700, color:displayed.color, textDecoration:'none', letterSpacing:'0.5px' }}>
          Learn more <ArrowRightIcon style={{ width:11, height:11 }} />
        </Link>
      )}
      {/* Page number */}
      <div style={{ position:'absolute', bottom:16, left:0, right:0, textAlign:'center', fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(26,39,68,0.26)', letterSpacing:'1.5px' }}>— {pageNum} —</div>
    </div>
  )
}