/**
 * LandingPage.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Redesigned Landing Page with:
 * 1. Hero Swiper Slider with dynamic/admin content.
 * 2. Scroll-driven Book Interaction using GSAP and Swiper/React.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

gsap.registerPlugin(ScrollTrigger);

import api from '../services/api';

const fetchActiveSlides = async () => {
  try {
    const res = await api.get('/slider');
    return res.data.data.slides;
  } catch (err) {
    console.error('Failed to fetch slides:', err);
    return [];
  }
};

const fetchBookConfig = async () => {
  try {
    const res = await api.get('/book');
    return res.data.data.content || [];
  } catch (err) {
    console.error('Failed to fetch book content:', err);
    return [];
  }
};

export default function LandingPage() {
  const [slides, setSlides] = useState([]);
  const [bookContent, setBookContent] = useState([]);
  
  useEffect(() => {
    fetchActiveSlides().then(setSlides);
    fetchBookConfig().then(setBookContent);
  }, []);

  return (
    <div className="bg-[#FAF7F2] font-sans text-gray-800">
      
      {/* 1. Hero Dynamic Slider Section */}
      <HeroSlider slides={slides} />

      {/* 2. Scroll-Triggered Book Section */}
      {bookContent.length > 0 && <BookScrollSection bookContent={bookContent} />}

    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   HERO SLIDER
───────────────────────────────────────────────────────────────────────────── */
function SwiperNavButtons() {
  const swiper = useSwiper();
  return (
    <div className="flex gap-4 mt-8">
      <button onClick={(e) => { e.preventDefault(); swiper.slidePrev(); }} className="w-11 h-11 rounded-full border-2 border-[#1A2744]/20 text-[#1A2744] flex items-center justify-center hover:bg-[#E9872B] hover:border-[#E9872B] hover:text-white transition-all">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
      </button>
      <button onClick={(e) => { e.preventDefault(); swiper.slideNext(); }} className="w-11 h-11 rounded-full border-2 border-[#1A2744]/20 text-[#1A2744] flex items-center justify-center hover:bg-[#E9872B] hover:border-[#E9872B] hover:text-white transition-all">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
      </button>
    </div>
  );
}

function HeroSlider({ slides }) {
  if (!slides || slides.length === 0) return <div className="h-[70vh] w-full bg-[#FAF7F2]"></div>;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-24 mt-8 relative z-10">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={800}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        className="w-full shadow-xl border border-gray-100 bg-white"
      >
        {slides.map(slide => (
           <SwiperSlide key={slide.id}>
             <div className="flex flex-col lg:flex-row h-full bg-white">
               
               {/* Left Column */}
               <div className="w-full lg:w-[62%] flex flex-col cursor-pointer group p-6 lg:p-12 lg:pr-8" onClick={() => window.open(slide.leftLink, '_blank')}>
                 <div className="relative w-full h-[250px] md:h-[350px] overflow-hidden mb-8">
                   <img src={slide.leftImage} alt={slide.leftTitle} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
                 </div>
                 <div className="flex items-center gap-4 text-sm font-semibold text-[#E9872B] uppercase tracking-wide mb-3">
                   <span>{slide.leftCategory}</span>
                   <span className="text-gray-300">•</span>
                   <span className="text-gray-500">{slide.leftReadTime}</span>
                 </div>
                 <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1A2744] mb-4 group-hover:text-[#E9872B] transition-colors">{slide.leftTitle}</h2>
                 <p className="text-gray-600 text-lg leading-relaxed">{slide.leftDesc}</p>
               </div>

               {/* Right Column */}
               <div className="w-full lg:w-[38%] bg-[#FAF5F0] p-8 lg:p-12 border-t lg:border-t-0 lg:border-l border-gray-100 flex flex-col justify-between">
                 <div>
                   <span className="inline-block bg-[#A06135] text-white px-4 py-1.5 text-xs font-bold tracking-widest uppercase mb-8 shadow-sm">
                     {slide.rightLabel}
                   </span>
                   <h3 className="text-2xl md:text-3xl font-bold font-serif text-[#1A2744] leading-snug mb-6">
                     {slide.rightTitle}
                   </h3>
                   <p className="text-gray-700 text-lg leading-relaxed">
                     {slide.rightDesc}
                   </p>
                 </div>
                 
                 {/* Navigation Arrows */}
                 <SwiperNavButtons />
               </div>

             </div>
           </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}


/* ─────────────────────────────────────────────────────────────────────────────
   BOOK SCROLL SECTION
───────────────────────────────────────────────────────────────────────────── */
function BookScrollSection({ bookContent }) {
  const containerRef = useRef(null);
  const stickyRef = useRef(null);
  
  // Book elements
  const bookRef = useRef(null);
  const coverRef = useRef(null);
  
  // Pages refs
  const pagesWrapRef = useRef(null);
  const pagesConfig = useRef([]);
  // Assigning refs dynamically
  const getPageRef = (index) => {
    if (!pagesConfig.current[index]) {
      pagesConfig.current[index] = React.createRef();
    }
    return pagesConfig.current[index];
  };

  useGSAP(() => {
    const pages = pagesConfig.current.map(p => p.current).filter(Boolean);
    if (!containerRef.current || !coverRef.current || pages.length === 0) return;

    // Reset initial states
    gsap.set(coverRef.current, { rotateY: 0, transformOrigin: 'left center', transformStyle: 'preserve-3d' });
    pages.forEach(p => gsap.set(p, { rotateY: 0, transformOrigin: 'left center', transformStyle: 'preserve-3d' }));

    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${(pages.length + 2) * 100}%`, // Length depends on number of flips
        pin: stickyRef.current,
        scrub: 1, // Smooth scrub
        anticipatePin: 1,
      }
    });

    // 1. Initial scale & open book cover
    masterTl.to(bookRef.current, { scale: 1.1, duration: 1, ease: 'power1.inOut' }, 0);
    masterTl.to(coverRef.current, { rotateY: -160, duration: 2, ease: 'power2.inOut', zIndex: 10 }, 0.5);

    // 2. Flip each page sequentially
    let timeStamp = 2.5;
    const pageFlipDuration = 2;
    const holdDuration = 1.5;

    pages.forEach((page, index) => {
      // Rotate the page from 0 to -160
      masterTl.to(page, { 
        rotateY: -160, 
        duration: pageFlipDuration, 
        ease: 'power1.inOut',
        zIndex: 50 + index, // Ensure stacking order is somewhat maintained
      }, timeStamp);
      
      timeStamp += pageFlipDuration + holdDuration;
    });

    // 3. Close the book at the very end
    masterTl.to([...pages].reverse(), { 
      rotateY: 0, 
      zIndex: (i, target) => 100 - pages.indexOf(target), // Reset zIndex back to initial
      duration: 2, 
      ease: 'power2.inOut',
    }, timeStamp);

    masterTl.to(coverRef.current, { 
      rotateY: 0, 
      zIndex: 150, // Ensure cover floats strictly on top 
      duration: 2, 
      ease: 'power2.inOut' 
    }, timeStamp + 0.2);

    masterTl.to(bookRef.current, { scale: 0.9, opacity: 0, y: 150, duration: 1.5, ease: 'power2.inOut' }, timeStamp + 2);

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full">
      
      {/* Sticky Screen */}
      <div 
        ref={stickyRef} 
        className="w-full h-screen overflow-hidden flex items-center justify-center bg-[#FAF7F2] relative perspective-[2000px]"
        style={{ perspective: '2000px' }}
      >
        
        {/* Book Container */}
        <div ref={bookRef} className="relative w-[900px] max-w-[95vw] h-[600px] max-h-[85vh] preserve-3d" style={{ transform: 'rotateX(15deg)' }}>
          
          {/* Back Cover (Right) */}
          <div className="absolute right-0 top-0 w-1/2 h-full bg-[#1A2744] rounded-r-xl border-[3px] border-[#0F182B] shadow-2xl z-0" />
          
          {/* Pages Wrapper (Right side, below flipping pages) */}
          <div className="absolute right-0 top-1 bottom-1 w-1/2 bg-[#FFFDF5] rounded-r-md border-y border-r border-[#E8DCC2] shadow-inner z-10 flex flex-col justify-center items-center p-10 text-center">
            {/* The very last page text (visible after all flips) */}
             <div className="opacity-40 select-none">
                 <h2 className="font-serif text-3xl font-bold text-[#1A2744] mb-4">End of Document</h2>
                 <p className="text-sm font-sans tracking-widest text-[#E9872B]">RTE ACT 2009</p>
             </div>
          </div>

          {/* Spine */}
          <div className="absolute left-1/2 top-0 bottom-0 w-10 -ml-5 bg-[#0F182B] rounded-sm z-20 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] preserve-3d" />

          {/* Flipping Pages Stack */}
          <div ref={pagesWrapRef} className="absolute right-0 top-1 bottom-1 w-1/2 z-30 preserve-3d">
            {bookContent.map((item, index) => {
              const isLast = index === bookContent.length - 1;
              
              // Each flipping unit is a 2-sided div. Origin is left.
              return (
                <div 
                  key={index}
                  ref={getPageRef(index)}
                  className="absolute inset-0 origin-left z-[40] preserve-3d"
                  style={{ zIndex: 100 - index }} // Top pages higher zIndex
                >
                  {/* Front Side */}
                  <div className="absolute inset-0 bg-[#FFFDF5] rounded-r-md border border-[#E8DCC2] flex flex-col p-8 overflow-hidden shadow-[-2px_0_10px_rgba(0,0,0,0.05)] backface-hidden">
                    
                    {/* Page Content Rendering */}
                    {item.type === 'contents' ? (
                       <div className="w-full h-full text-left">
                         <h2 className="text-3xl font-serif font-bold text-[#1A2744] mb-6 pb-2 border-b-2 border-[#E9872B]/30 uppercase tracking-wide">
                           {item.title}
                         </h2>
                         <ul className="space-y-4">
                           {item.items.map((listItem, i) => (
                             <li key={i} className="flex font-sans text-lg text-gray-700 font-medium">
                               <span className="text-[#E9872B] font-bold mr-3">{i+1}.</span> 
                               {listItem}
                             </li>
                           ))}
                         </ul>
                       </div>
                    ) : (
                       <div className="w-full h-full flex flex-col justify-center text-left">
                         <span className="text-xs font-bold tracking-[3px] uppercase text-[#E9872B] mb-4">RTE Act 2009</span>
                         <h2 className="text-4xl lg:text-5xl font-serif font-extrabold text-[#1A2744] mb-8 leading-tight">
                           {item.title}
                         </h2>
                         <div className="w-16 h-1 bg-[#1A2744]/20 mb-8" />
                         <p className="text-lg lg:text-xl text-gray-600 leading-relaxed font-serif">
                           {item.desc}
                         </p>
                       </div>
                    )}

                    {/* Page number front */}
                    <div className="absolute bottom-6 right-8 text-sm text-gray-400 font-serif font-bold">
                      {index * 2 + 1}
                    </div>
                  </div>

                  {/* Back Side */}
                  <div className="absolute inset-0 bg-[#FBF9F2] rounded-l-md border border-[#E8DCC2] flex flex-col p-8 justify-center items-center shadow-[2px_0_10px_rgba(0,0,0,0.05)] backface-hidden" style={{ transform: 'rotateY(180deg)' }}>
                     <p className="text-gray-400 font-serif text-lg italic text-center max-w-sm">
                       {isLast ? "This concludes the summary of the main chapters." : "Please continue to the next page..."}
                     </p>
                     
                     {/* Page number back */}
                     <div className="absolute bottom-6 left-8 text-sm text-gray-400 font-serif font-bold">
                      {index * 2 + 2}
                     </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cover (Left when open, covers right when closed initially) */}
          <div 
            ref={coverRef}
            className="absolute right-0 top-0 w-1/2 h-full origin-left z-50 bg-[#1A2744] rounded-r-xl shadow-[-5px_0_20px_rgba(0,0,0,0.3)] border-[3px] border-[#0F182B] flex items-center justify-center cursor-default preserve-3d"
          >
             {/* Front of Cover (visible when closed) */}
             <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[#1A2744] rounded-r-lg border-[10px] border-double border-[#E9872B]/30 backface-hidden">
               <div className="w-16 h-16 rounded-full border border-[#E9872B] flex items-center justify-center mb-6">
                 <div className="w-8 h-8 rounded-full bg-[#E9872B]/50" />
               </div>
               <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#E9872B] uppercase tracking-widest leading-snug">
                 Right to<br/>Education
               </h1>
               <div className="w-12 h-0.5 bg-[#E9872B]/60 my-6" />
               <p className="text-white/60 text-sm tracking-[4px] font-sans uppercase">Act 2009</p>
             </div>

             {/* Back of Cover (visible when open, rotated left) */}
             <div className="absolute inset-0 bg-[#16213A] rounded-l-lg border-l-2 border-white/5 flex items-center justify-center shadow-inner backface-hidden" style={{ transform: 'rotateY(180deg)' }}>
               <div className="text-white/10 font-serif text-2xl rotate-[-90deg] uppercase tracking-widest font-bold whitespace-nowrap">
                 Department of Education
               </div>
             </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}
