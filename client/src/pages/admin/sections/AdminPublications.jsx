import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, ArrowPathIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline'
import api from '../../../services/api'
import { toast } from 'react-hot-toast'

const CATEGORIES = ['policy', 'report', 'research', 'guideline', 'circular', 'other']

export default function AdminPublications() {
  const [pubs, setPubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  
  const [form, setForm] = useState({ title: '', description: '', category: 'policy' })
  const [pdfFile, setPdfFile] = useState(null)
  const [thumbFile, setThumbFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const pdfRef = useRef()
  const thumbRef = useRef()

  useEffect(() => { fetchPubs() }, [page])

  const fetchPubs = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/publications?page=${page}&limit=10`)
      setPubs(res.data.data.publications)
      setTotalPages(res.data.data.totalPages)
    } catch { toast.error('Failed to load publications') }
    finally { setLoading(false) }
  }

  const openCreate = () => { setEditing(null); setForm({ title: '', description: '', category: 'policy' }); setPdfFile(null); setThumbFile(null); setShowForm(true) }
  const openEdit = (item) => {
    setEditing(item._id)
    setForm({ title: item.title, description: item.description, category: item.category })
    setPdfFile(null)
    setThumbFile(null)
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!editing && !pdfFile) {
      return toast.error('Please upload a PDF file')
    }

    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (pdfFile) fd.append('pdf', pdfFile)
      if (thumbFile) fd.append('thumbnail', thumbFile)

      if (editing) {
        await api.patch(`/publications/${editing}`, fd)
        toast.success('Publication updated!')
      } else {
        await api.post('/publications', fd)
        toast.success('Publication created!')
      }
      setShowForm(false)
      fetchPubs()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this publication? The PDF file will also be permanently deleted from storage.')) return
    try {
      await api.delete(`/publications/${id}`)
      toast.success('Deleted')
      fetchPubs()
    } catch { toast.error('Failed to delete') }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1A2744' }}>Publications</h1>
          <p className="text-sm text-gray-500 mt-1">Manage PDF documents and reports</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold" style={{ background: '#E8872A' }}>
          <PlusIcon className="w-4 h-4" /> Upload PDF
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12"><ArrowPathIcon className="w-8 h-8 animate-spin text-gray-300" /></div>
        ) : pubs.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No publications uploaded yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Document</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-gray-400 hidden sm:table-cell">Category</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-gray-400 hidden lg:table-cell">Downloads</th>
                <th className="text-right p-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pubs.map((item) => (
                <tr key={item._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {item.thumbnailUrl ? (
                         <img src={item.thumbnailUrl} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                         <div className="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0">
                           <DocumentArrowDownIcon className="w-5 h-5" />
                         </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-800 line-clamp-1">{item.title}</p>
                        <p className="text-xs text-gray-400 line-clamp-1">{item.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 capitalize">{item.category}</span>
                  </td>
                  <td className="p-4 text-gray-500 hidden lg:table-cell">{item.downloadCount || 0}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <a href={item.pdfUrl} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"><DocumentArrowDownIcon className="w-4 h-4" /></a>
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"><PencilIcon className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><TrashIcon className="w-4 h-4" /></button>
                    </div>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.5)' }}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="font-bold text-lg" style={{ color: '#1A2744' }}>{editing ? 'Edit Publication' : 'Upload Publication'}</h2>
                <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-gray-100"><XMarkIcon className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Title *</label>
                  <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Description *</label>
                  <textarea required rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Category</label>
                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 space-y-4">
                    <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">PDF Document {!editing && '*'}</label>
                    <input ref={pdfRef} type="file" accept="application/pdf" onChange={e => setPdfFile(e.target.files[0])}
                        className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700" />
                    {editing && <p className="text-xs text-gray-400 mt-1">Leave empty to keep current PDF</p>}
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Thumbnail Image (Optional)</label>
                    <input ref={thumbRef} type="file" accept="image/*" onChange={e => setThumbFile(e.target.files[0])}
                        className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700" />
                    </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100">Cancel</button>
                  <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl text-sm text-white font-semibold disabled:opacity-60" style={{ background: '#1A2744' }}>
                    {saving ? 'Uploading...' : editing ? 'Update' : 'Upload PDF'}
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
