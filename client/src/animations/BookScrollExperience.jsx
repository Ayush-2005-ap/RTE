/**
 * BookScrollExperience.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Full cinematic scroll-driven book animation for the RTE homepage hero.
 * GSAP ScrollTrigger drives everything. CSS-only book construction.
 *
 * Architecture:
 *  • scrollContainerRef — tall div (500vh) that defines scroll distance
 *  • stickyPanelRef     — pinned by ScrollTrigger (NOT by CSS position:sticky)
 *  • bookWrapRef        — 3D perspective wrapper; GSAP translates it left
 *  • bookBodyRef        — the 3D book (rotateX perspective angle)
 *  • bookCoverRef       — the hinge cover (rotateY opens it)
 *  • block1–7Ref        — content blocks that emerge from inside the book
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import {
  ArrowRightIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'


gsap.registerPlugin(ScrollTrigger)

/* ── Static data ────────────────────────────────────────────────────────────── */
const quickCards = [
  { icon: MapPinIcon,              title: 'Know Your RTE',  desc: 'Understand your rights under the RTE Act 2009', href: '/know-your-rte/about', color: '#1A2744' },
  { icon: MapPinIcon,              title: 'RTE by State',   desc: 'Track compliance scores for all 36 states',      href: '/states',             color: '#E9872B' },
  { icon: ChatBubbleLeftRightIcon, title: 'Ask a Question', desc: 'Get expert answers from our community',          href: '/community/ask',      color: '#2E7D32' },
  { icon: DocumentTextIcon,        title: 'Latest News',    desc: 'Stay updated with RTE policy developments',      href: '/news',               color: '#C62828' },
]
const heroStats = [
  { value: 12450, suffix: '+', label: 'Questions Answered' },
  { value: 3890,  suffix: '+', label: 'Grievances Filed'   },
  { value: 28,    suffix: '',  label: 'States Covered'     },
]
const latestNews = [
  { id: 1, title: 'Centre Releases Annual RTE Compliance Report 2024–25', state: 'National',      date: 'Mar 10, 2025', category: 'Policy'      },
  { id: 2, title: 'Kerala Achieves 95% Enrollment Under RTE Provisions',  state: 'Kerala',        date: 'Mar 8, 2025',  category: 'Achievement' },
  { id: 3, title: 'UP Govt Allocates ₹2,400 Cr for School Infrastructure',state: 'Uttar Pradesh', date: 'Mar 6, 2025',  category: 'Budget'      },
]
const recentQuestions = [
  { id: 1, title: 'Can a private school deny admission to a child from EWS category?', answers: 7,  state: 'Maharashtra' },
  { id: 2, title: 'What documents are required for RTE admission in Karnataka?',        answers: 4,  state: 'Karnataka'   },
  { id: 3, title: 'Is a school allowed to charge uniform fees from RTE students?',      answers: 12, state: 'Delhi'       },
]
const featuredStates = [
  { name: 'Kerala',           slug: 'kerala',           score: 91, label: 'Excellent', region: 'South' },
  { name: 'Himachal Pradesh', slug: 'himachal-pradesh', score: 84, label: 'Good',      region: 'North' },
  { name: 'Tamil Nadu',       slug: 'tamil-nadu',       score: 79, label: 'Good',      region: 'South' },
  { name: 'Karnataka',        slug: 'karnataka',        score: 72, label: 'Good',      region: 'South' },
  { name: 'Maharashtra',      slug: 'maharashtra',      score: 65, label: 'Average',   region: 'West'  },
  { name: 'Uttar Pradesh',    slug: 'uttar-pradesh',    score: 38, label: 'Poor',      region: 'North' },
]
function scoreColor(score) {
  if (score >= 75) return { bg: 'rgba(46,125,50,0.12)', text: '#2E7D32', bar: '#2E7D32' }
  if (score >= 50) return { bg: 'rgba(232,135,42,0.14)', text: '#E8872A', bar: '#E8872A' }
  return { bg: 'rgba(198,40,40,0.12)', text: '#C62828', bar: '#C62828' }
}

/* ── Animated number counter ────────────────────────────────────────────────── */
function CountUp({ target, suffix, duration = 1.8 }) {
  const el = useRef(null)
  useEffect(() => {
    const obj = { val: 0 }
    const tween = gsap.to(obj, {
      val: target, duration, ease: 'power2.out',
      onUpdate: () => { if (el.current) el.current.textContent = Math.floor(obj.val).toLocaleString('en-IN') + suffix },
    })
    return () => tween.kill()
  }, [target, suffix, duration])
  return <span ref={el}>0{suffix}</span>
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN EXPORT — mobile guard
═══════════════════════════════════════════════════════════════════════════════ */
export default function BookScrollExperience() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768)
  const [reducedMotion] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    // Handling resize to update isMobile
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (isMobile || reducedMotion) return <StaticHero />
  return <BookScrollExperienceInner />
}

/* ── Static fallback ────────────────────────────────────────────────────────── */
function StaticHero() {
  return (
    <>
      <section style={{ minHeight:'100vh', background:'linear-gradient(160deg,#1A2744 0%,#243356 55%,#1c3a5e 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'80px 24px' }}>
        <div style={{ maxWidth:640, textAlign:'center', color:'white' }}>
          <div style={{ fontSize:64, marginBottom:24 }}>📖</div>
          <div style={{ background:'rgba(232,135,42,0.18)', color:'#f0a952', padding:'6px 16px', borderRadius:'99px', fontSize:13, fontWeight:600, display:'inline-block', marginBottom:24 }}>Right to Education Act 2009</div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(36px,8vw,60px)', fontWeight:800, lineHeight:1.1, marginBottom:16 }}>
            <span style={{ color:'white' }}>Understanding Your</span><br/>
            <span style={{ color:'#E9872B' }}>Right to Education</span>
          </h1>
          <p style={{ color:'rgba(255,255,255,0.65)', fontSize:18, marginBottom:32, lineHeight:1.7 }}>Track compliance across 36 states, file grievances, and connect with a community fighting for every child's right to education.</p>
          <Link to="/search" style={{ display:'block', maxWidth:440, margin:'0 auto', background:'rgba(255,255,255,0.08)', border:'1.5px solid rgba(255,255,255,0.18)', borderRadius:16, padding:'14px 20px', color:'rgba(255,255,255,0.4)', fontSize:14, textDecoration:'none' }}>Search states, news, questions…</Link>
        </div>
      </section>
      <div style={{ padding: '40px 0', borderTop: '1px solid rgba(255,255,255,0.1)', background: '#1A2744' }}>
        <p className="text-center text-white/40 text-xs">© 2025 Right to Education (RTE) Portal. All rights reserved.</p>
      </div>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   ANIMATED INNER COMPONENT
═══════════════════════════════════════════════════════════════════════════════ */
function BookScrollExperienceInner() {
  const scrollContainerRef = useRef(null)
  const stickyPanelRef     = useRef(null)
  const bookWrapRef        = useRef(null)
  const bookBodyRef        = useRef(null)
  const bookCoverRef       = useRef(null)
  const lightBurstRef      = useRef(null)
  const block1Ref          = useRef(null)
  const block2Ref          = useRef(null)
  const block3Ref          = useRef(null)
  const block4Ref          = useRef(null)
  const block5Ref          = useRef(null)
  const block6Ref          = useRef(null)
  const block7Ref          = useRef(null)
  const progressRef        = useRef(null)
  const scrollHintRef      = useRef(null)

  useGSAP(() => {
    const container = scrollContainerRef.current
    const panel     = stickyPanelRef.current
    const bookWrap  = bookWrapRef.current
    const bookBody  = bookBodyRef.current
    const cover     = bookCoverRef.current
    const light     = lightBurstRef.current
    const progressBar = progressRef.current
    const scrollHint  = scrollHintRef.current
    if (!container || !panel) return

    const vw = window.innerWidth

    /* ── Phase 1: breathing pulse ──────────────────────────────────────────── */
    const breathe = gsap.to(bookBody, {
      scale: 1.015,
      duration: 1.5,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    })

    /* ── Initial states for content blocks ─────────────────────────────────── */
    const FROM = {
      x: 0,
      y: 30,
      scale: 0.9,
      opacity: 0,
      pointerEvents: 'none',
      force3D: true,
    }
    gsap.set([block1Ref.current, block2Ref.current, block3Ref.current, block4Ref.current, block5Ref.current, block6Ref.current, block7Ref.current], FROM)

    /* ── Master scrollTrigger timeline ─────────────────────────────────────── */
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: '+=750%',
        pin: panel,
        scrub: 0.5,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
      onStart: () => breathe.pause(),
      onReverseComplete: () => breathe.play()
    })

    /* ── PHASE 2 — book slides left + cover opens ───── 0 → 2.5 ─────────── */
    tl
      .to(bookWrap, { x: -(vw * 0.28), duration: 2.5, ease: 'power2.inOut' }, 0)
      .to(bookBody, { rotateX: 3, duration: 2.5, ease: 'power2.inOut' }, 0)
      .to(light, { opacity: 0.75, duration: 0.8, ease: 'power2.out' }, 0.8)
      .to(light, { opacity: 0, duration: 1.0, ease: 'power2.in' }, 1.7)
      .to(cover, { rotateY: -160, duration: 2.0, ease: 'power2.inOut' }, 0.3)
      .to(progressBar, { scaleX: 1, duration: 10, ease: 'none' }, 0)
      .to(scrollHint, { opacity: 0, y: -20, duration: 0.5 }, 0.2)

    /* ── PHASE 3 — content emerges/retracts ───── 2.5 → 8.2 ─────────────── */
    const VISIBLE = { y: 0, scale: 1, opacity: 1, pointerEvents: 'auto', duration: 0.6, ease: 'power2.out' }
    const RETRACT = { y: -40, scale: 0.9, opacity: 0, pointerEvents: 'none', duration: 0.4, ease: 'power2.in' }
    
    // Non-overlapping block transitions
    tl.to(block1Ref.current, { ...VISIBLE }, 2.5)
    tl.to(block1Ref.current, { ...RETRACT }, 3.8)
    
    tl.to(block2Ref.current, { ...VISIBLE }, 3.9)
    tl.to(block2Ref.current, { ...RETRACT }, 5.2)
    
    tl.to(block3Ref.current, { ...VISIBLE }, 5.3)
    tl.to(block3Ref.current, { ...RETRACT }, 6.6)
    
    tl.to(block4Ref.current, { ...VISIBLE }, 6.7)
    tl.to(block4Ref.current, { ...RETRACT }, 7.9)

    tl.to(block5Ref.current, { ...VISIBLE }, 8.0)
    tl.to(block5Ref.current, { ...RETRACT }, 9.2)

    tl.to(block6Ref.current, { ...VISIBLE }, 9.3)
    tl.to(block6Ref.current, { ...RETRACT }, 10.5)

    tl.to(block7Ref.current, { ...VISIBLE }, 10.6)
    tl.to(block7Ref.current, { ...RETRACT }, 11.8)

    /* ── PHASE 4 — book closes and disappears ───── 11.8 → 13.5 ───────────── */
    tl.to(cover, { rotateY: 0, duration: 1.0, ease: 'power2.inOut' }, 12.0)
    tl.to(bookBody, { scale: 0.4, opacity: 0, y: 100, duration: 1.0, ease: 'power2.in' }, 12.7)
    tl.to(bookWrap, { opacity: 0, duration: 0.3 }, 13.4)

    /* ── Refresh / Resize handlers ────────────────────────────────────────── */
    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 200)
    document.fonts?.ready?.then(() => ScrollTrigger.refresh())
    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)

    return () => {
      breathe.kill()
      clearTimeout(refreshTimer)
      window.removeEventListener('resize', onResize)
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, { scope: scrollContainerRef, dependencies: [] })


  /* Page stack slices */
  const pageSlices = Array.from({ length: 8 }, (_, i) => (
    <div key={i} style={{
      width: 7, height: 492,
      background: i % 2 === 0 ? '#fffdf5' : '#f5ede0',
      border: '0.5px solid rgba(200,180,140,0.5)',
      borderRadius: '0 2px 2px 0',
      position: 'absolute', top: 4,
      right: -(8 + i * 7),
      zIndex: 2 - i,
    }} />
  ))

  return (
    <>
      <div
        ref={scrollContainerRef}
        style={{ position: 'relative', height: '850vh', background: '#F8F7F6' }}
      >
      {/*
        stickyPanel is pinned by ScrollTrigger (pin: panel in the config above).
        Do NOT give it position:sticky in CSS — ScrollTrigger will add its own
        inline styles for pinning.
      */}
      <div
        ref={stickyPanelRef}
        style={{
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          background: '#F8F7F6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* ── Progress Bar ──────────────────────────────────────────────── */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, width: '100%', height: 3,
          background: 'rgba(26,39,68,0.06)', zIndex: 100
        }}>
          <div ref={progressRef} style={{
            width: '100%', height: '100%', background: '#E9872B',
            transformOrigin: 'left center', transform: 'scaleX(0)',
          }} />
        </div>

        {/* ── Scroll Hint ────────────────────────────────────────────────── */}
        <div ref={scrollHintRef} style={{
          position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          opacity: 0.8, zIndex: 50, pointerEvents: 'none',
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: '#1A2744' }}>Scroll to Explore</span>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(180deg, #1A2744 0%, transparent 100%)' }} />
        </div>
        {/* ── Book (perspective wrapper then 3D body) ─────────────────────── */}
        {/*
          bookWrapRef is positioned at the center of stickyPanel. GSAP will
          translate it left by animating 'x'. We must NOT use CSS transform here
          — instead we use left/top + margin to center it, and let GSAP own 'x'.
        */}
        <div
          ref={bookWrapRef}
          style={{
            perspective: '1200px',
            perspectiveOrigin: '50% 50%',
            willChange: 'transform',
            /* centering via absolute + margin trick so GSAP can own translateX */
            position: 'absolute',
            left: '50%',
            top: '50%',
            marginLeft: -190,  /* half of book width 380 */
            marginTop: -250,   /* half of book height 500 */
          }}
        >
          <div
            ref={bookBodyRef}
            style={{
              position: 'relative',
              width: 380,
              height: 500,
              transformStyle: 'preserve-3d',
              transform: 'rotateX(10deg)',
              willChange: 'transform',
              /* box-shadow instead of filter:drop-shadow — drop-shadow recalculates per frame */
              boxShadow: '0 40px 60px rgba(26,39,68,0.35)',
            }}
          >
            {/* Inner pages (visible when cover opens) */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg,#fffdf7,#f9f5ec)',
              borderRadius: '2px 8px 8px 2px',
              padding: '50px 40px',
              display: 'flex', flexDirection: 'column', gap: 14
            }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:10, fontWeight:700, color:'#1A2744', textTransform:'uppercase', letterSpacing:1, marginBottom:4, opacity:0.6 }}>Chapter I</div>
              <div style={{ width: '85%', height: 2, background: 'rgba(26,39,68,0.15)', borderRadius: 1 }} />
              <div style={{ width: '90%', height: 2, background: 'rgba(26,39,68,0.12)', borderRadius: 1 }} />
              <div style={{ width: '75%', height: 2, background: 'rgba(26,39,68,0.12)', borderRadius: 1 }} />
              <div style={{ width: '90%', height: 2, background: 'rgba(26,39,68,0.12)', borderRadius: 1 }} />
              <div style={{ width: '65%', height: 2, background: 'rgba(26,39,68,0.12)', borderRadius: 1 }} />
              
              <div style={{ marginTop: 24, fontFamily:"'Playfair Display',serif", fontSize:10, fontWeight:700, color:'#1A2744', textTransform:'uppercase', letterSpacing:1, marginBottom:4, opacity:0.6 }}>Chapter II</div>
              <div style={{ width: '90%', height: 2, background: 'rgba(26,39,68,0.15)', borderRadius: 1 }} />
              <div style={{ width: '80%', height: 2, background: 'rgba(26,39,68,0.12)', borderRadius: 1 }} />
              <div style={{ width: '95%', height: 2, background: 'rgba(26,39,68,0.12)', borderRadius: 1 }} />
            </div>

            {/* Page stack on right edge */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'visible', zIndex: 2 }}>
              {pageSlices}
            </div>

            {/* Light burst (from inside book) */}
            <div
              ref={lightBurstRef}
              style={{
                position: 'absolute', inset: 0,
                borderRadius: '2px 8px 8px 2px',
                background: 'radial-gradient(ellipse at 15% 50%, rgba(255,220,100,0.95) 0%, rgba(255,180,40,0.55) 40%, transparent 72%)',
                opacity: 0,
                willChange: 'opacity',
                pointerEvents: 'none',
                zIndex: 5,
              }}
            />

            {/* Bookmark ribbon */}
            <div style={{
              position: 'absolute', bottom: -28, right: 60,
              width: 14, height: 48,
              background: 'linear-gradient(180deg,#E9872B,#c96d1a)',
              clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)',
              zIndex: 11,
            }} />

            {/* ── Cover (rotates on left hinge) ─────────────────────────── */}
            <div
              ref={bookCoverRef}
              style={{
                position: 'absolute', inset: 0,
                background: '#1A2744',
                borderRadius: '2px 8px 8px 2px',
                transformOrigin: 'left center',
                transformStyle: 'preserve-3d',
                willChange: 'transform',
                overflow: 'hidden',
                zIndex: 10,
              }}
            >
              {/* Spine */}
              <div style={{ position:'absolute', top:0, left:0, width:28, height:'100%', background:'#0A192F', borderRadius:'4px 0 0 4px' }} />

              {/* Embossed border */}
              <div style={{ position:'absolute', inset:12, border:'1.5px solid rgba(233,135,43,0.35)', borderRadius:4, pointerEvents:'none' }} />

              {/* Decorative top bar */}
              <div style={{ position:'absolute', top:28, left:44, right:16, height:2, background:'rgba(233,135,43,0.4)', borderRadius:1 }} />

              {/* Cover text */}
              <div style={{
                position:'absolute', inset:0,
                display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                textAlign:'center', padding:'40px 20px 40px 44px', gap:8,
              }}>
                <div style={{ width:36, height:36, borderRadius:'50%', border:'1.5px solid rgba(233,135,43,0.35)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10 }}>
                  <div style={{ width:16, height:16, borderRadius:'50%', background:'rgba(233,135,43,0.25)' }} />
                </div>

                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:900, color:'#E9872B', letterSpacing:'0.5px', lineHeight:1.25, textTransform:'uppercase' }}>
                  Right to<br/>Education
                </span>

                <div style={{ width:48, height:1.5, background:'rgba(233,135,43,0.4)', margin:'6px 0' }} />

                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.5)', letterSpacing:'2.5px', textTransform:'uppercase' }}>
                  RTE Act 2009
                </span>

                <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:14 }}>
                  <div style={{ width:18, height:1, background:'rgba(233,135,43,0.35)' }} />
                  <div style={{ width:4, height:4, borderRadius:'50%', background:'rgba(233,135,43,0.55)' }} />
                  <div style={{ width:18, height:1, background:'rgba(233,135,43,0.35)' }} />
                </div>
              </div>

              {/* Bottom bar */}
              <div style={{ position:'absolute', bottom:28, left:44, right:16, height:2, background:'rgba(233,135,43,0.4)', borderRadius:1 }} />
            </div>
          </div>
        </div>

        {/* ── RIGHT content panel — 55% width, right-aligned ─────────────── */}
        <div style={{
          position: 'absolute',
          top: 0, right: 0,
          width: '55%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '40px 48px',
          overflow: 'hidden',
        }}>
          {/* Subtle backdrop glow */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            width: '120%', height: '120%',
            background: 'radial-gradient(circle at center, rgba(233,135,43,0.03) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }} />
          {/* ─── Block 1 — Headline + CTA ──────────────────────────────── */}
          <div ref={block1Ref} style={{ position:'absolute', width:'100%', maxWidth:580, willChange:'transform,opacity' }}>
            <div style={{ display:'inline-block', background:'rgba(233,135,43,0.15)', color:'#c97220', padding:'5px 16px', borderRadius:99, fontSize:12, fontWeight:700, letterSpacing:'1px', textTransform:'uppercase', marginBottom:20 }}>
              Right to Education Act 2009
            </div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(32px,4vw,60px)', fontWeight:900, lineHeight:1.1, color:'#1A2744', margin:'0 0 4px' }}>
              Understanding Your
            </h1>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(32px,4vw,60px)', fontWeight:900, lineHeight:1.1, color:'#E9872B', margin:'0 0 20px' }}>
              Right to Education
            </h1>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:16, color:'rgba(40,40,40,0.68)', lineHeight:1.75, marginBottom:28, maxWidth:480 }}>
              Track compliance across 36 states, file grievances, access legal resources, and connect with a community fighting for every child's right to a free and fair education.
            </p>
            {/* Search */}
            <Link to="/search" style={{ textDecoration:'none', display:'block', maxWidth:480, marginBottom:20 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 20px', background:'white', borderRadius:14, border:'1.5px solid rgba(26,39,68,0.12)', boxShadow:'0 4px 20px rgba(26,39,68,0.08)', cursor:'text' }}>
                <svg width="18" height="18" fill="none" stroke="rgba(26,39,68,0.35)" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <span style={{ color:'rgba(26,39,68,0.35)', fontSize:14, flex:1 }}>Search states, news, questions, documents…</span>
                <span style={{ fontFamily:'monospace', fontSize:11, color:'rgba(26,39,68,0.25)', border:'1px solid rgba(26,39,68,0.15)', padding:'2px 6px', borderRadius:4 }}>⌘K</span>
              </div>
            </Link>
            {/* CTAs */}
            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              <Link to="/states" className="btn-primary" style={{ fontSize:14, padding:'10px 22px' }}>
                Explore States <ArrowRightIcon style={{ width:14, height:14 }} />
              </Link>
              <Link to="/grievances/file" style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'10px 22px', borderRadius:12, fontWeight:600, fontSize:14, color:'#1A2744', border:'2px solid rgba(26,39,68,0.2)', textDecoration:'none' }}>
                File a Grievance
              </Link>
            </div>
          </div>

          {/* ─── Block 2 — Quick Access Cards ──────────────────────────── */}
          <div ref={block2Ref} style={{ position:'absolute', width:'100%', maxWidth:580, willChange:'transform,opacity' }}>
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#E9872B' }}>Quick Access</span>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(22px,3vw,34px)', fontWeight:700, color:'#1A2744', marginTop:6, marginBottom:18 }}>
              Where would you like to go?
            </h2>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              {quickCards.map((card) => (
                <Link key={card.title} to={card.href} style={{ textDecoration:'none' }}>
                  <div
                    style={{ padding:18, background:'white', borderRadius:16, border:'1.5px solid rgba(26,39,68,0.07)', boxShadow:'0 2px 12px rgba(26,39,68,0.06)', cursor:'pointer', transition:'all 0.25s' }}
                    onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(26,39,68,0.14)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 12px rgba(26,39,68,0.06)' }}
                  >
                    <div style={{ width:40, height:40, borderRadius:10, background:card.color+'18', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10 }}>
                      <card.icon style={{ width:20, height:20, color:card.color }} />
                    </div>
                    <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:14, color:'#1A2744', marginBottom:4 }}>{card.title}</p>
                    <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'rgba(50,50,50,0.55)', lineHeight:1.5 }}>{card.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ─── Block 3 — Statistics ──────────────────────────────────── */}
          <div ref={block3Ref} style={{ position:'absolute', width:'100%', maxWidth:580, willChange:'transform,opacity' }}>
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#E9872B' }}>Impact So Far</span>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(22px,3vw,34px)', fontWeight:700, color:'#1A2744', marginTop:6, marginBottom:24 }}>
              Numbers that matter
            </h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
              {heroStats.map(s => (
                <div key={s.label} style={{ padding:'24px 16px', background:'white', borderRadius:16, border:'1.5px solid rgba(26,39,68,0.07)', boxShadow:'0 2px 16px rgba(26,39,68,0.06)', textAlign:'center' }}>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(26px,3vw,40px)', fontWeight:800, color:'#1A2744', lineHeight:1, marginBottom:8 }}>
                    <CountUp target={s.value} suffix={s.suffix} />
                  </div>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'rgba(50,50,50,0.55)', fontWeight:500 }}>{s.label}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop:24, display:'flex', gap:12, flexWrap:'wrap' }}>
              <Link to="/community/questions" className="btn-primary" style={{ fontSize:14, padding:'10px 22px' }}>
                Browse Questions <ArrowRightIcon style={{ width:14, height:14 }} />
              </Link>
              <Link to="/grievances/file" style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'10px 22px', borderRadius:12, fontWeight:600, fontSize:14, color:'#1A2744', border:'2px solid rgba(26,39,68,0.2)', textDecoration:'none' }}>
                File Grievance
              </Link>
            </div>
          </div>

          {/* ─── Block 4 — Featured Insights + Community Q&A ────────── */}
          <div ref={block4Ref} style={{ position:'absolute', width:'100%', maxWidth:580, willChange:'transform,opacity', display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            {/* News */}
            <div>
              <span style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#E9872B', display:'block', marginBottom:8 }}>Latest News</span>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:'#1A2744', marginBottom:12 }}>What's happening</h2>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {latestNews.map(n => (
                  <Link key={n.id} to={`/news/${n.id}`} style={{ textDecoration:'none' }}>
                    <div
                      style={{ padding:'10px 12px', background:'white', borderRadius:10, border:'1.5px solid rgba(26,39,68,0.07)', transition:'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(26,39,68,0.1)' }}
                      onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none' }}
                    >
                      <div style={{ display:'flex', gap:5, marginBottom:5 }}>
                        <span className="badge-navy" style={{ fontSize:9 }}>{n.state}</span>
                        <span className="badge-saffron" style={{ fontSize:9 }}>{n.category}</span>
                      </div>
                      <p style={{ fontSize:11, fontWeight:600, color:'#1A2744', lineHeight:1.45 }}>{n.title}</p>
                      <p style={{ fontSize:10, color:'rgba(50,50,50,0.45)', marginTop:3 }}>{n.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link to="/news" style={{ display:'inline-flex', alignItems:'center', gap:3, marginTop:8, fontSize:11, fontWeight:700, color:'#E9872B', textDecoration:'none' }}>
                All news <ArrowRightIcon style={{ width:11, height:11 }} />
              </Link>
            </div>
            {/* Q&A */}
            <div>
              <span style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#E9872B', display:'block', marginBottom:8 }}>Community</span>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:'#1A2744', marginBottom:12 }}>Recent questions</h2>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {recentQuestions.map(q => (
                  <Link key={q.id} to={`/community/questions/${q.id}`} style={{ textDecoration:'none' }}>
                    <div
                      style={{ padding:'10px 12px', background:'white', borderRadius:10, border:'1.5px solid rgba(26,39,68,0.07)', transition:'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(26,39,68,0.1)' }}
                      onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none' }}
                    >
                      <p style={{ fontSize:11, fontWeight:600, color:'#1A2744', lineHeight:1.45, marginBottom:5 }}>{q.title}</p>
                      <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:10, color:'rgba(50,50,50,0.45)' }}>
                        <span className="badge-navy" style={{ fontSize:9 }}>{q.state}</span>
                        <span style={{ display:'flex', alignItems:'center', gap:2 }}>
                          <ChatBubbleLeftRightIcon style={{ width:11, height:11 }} /> {q.answers} answers
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link to="/community/questions" style={{ display:'inline-flex', alignItems:'center', gap:3, marginTop:8, fontSize:11, fontWeight:700, color:'#E9872B', textDecoration:'none' }}>
                Browse all <ArrowRightIcon style={{ width:11, height:11 }} />
              </Link>
            </div>
          </div>

          {/* ─── Block 5 — State Compliance ───────────────────────────── */}
          <div ref={block5Ref} style={{ position:'absolute', width:'100%', maxWidth:580, willChange:'transform,opacity' }}>
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#E8872A', display:'block', marginBottom:6 }}>State Compliance</span>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(22px,3vw,34px)', fontWeight:700, color:'#1A2744', marginTop:6, marginBottom:18 }}>How is your state doing?</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12 }}>
              {featuredStates.slice(0, 4).map(state => {
                const c = scoreColor(state.score)
                return (
                  <Link key={state.slug} to={`/states/${state.slug}`} style={{ textDecoration:'none' }}>
                    <div className="card-hover" style={{ padding:14, borderRadius:14, border:'1.5px solid rgba(26,39,68,0.08)', background:'white', boxShadow:'0 2px 8px rgba(26,39,68,0.04)' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                        <p style={{ fontWeight:700, color:'#1A2744', fontSize:13 }}>{state.name}</p>
                        <span style={{ background:c.bg, color:c.text, padding:'2px 8px', borderRadius:99, fontSize:11, fontWeight:800 }}>{state.score}</span>
                      </div>
                      <div style={{ height:4, borderRadius:99, background:'rgba(26,39,68,0.07)', overflow:'hidden', marginBottom:6 }}>
                        <div style={{ height:'100%', width:`${state.score}%`, background:c.bar, borderRadius:99 }} />
                      </div>
                      <span style={{ fontSize:10, fontWeight:700, color:c.text, textTransform:'uppercase' }}>{state.label}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
            <Link to="/states" style={{ display:'inline-flex', alignItems:'center', gap:3, marginTop:16, fontSize:11, fontWeight:700, color:'#E9872B', textDecoration:'none' }}>
              View All 36 States <ArrowRightIcon style={{ width:12, height:12 }} />
            </Link>
          </div>

          {/* ─── Block 6 — Features ───────────────────────────────────── */}
          <div ref={block6Ref} style={{ position:'absolute', width:'100%', maxWidth:580, willChange:'transform,opacity' }}>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(18px,2.5vw,28px)', fontWeight:700, color:'#1A2744', marginBottom:20 }}>
              Practical tools to <span style={{ color:'#E8872A' }}>take action</span> today
            </h2>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {[
                { icon:MapPinIcon,              title:'State Tracker',    desc:'Real-time compliance scores', href:'/states',               color:'#1A2744' },
                { icon:ShieldCheckIcon,          title:'File Grievances', desc:'Evidence-based resolution',   href:'/grievances/file',       color:'#E8872A' },
                { icon:ChatBubbleLeftRightIcon,  title:'Community forum', desc:'Ask experts anything',        href:'/community/questions',   color:'#2E7D32' },
                { icon:DocumentTextIcon,         title:'RTE library',     desc:'All acts and judgements',     href:'/blog',                  color:'#C62828' },
              ].map(f => (
                <Link key={f.title} to={f.href} style={{ textDecoration:'none' }}>
                  <div className="card-hover" style={{ padding:16, borderRadius:14, border:'1.5px solid rgba(26,39,68,0.07)', background:'white', display:'flex', gap:12, alignItems:'center' }}>
                    <div style={{ width:40, height:40, borderRadius:10, background:f.color+'18', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <f.icon style={{ width:20, height:20, color:f.color }} />
                    </div>
                    <div>
                      <h3 style={{ fontWeight:700, color:'#1A2744', fontSize:13, marginBottom:2 }}>{f.title}</h3>
                      <p style={{ fontSize:11, color:'rgba(50,50,50,0.55)', lineHeight:1.3 }}>{f.desc}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ─── Block 7 — Final CTA ──────────────────────────────────── */}
          <div ref={block7Ref} style={{ position:'absolute', width:'100%', maxWidth:580, textAlign:'center', willChange:'transform,opacity' }}>
            <div style={{ width:60, height:60, borderRadius:'50%', background:'rgba(232,135,42,0.12)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
              <UsersIcon style={{ width:30, height:30, color:'#E8872A' }} />
            </div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(24px,3.5vw,42px)', fontWeight:800, color:'#1A2744', marginBottom:16, lineHeight:1.2 }}>
              Join thousands of citizens advocating for education.
            </h2>
            <p style={{ color:'rgba(50,50,50,0.6)', fontSize:16, marginBottom:28, maxWidth:440, margin:'0 auto 28px' }}>
              Register for free to ask questions, track grievances, and make your voice heard in the fight for every child's right.
            </p>
            <Link to="/register" className="btn-primary" style={{ fontSize:15, padding:'14px 36px', borderRadius:16 }}>
              Get Started for Free <ArrowRightIcon style={{ width:16, height:16 }} />
            </Link>
          </div>
        </div>{/* /RIGHT content panel */}
      </div>{/* /stickyPanel */}
    </div>{/* /scrollContainerRef */}

   
    </>
  )
}


