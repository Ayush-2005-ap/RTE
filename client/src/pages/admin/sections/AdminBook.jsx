import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, ArrowPathIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import api from '../../../services/api'
import { toast } from 'react-hot-toast'

export default function AdminBook() {
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  
  const [form, setForm] = useState({ type: 'chapter', title: '', desc: '', items: '' })
  const [saving, setSaving] = useState(false)
  const [reordering, setReordering] = useState(false)

  useEffect(() => { fetchChapters() }, [])

  const fetchChapters = async () => {
    try {
      setLoading(true)
      const res = await api.get('/book')
      setChapters(res.data.data.content)
    } catch { toast.error('Failed to load book chapters') }
    finally { setLoading(false) }
  }

  const openCreate = () => { setEditing(null); setForm({ type: 'chapter', title: '', desc: '', items: '' }); setShowForm(true) }
  const openEdit = (item) => {
    setEditing(item._id)
    setForm({ 
        type: item.type, 
        title: item.title, 
        desc: item.desc || '', 
        items: (item.items || []).join('\n')
    })
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
          ...form,
          items: form.type === 'contents' ? form.items.split('\n').filter(i => i.trim() !== '') : []
      }

      if (editing) {
        await api.patch(`/book/${editing}`, payload)
        toast.success('Chapter updated!')
      } else {
        await api.post('/book', { ...payload, order: chapters.length })
        toast.success('Chapter created!')
      }
      setShowForm(false)
      fetchChapters()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this page from the book?')) return
    try {
      await api.delete(`/book/${id}`)
      toast.success('Deleted')
      fetchChapters()
    } catch { toast.error('Failed to delete') }
  }

  const handleMove = async (index, dir) => {
    if (index + dir < 0 || index + dir >= chapters.length) return
    const newItems = [...chapters]
    const temp = newItems[index]
    newItems[index] = newItems[index + dir]
    newItems[index + dir] = temp
    setChapters(newItems)
    
    try {
        setReordering(true)
        const payload = newItems.map((s, i) => ({ id: s._id, order: i }))
        await api.patch('/book/reorder', { chapters: payload })
    } catch {
        toast.error('Failed to save new order')
        fetchChapters()
    } finally {
        setReordering(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1A2744' }}>Landing Book</h1>
          <p className="text-sm text-gray-500 mt-1">Manage the interactive 3D book pages on the homepage</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold" style={{ background: '#E8872A' }}>
          <PlusIcon className="w-4 h-4" /> Add Page
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden p-6">
        {loading ? (
          <div className="flex justify-center py-12"><ArrowPathIcon className="w-8 h-8 animate-spin text-gray-300" /></div>
        ) : chapters.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No book pages yet.</div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Pages Outline</span>
                {reordering && <span className="text-xs text-orange-500 animate-pulse">Saving order...</span>}
            </div>
            {chapters.map((item, index) => (
              <div key={item._id} className="border border-gray-100 bg-white rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start md:items-center shadow-sm">
                <div className="flex md:flex-col gap-1 text-gray-400">
                    <button onClick={() => handleMove(index, -1)} disabled={index === 0} className="p-1 hover:text-[#1A2744] disabled:opacity-30"><ArrowsUpDownIcon className="w-4 h-4" /></button>
                </div>
                
                <div className="flex-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${item.type === 'contents' ? 'text-blue-600' : 'text-orange-600'}`}>
                        {item.type === 'contents' ? 'Index / Table of Contents' : 'Chapter'}
                    </span>
                    <h3 className="font-serif font-bold text-lg text-[#1A2744]">{item.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                        {item.type === 'contents' ? `${item.items?.length || 0} index items` : item.desc}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded hidden md:block">Page {index + 1}</span>
                    <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"><PencilIcon className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(item._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><TrashIcon className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.5)' }}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-lg" style={{ color: '#1A2744' }}>{editing ? 'Edit Page' : 'Add Page'}</h2>
                <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-gray-100"><XMarkIcon className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Page Type</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none">
                      <option value="chapter">Text Chapter</option>
                      <option value="contents">Table of Contents / Index</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Title</label>
                  <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full border rounded-xl px-3 py-2 text-sm font-serif focus:outline-none" />
                </div>
                
                {form.type === 'contents' ? (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Index Items (one per line)</label>
                    <textarea required rows={7} value={form.items} onChange={e => setForm(f => ({ ...f, items: e.target.value }))} className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none placeholder-gray-300 font-mono" placeholder="Chapter 1: Preliminary&#10;Chapter 2: Right to Education&#10;..." />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Paragraph Text</label>
                    <textarea required rows={5} value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none font-serif" />
                  </div>
                )}
                
                <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100">Cancel</button>
                  <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl text-sm text-white font-semibold disabled:opacity-60" style={{ background: '#1A2744' }}>
                    {saving ? 'Saving...' : 'Save Page'}
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
