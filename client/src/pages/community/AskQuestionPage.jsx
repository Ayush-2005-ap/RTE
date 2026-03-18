import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/outline'

const states = ['Maharashtra','Delhi','Karnataka','Kerala','Tamil Nadu','Uttar Pradesh','Gujarat','West Bengal','Rajasthan','Madhya Pradesh','Bihar','Other']
const categories = ['Admissions','Fees & Charges','Infrastructure','Teachers','Rights','General']

export default function AskQuestionPage() {
  const [form, setForm] = useState({ title: '', body: '', state: '', category: '' })
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')

  const addTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim()) && tags.length < 5) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput('')
    }
  }

  return (
    <div style={{ paddingTop: '64px' }}>
      <div className="py-8 px-4" style={{ background: '#F5EFE0', minHeight: '100vh' }}>
        <div className="max-w-2xl mx-auto">
          <Link to="/community/questions" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink mb-6 transition-colors">
            <ArrowLeftIcon className="w-4 h-4" /> Back to questions
          </Link>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-white rounded-3xl p-8 shadow-card">
              <h1 className="text-h2 font-display mb-1" style={{ color: '#1A2744' }}>Ask a Question</h1>
              <p className="text-sm text-muted mb-8">Be specific — detailed questions get better answers.</p>

              <form onSubmit={e => e.preventDefault()} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">Question title <span style={{ color: '#C62828' }}>*</span></label>
                  <input type="text" placeholder="e.g. Can a private school charge donation fees from RTE students?"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="input-rte"
                  />
                  <p className="text-xs text-muted mt-1">{form.title.length}/200 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">Describe your situation <span style={{ color: '#C62828' }}>*</span></label>
                  <textarea
                    rows={6}
                    placeholder="Provide as much detail as possible — which school, what happened, what documentation you have…"
                    value={form.body}
                    onChange={e => setForm({ ...form, body: e.target.value })}
                    className="input-rte resize-none"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-1.5">State / UT</label>
                    <select value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} className="input-rte">
                      <option value="">Select state…</option>
                      {states.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-1.5">Category</label>
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-rte">
                      <option value="">Select category…</option>
                      {categories.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">Tags (up to 5)</label>
                  <div className="input-rte flex flex-wrap gap-2 min-h-[48px] items-center cursor-text"
                    onClick={e => e.currentTarget.querySelector('input')?.focus()}>
                    {tags.map(t => (
                      <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{ background: 'rgba(26,39,68,0.1)', color: '#1A2744' }}>
                        #{t}
                        <button type="button" onClick={() => setTags(tags.filter(x => x !== t))}>
                          <XMarkIcon className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag}
                      placeholder={tags.length === 0 ? "Press Enter to add tags…" : ''}
                      className="outline-none bg-transparent flex-1 text-sm min-w-[100px]" />
                  </div>
                  <p className="text-xs text-muted mt-1">Press Enter or comma to add each tag</p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Link to="/community/questions" className="btn-secondary text-sm px-5 py-2.5">Cancel</Link>
                  <button type="submit" className="btn-primary flex items-center gap-2">
                    <PaperAirplaneIcon className="w-4 h-4" /> Post Question
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Tips */}
          <div className="mt-6 p-5 rounded-2xl" style={{ background: 'rgba(232,135,42,0.08)', border: '1px solid rgba(232,135,42,0.2)' }}>
            <h3 className="text-sm font-semibold mb-2" style={{ color: '#E8872A' }}>💡 Tips for a great question</h3>
            <ul className="text-xs text-muted space-y-1">
              <li>• Include the name of the state and type of school</li>
              <li>• Mention any documents you have</li>
              <li>• Describe what you've already tried</li>
              <li>• Be specific about dates and amounts involved</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
