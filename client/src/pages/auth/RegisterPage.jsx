import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const states = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Chandigarh','Puducherry','Andaman & Nicobar','Lakshadweep','Dadra & NH']

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', state: '', userType: '' })
  const [step, setStep] = useState(1)

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div style={{ paddingTop: '64px', background: '#F5EFE0', minHeight: '100vh' }}
      className="flex items-center justify-center px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-white rounded-3xl p-8 shadow-card">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#E8872A,#f0a952)' }}>
              <span className="text-white font-bold font-display">RTE</span>
            </div>
            <h1 className="text-h2 font-display" style={{ color: '#1A2744' }}>Create account</h1>
            <p className="text-sm text-muted mt-1">Join the RTE advocacy community</p>
          </div>

          {/* Progress */}
          <div className="flex gap-2 mb-8">
            {[1,2].map(n => (
              <div key={n} className="flex-1 h-1.5 rounded-full transition-all duration-300"
                style={{ background: step >= n ? '#E8872A' : 'rgba(26,39,68,0.1)' }} />
            ))}
          </div>

          <form onSubmit={e => e.preventDefault()} className="space-y-4">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">Full name</label>
                  <input type="text" placeholder="Ayush Pandey" value={form.name} onChange={e => update('name', e.target.value)} className="input-rte" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">Email address</label>
                  <input type="email" placeholder="you@example.com" value={form.email} onChange={e => update('email', e.target.value)} className="input-rte" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">Password</label>
                  <input type="password" placeholder="Min. 8 characters" value={form.password} onChange={e => update('password', e.target.value)} className="input-rte" />
                </div>
                <button type="button" onClick={() => setStep(2)} className="btn-primary w-full justify-center py-3.5">
                  Continue →
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">Your state</label>
                  <select value={form.state} onChange={e => update('state', e.target.value)} className="input-rte">
                    <option value="">Select your state / UT</option>
                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">I am a…</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Parent', 'Student', 'Educator', 'Activist', 'Journalist', 'Official'].map(type => (
                      <button key={type} type="button"
                        onClick={() => update('userType', type)}
                        className="py-3 rounded-xl text-sm font-semibold border-2 transition-all"
                        style={{
                          borderColor: form.userType === type ? '#E8872A' : 'rgba(26,39,68,0.12)',
                          background: form.userType === type ? 'rgba(232,135,42,0.08)' : 'white',
                          color: form.userType === type ? '#E8872A' : '#888',
                        }}>
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 justify-center py-3">← Back</button>
                  <button type="submit" className="btn-primary flex-1 justify-center py-3">Create Account</button>
                </div>
              </motion.div>
            )}
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Already have an account? <Link to="/login" className="font-semibold" style={{ color: '#1A2744' }}>Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
