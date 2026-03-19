import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, ArrowPathIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import api from '../../../services/api'
import { toast } from 'react-hot-toast'

export default function AdminSlider() {
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  
  const [form, setForm] = useState({ leftCategory: '', leftTitle: '', leftDesc: '', leftLink: '', rightLabel: '', rightTitle: '', rightDesc: '', isActive: true })
  const [imageFile, setImageFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [reordering, setReordering] = useState(false)

  useEffect(() => { fetchSlides() }, [])

  const fetchSlides = async () => {
    try {
      setLoading(true)
      const res = await api.get('/slider/all')
      setSlides(res.data.data.slides)
    } catch { toast.error('Failed to load slides') }
    finally { setLoading(false) }
  }

  const openCreate = () => { setEditing(null); setForm({ leftCategory: '', leftTitle: '', leftDesc: '', leftLink: '', rightLabel: '', rightTitle: '', rightDesc: '', isActive: true }); setImageFile(null); setShowForm(true) }
  const openEdit = (item) => {
    setEditing(item._id)
    setForm({ leftCategory: item.leftCategory, leftTitle: item.leftTitle, leftDesc: item.leftDesc, leftLink: item.leftLink, rightLabel: item.rightLabel, rightTitle: item.rightTitle, rightDesc: item.rightDesc, isActive: item.isActive })
    setImageFile(null)
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!editing && !imageFile) return toast.error('Please upload an image')

    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (imageFile) fd.append('image', imageFile)

      if (editing) {
        await api.patch(`/slider/${editing}`, fd)
        toast.success('Slide updated!')
      } else {
        await api.post('/slider', fd)
        toast.success('Slide created!')
      }
      setShowForm(false)
      fetchSlides()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this slide?')) return
    try {
      await api.delete(`/slider/${id}`)
      toast.success('Deleted')
      fetchSlides()
    } catch { toast.error('Failed to delete') }
  }

  const handleMove = async (index, dir) => {
    if (index + dir < 0 || index + dir >= slides.length) return
    const newSlides = [...slides]
    const temp = newSlides[index]
    newSlides[index] = newSlides[index + dir]
    newSlides[index + dir] = temp
    setSlides(newSlides)
    
    // Save order
    try {
        setReordering(true)
        const payload = newSlides.map((s, i) => ({ id: s._id, order: i }))
        await api.patch('/slider/reorder', { slides: payload })
    } catch {
        toast.error('Failed to save new order')
        fetchSlides()
    } finally {
        setReordering(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1A2744' }}>Landing Page Slider</h1>
          <p className="text-sm text-gray-500 mt-1">Manage the hero carousel content</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold" style={{ background: '#E8872A' }}>
          <PlusIcon className="w-4 h-4" /> Add Slide
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden p-6">
        {loading ? (
          <div className="flex justify-center py-12"><ArrowPathIcon className="w-8 h-8 animate-spin text-gray-300" /></div>
        ) : slides.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No slides configured yet.</div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Current Stack</span>
                {reordering && <span className="text-xs text-orange-500 animate-pulse">Saving order...</span>}
            </div>
            {slides.map((item, index) => (
              <div key={item._id} className={`border rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start md:items-center ${!item.isActive ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-white border-gray-100 shadow-sm'}`}>
                
                {/* Reorder Buttons */}
                <div className="flex md:flex-col gap-1 text-gray-400">
                    <button onClick={() => handleMove(index, -1)} disabled={index === 0} className="p-1 hover:text-ink disabled:opacity-30"><ArrowsUpDownIcon className="w-4 h-4" /></button>
                </div>

                {item.leftImageUrl && <img src={item.leftImageUrl} alt="" className="w-24 h-16 rounded-lg object-cover flex-shrink-0" />}
                
                <div className="flex-1 grid md:grid-cols-2 gap-4">
                    <div>
                        <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block mb-1">Left Panel</span>
                        <p className="font-semibold text-sm text-gray-800 line-clamp-1">{item.leftTitle}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{item.leftCategory}</p>
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block mb-1">Right Panel</span>
                        <p className="font-semibold text-sm text-gray-800 line-clamp-1">{item.rightTitle}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{item.rightLabel}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                        {item.isActive ? 'ACTIVE' : 'HIDDEN'}
                    </span>
                    <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"><PencilIcon className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(item._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><TrashIcon className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Editor Modal is large because there are lots of fields */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 py-10"
            style={{ background: 'rgba(0,0,0,0.5)' }}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-full overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
                <h2 className="font-bold text-lg" style={{ color: '#1A2744' }}>{editing ? 'Edit Slide' : 'New Slide'}</h2>
                <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-gray-100"><XMarkIcon className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Panel Editor */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-sm text-orange-600 uppercase tracking-wider mb-2 border-b pb-2">Left Panel Contents (Image Side)</h3>
                        <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Image {!editing && '*'}</label>
                        <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])}
                            className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700" />
                        </div>
                        <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Title *</label>
                        <input required value={form.leftTitle} onChange={e => setForm(f => ({ ...f, leftTitle: e.target.value }))} className="w-full border rounded-xl px-3 py-2 text-sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Category *</label>
                            <input required value={form.leftCategory} onChange={e => setForm(f => ({ ...f, leftCategory: e.target.value }))} className="w-full border rounded-xl px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Link (Optional)</label>
                            <input value={form.leftLink} onChange={e => setForm(f => ({ ...f, leftLink: e.target.value }))} className="w-full border rounded-xl px-3 py-2 text-sm placeholder-gray-300" placeholder="https://" />
                        </div>
                        </div>
                        <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Description *</label>
                        <textarea required rows={4} value={form.leftDesc} onChange={e => setForm(f => ({ ...f, leftDesc: e.target.value }))} className="w-full border rounded-xl px-3 py-2 text-sm" />
                        </div>
                    </div>

                    {/* Right Panel Editor */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-sm text-orange-600 uppercase tracking-wider mb-2 border-b pb-2">Right Panel Contents (Text Side)</h3>
                        <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Label/Tagline *</label>
                        <input required value={form.rightLabel} onChange={e => setForm(f => ({ ...f, rightLabel: e.target.value }))} className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="e.g. Did you know?" />
                        </div>
                        <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Title *</label>
                        <textarea required rows={2} value={form.rightTitle} onChange={e => setForm(f => ({ ...f, rightTitle: e.target.value }))} className="w-full border rounded-xl px-3 py-2 text-sm font-serif" />
                        </div>
                        <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Description *</label>
                        <textarea required rows={5} value={form.rightDesc} onChange={e => setForm(f => ({ ...f, rightDesc: e.target.value }))} className="w-full border rounded-xl px-3 py-2 text-sm" />
                        </div>
                        
                        <div className="pt-4 flex items-center justify-end gap-3 border-t mt-4">
                            <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                                <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4 text-orange-500 rounded" />
                                Active (Visible)
                            </label>
                           
                           <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl text-sm text-white font-semibold disabled:opacity-60 ml-4" style={{ background: '#1A2744' }}>
                               {saving ? 'Saving...' : editing ? 'Update Slide' : 'Create Slide'}
                           </button>
                        </div>
                    </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
