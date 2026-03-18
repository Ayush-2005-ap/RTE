import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const rights = [
  { emoji: '🏫', title: 'Free Neighbourhood School', desc: 'Every child has the right to attend a government school within a defined neighbourhood, completely free of cost.', color: '#1A2744' },
  { emoji: '📚', title: 'Free Textbooks & Materials', desc: 'Schools must provide free textbooks, stationery, and uniforms (where applicable) to all students.', color: '#E8872A' },
  { emoji: '🍱', title: 'Mid-Day Meal', desc: 'Children in government schools have the right to a nutritious mid-day meal on all school days.', color: '#2E7D32' },
  { emoji: '🚌', title: 'Transport to School', desc: 'If a neighbourhood school is unavailable, the government must provide free transport to the nearest school.', color: '#558B2F' },
  { emoji: '🚫', title: 'No Capitation Fees', desc: 'Schools cannot demand any donation, capitation fee, or entrance test for admission under RTE.', color: '#C62828' },
  { emoji: '🏆', title: 'No Discrimination', desc: 'No child shall be subjected to physical or mental harassment, discrimination on grounds of religion, caste, sex, or disability.', color: '#1A2744' },
  { emoji: '📋', title: '25% EWS Seats in Private Schools', desc: 'Children from EWS and disadvantaged groups can claim 25% of seats in private unaided schools, free of cost.', color: '#E8872A' },
  { emoji: '🎓', title: 'Certificate of Completion', desc: 'Schools must issue a transfer certificate on demand and cannot withhold records to deny completion credentials.', color: '#2E7D32' },
]

export default function RightsPage() {
  return (
    <div style={{ paddingTop: '64px' }}>
      <div className="py-16 px-4" style={{ background: 'linear-gradient(135deg,#1A2744,#243356)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-semibold uppercase tracking-widest mb-3 block" style={{ color: '#E8872A' }}>Know Your RTE</span>
            <h1 className="text-hero text-white mb-4" style={{ fontFamily: "'Playfair Display',serif" }}>Children's Rights</h1>
            <p className="text-xl text-white/65 max-w-2xl mx-auto">Every child in India has the following rights under the RTE Act 2009. Know them. Claim them.</p>
          </motion.div>
        </div>
      </div>

      <div className="py-16 px-4" style={{ background: '#F5EFE0' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-5">
            {rights.map((r, i) => (
              <motion.div key={r.title}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <div className="bg-white rounded-2xl p-6 border card-hover h-full" style={{ borderColor: 'rgba(26,39,68,0.07)' }}>
                  <div className="text-3xl mb-3">{r.emoji}</div>
                  <h3 className="font-semibold text-ink mb-2 text-lg">{r.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{r.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-12 p-8 rounded-3xl text-center"
            style={{ background: 'linear-gradient(135deg,#1A2744,#243356)' }}>
            <h2 className="font-display font-bold text-2xl text-white mb-3">Is your child's right being violated?</h2>
            <p className="text-white/60 mb-6">Our platform helps you file a formal complaint and track its resolution.</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
