import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { BookOpenIcon, ScaleIcon, ShieldCheckIcon, AcademicCapIcon } from '@heroicons/react/24/outline'

const provisions = [
  { title: 'Free & Compulsory Education', desc: 'Every child between 6 and 14 years of age has the right to free and compulsory elementary education (Classes 1-8) in a neighbourhood school.' },
  { title: '25% EWS Reservation', desc: 'Every private unaided school must reserve 25% seats for children from economically weaker sections and disadvantaged groups.' },
  { title: 'No Detention Policy', desc: 'No child can be held back in any class or expelled from school until completion of elementary education.' },
  { title: 'School Quality Norms', desc: 'Schools must meet prescribed standards on infrastructure, teacher-pupil ratio, working days and teaching hours.' },
  { title: 'Trained Teachers', desc: 'All teachers must possess minimum qualifications as prescribed by the academic authority. Untrained teachers must acquire qualifications within 5 years.' },
  { title: 'School Management Committees', desc: 'Every government and aided school must constitute an SMC with 75% representation from parents/guardians.' },
]

export default function AboutRTEPage() {
  return (
    <div style={{ paddingTop: '64px' }}>
      <div className="py-16 px-4" style={{ background: 'linear-gradient(135deg,#1A2744,#243356)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <BookOpenIcon className="w-14 h-14 mx-auto mb-5 opacity-60" style={{ color: '#E8872A' }} />
            <h1 className="text-hero text-white mb-4" style={{ fontFamily: "'Playfair Display',serif" }}>Know Your RTE</h1>
            <p className="text-xl text-white/65 max-w-2xl mx-auto">
              The Right of Children to Free and Compulsory Education Act, 2009 — Understanding the law that protects every child's right to learn.
            </p>
          </motion.div>
        </div>
      </div>

      {/* What is RTE */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-xs font-semibold uppercase tracking-widest block mb-3" style={{ color: '#E8872A' }}>The Law</span>
            <h2 className="text-h1 font-display mb-5" style={{ color: '#1A2744' }}>What is the RTE Act?</h2>
            <div className="prose prose-lg max-w-none text-ink">
              <p className="mb-4">The Right of Children to Free and Compulsory Education (RTE) Act, 2009 is a landmark legislation that made India one of 135 countries to make education a fundamental right.</p>
              <p className="mb-4">Enacted on August 4, 2009 and coming into force on April 1, 2010, the Act mandates free and compulsory education for all children between the ages of 6 and 14 years.</p>
              <p>The Act places the responsibility of ensuring enrollment, attendance and completion of elementary education on the State. For the first time, it placed a legal obligation on parents and governments alike to ensure children complete their schooling.</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Provisions */}
      <div className="py-16 px-4" style={{ background: '#F5EFE0' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <span className="text-xs font-semibold uppercase tracking-widest mb-2 block" style={{ color: '#E8872A' }}>Key Provisions</span>
            <h2 className="text-h1 font-display mb-10" style={{ color: '#1A2744' }}>What the Act guarantees</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-5">
            {provisions.map((p, i) => (
              <motion.div key={p.title}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <div className="bg-white rounded-2xl p-6 border card-hover h-full" style={{ borderColor: 'rgba(26,39,68,0.07)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                    style={{ background: 'rgba(232,135,42,0.12)' }}>
                    <ScaleIcon className="w-4.5 h-4.5" style={{ color: '#E8872A' }} />
                  </div>
                  <h3 className="font-semibold text-ink mb-2">{p.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-h2 font-display mb-8" style={{ color: '#1A2744' }}>Key Milestones</h2>
          <div className="space-y-6">
            {[
              { year: '2002', event: '86th Constitutional Amendment — Education added to Part III as Fundamental Right (Article 21A)' },
              { year: '2009', event: 'RTE Act enacted on August 4, 2009 by Parliament of India' },
              { year: '2010', event: 'Act comes into force on April 1, 2010' },
              { year: '2011', event: 'States submit their RTE Rules; 25% EWS reservation begins' },
              { year: '2017', event: 'Supreme Court upholds constitutionality of 25% EWS quota in unaided private schools' },
              { year: '2019', event: 'RTE Amendment — No detention policy modified to allow detention in Class 5 and 8' },
            ].map((m, i) => (
              <div key={m.year} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
                    style={{ background: '#1A2744' }}>{m.year.slice(2)}</div>
                  {i < 5 && <div className="w-0.5 h-6 mt-1" style={{ background: 'rgba(26,39,68,0.12)' }} />}
                </div>
                <div className="pt-2">
                  <span className="text-xs font-semibold text-muted">{m.year}</span>
                  <p className="text-sm text-ink mt-0.5">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-12 px-4" style={{ background: 'rgba(232,135,42,0.08)', borderTop: '1px solid rgba(232,135,42,0.2)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="font-display font-bold text-2xl mb-3" style={{ color: '#1A2744' }}>Know your rights. Exercise them.</h3>
          <p className="text-muted mb-6">If you believe your child's rights are being violated, take action today.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/community/ask" className="btn-secondary">Ask the Community</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
