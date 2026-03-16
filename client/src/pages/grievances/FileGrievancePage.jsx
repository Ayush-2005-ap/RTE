import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon, CloudArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'

const states = ['Maharashtra','Delhi','Karnataka','Kerala','Tamil Nadu','Uttar Pradesh','Gujarat','West Bengal','Rajasthan','Madhya Pradesh','Bihar','Other']
const categories = ['Denial of Admission','Illegal Fees','Infrastructure Issues','Teacher Shortage','Discrimination','Mid-year Expulsion','Other']

function Step1({ form, setForm, next }) {
  return (
    <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">State / UT <span style={{ color: '#C62828' }}>*</span></label>
          <select value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} className="input-rte">
            <option value="">Select state…</option>
            {states.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">Category <span style={{ color: '#C62828' }}>*</span></label>
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-rte">
            <option value="">Select category…</option>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-ink mb-1.5">School Name</label>
        <input type="text" placeholder="Name of the school involved" value={form.school}
          onChange={e => setForm({ ...form, school: e.target.value })} className="input-rte" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-ink mb-1.5">Describe the issue <span style={{ color: '#C62828' }}>*</span></label>
        <textarea rows={5} placeholder="Describe what happened — be as specific as possible with dates, amounts and names."
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          className="input-rte resize-none" />
      </div>
      <button onClick={() => form.state && form.category && form.description && next()} className="btn-primary">
        Continue to Documents <ArrowRightIcon className="w-4 h-4" />
      </button>
    </motion.div>
  )
}

function Step2({ form, setForm, files, setFiles, next, back }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [], 'application/pdf': [] },
    maxSize: 20 * 1024 * 1024,
    onDrop: (accepted) => setFiles(f => [...f, ...accepted]),
  })

  return (
    <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-ink mb-3">Supporting Documents (Optional)</label>
        <div {...getRootProps()} className="border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all"
          style={{
            borderColor: isDragActive ? '#E8872A' : 'rgba(26,39,68,0.2)',
            background: isDragActive ? 'rgba(232,135,42,0.04)' : 'rgba(26,39,68,0.02)',
          }}>
          <input {...getInputProps()} />
          <CloudArrowUpIcon className="w-10 h-10 mx-auto mb-3 text-muted" />
          <p className="font-semibold text-ink text-sm">Drag & drop files here, or click to browse</p>
          <p className="text-xs text-muted mt-1">PDF, PNG, JPG · Max 20MB per file</p>
        </div>
        {files.length > 0 && (
          <div className="mt-3 space-y-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white border"
                style={{ borderColor: 'rgba(26,39,68,0.08)' }}>
                <span className="text-sm text-ink truncate">{f.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted">{(f.size / 1024).toFixed(0)} KB</span>
                  <button onClick={() => setFiles(x => x.filter((_, j) => j !== i))} className="text-muted hover:text-alert transition-colors">
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex gap-3">
        <button onClick={back} className="btn-secondary px-5 py-2.5">← Back</button>
        <button onClick={next} className="btn-primary">Review & Submit <ArrowRightIcon className="w-4 h-4" /></button>
      </div>
    </motion.div>
  )
}

function Step3({ form, files, back, submit }) {
  return (
    <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">
      <div className="rounded-2xl border p-5 space-y-3" style={{ borderColor: 'rgba(26,39,68,0.1)', background: 'rgba(26,39,68,0.02)' }}>
        <h3 className="font-semibold text-ink">Review your grievance</h3>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          {[
            { label: 'State', value: form.state },
            { label: 'Category', value: form.category },
            { label: 'School', value: form.school || 'Not specified' },
            { label: 'Attachments', value: files.length > 0 ? `${files.length} file(s)` : 'None' },
          ].map(item => (
            <div key={item.label}>
              <dt className="text-muted text-xs">{item.label}</dt>
              <dd className="font-semibold text-ink">{item.value}</dd>
            </div>
          ))}
        </div>
        <div>
          <dt className="text-muted text-xs mb-1">Description</dt>
          <dd className="text-sm text-ink leading-relaxed">{form.description}</dd>
        </div>
      </div>
      <p className="text-xs text-muted">
        By submitting, you agree that the information provided is accurate to the best of your knowledge. You will receive a reference number to track your grievance.
      </p>
      <div className="flex gap-3">
        <button onClick={back} className="btn-secondary px-5 py-2.5">← Back</button>
        <button onClick={submit} className="btn-primary flex-1 justify-center">Submit Grievance</button>
      </div>
    </motion.div>
  )
}

function SuccessState({ refNumber }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
      <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-5"
        style={{ background: 'rgba(46,125,50,0.12)' }}>
        <CheckCircleIcon className="w-10 h-10" style={{ color: '#2E7D32' }} />
      </div>
      <h2 className="font-display font-bold text-2xl mb-2" style={{ color: '#1A2744' }}>Grievance Filed!</h2>
      <p className="text-muted mb-4">Your grievance has been submitted successfully.</p>
      <div className="inline-block px-6 py-3 rounded-2xl font-mono text-lg font-bold mb-6"
        style={{ background: 'rgba(26,39,68,0.06)', color: '#1A2744' }}>
        Ref: {refNumber}
      </div>
      <p className="text-sm text-muted mb-8">Save this reference number. You'll receive an email confirmation shortly.</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/grievances/my" className="btn-primary">Track My Grievances</Link>
        <Link to="/" className="btn-secondary">Back to Home</Link>
      </div>
    </motion.div>
  )
}

export default function FileGrievancePage() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [refNumber] = useState(`RTE-2025-${Math.floor(10000 + Math.random() * 90000)}`)
  const [form, setForm] = useState({ state: '', category: '', school: '', description: '' })
  const [files, setFiles] = useState([])

  const steps = ['Details', 'Documents', 'Review']

  return (
    <div style={{ paddingTop: '64px' }}>
      <div className="py-8 px-4" style={{ background: '#F5EFE0', minHeight: '100vh' }}>
        <div className="max-w-xl mx-auto">
          {!submitted && (
            <div className="mb-8">
              <h1 className="text-h1 font-display mb-2" style={{ color: '#1A2744' }}>File a Grievance</h1>
              <p className="text-muted text-sm">We'll track your complaint and notify you of updates.</p>
              {/* Step indicator */}
              <div className="flex items-center gap-2 mt-6">
                {steps.map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                      style={{
                        background: step > i + 1 ? '#2E7D32' : step === i + 1 ? '#E8872A' : 'rgba(26,39,68,0.1)',
                        color: step >= i + 1 ? 'white' : '#888',
                      }}>
                      {step > i + 1 ? '✓' : i + 1}
                    </div>
                    <span className="text-xs font-semibold hidden sm:block"
                      style={{ color: step === i + 1 ? '#E8872A' : '#aaa' }}>{s}</span>
                    {i < steps.length - 1 && <div className="flex-1 h-0.5 w-8" style={{ background: step > i + 1 ? '#2E7D32' : 'rgba(26,39,68,0.1)' }} />}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-3xl p-8 shadow-card">
            <AnimatePresence mode="wait">
              {submitted ? (
                <SuccessState refNumber={refNumber} />
              ) : step === 1 ? (
                <Step1 form={form} setForm={setForm} next={() => setStep(2)} />
              ) : step === 2 ? (
                <Step2 form={form} setForm={setForm} files={files} setFiles={setFiles} next={() => setStep(3)} back={() => setStep(1)} />
              ) : (
                <Step3 form={form} files={files} back={() => setStep(2)} submit={() => setSubmitted(true)} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
