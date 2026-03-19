import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PencilIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import api from '../../../services/api'
import { toast } from 'react-hot-toast'

export default function AdminStates() {
  const [states, setStates] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  
  const [form, setForm] = useState({ complianceScore: '', complianceLabel: 'No Data', keyIssue: '', contactEmail: '', region: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchStates() }, [])

  const fetchStates = async () => {
    try {
      setLoading(true)
      const res = await api.get('/states')
      setStates(res.data.data.states)
    } catch { toast.error('Failed to load states') }
    finally { setLoading(false) }
  }

  const openEdit = (item) => {
    setEditing(item._id)
    setForm({ 
        complianceScore: item.complianceScore || '', 
        complianceLabel: item.complianceLabel || 'No Data', 
        keyIssue: item.keyIssue || '', 
        contactEmail: item.contactEmail || '', 
        region: item.region || '' 
    })
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.patch(`/states/${editing}`, form)
      toast.success('State updated!')
      setShowForm(false)
      fetchStates()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save')
    } finally { setSaving(false) }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1A2744' }}>States Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage compliance data and state-specific settings</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12"><ArrowPathIcon className="w-8 h-8 animate-spin text-gray-300" /></div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-gray-400">State</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Region</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Compliance Score</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Label</th>
                <th className="text-right p-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {states.map((item) => (
                <tr key={item._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-semibold text-gray-800">{item.name}</td>
                  <td className="p-4 text-gray-500">{item.region || '-'}</td>
                  <td className="p-4">
                      {item.complianceScore !== undefined && item.complianceScore !== null ? (
                          <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                  <div className={`h-full ${item.complianceScore > 75 ? 'bg-green-500' : item.complianceScore > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${item.complianceScore}%` }} />
                              </div>
                              <span className="font-semibold text-xs">{item.complianceScore}%</span>
                          </div>
                      ) : <span className="text-gray-400 text-xs italic">Not set</span>}
                  </td>
                  <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${item.complianceLabel === 'High' ? 'bg-green-50 text-green-700' : item.complianceLabel === 'Medium' ? 'bg-yellow-50 text-yellow-700' : item.complianceLabel === 'Low' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-500'}`}>
                          {item.complianceLabel}
                      </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"><PencilIcon className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-lg" style={{ color: '#1A2744' }}>Edit State Data</h2>
                <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-gray-100"><XMarkIcon className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Compliance Score (0-100)</label>
                        <input type="number" min="0" max="100" value={form.complianceScore} onChange={e => setForm(f => ({ ...f, complianceScore: e.target.value }))} className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Compliance Label</label>
                        <select value={form.complianceLabel} onChange={e => setForm(f => ({ ...f, complianceLabel: e.target.value }))} className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none">
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                            <option value="No Data">No Data</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Region</label>
                    <select value={form.region} onChange={e => setForm(f => ({ ...f, region: e.target.value }))} className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none">
                        <option value="">Select Region...</option>
                        <option value="North">North</option>
                        <option value="South">South</option>
                        <option value="East">East</option>
                        <option value="West">West</option>
                        <option value="Central">Central</option>
                        <option value="Northeast">Northeast</option>
                        <option value="UT">UT</option>
                    </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Key Issue / Summary</label>
                  <textarea rows={3} value={form.keyIssue} onChange={e => setForm(f => ({ ...f, keyIssue: e.target.value }))} className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none placeholder-gray-300" placeholder="A brief sentence describing the main challenge..." />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Contact Email</label>
                  <input type="email" value={form.contactEmail} onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))} className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none placeholder-gray-300" placeholder="dept@state.gov.in" />
                </div>
                
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100">Cancel</button>
                  <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl text-sm text-white font-semibold disabled:opacity-60" style={{ background: '#1A2744' }}>
                    {saving ? 'Saving...' : 'Update Data'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
