import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, ArrowPathIcon, EyeIcon } from '@heroicons/react/24/outline'
import api from '../../../services/api'
import { toast } from 'react-hot-toast'

const emptyForm = { title: '', excerpt: '', body: '', tags: '', isFeatured: false, status: 'draft' }

export default function AdminBlog() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [imageFile, setImageFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const fileRef = useRef()

  useEffect(() => { fetchBlogs() }, [page])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      // Admin endpoint to get all (including drafts)
      const res = await api.get('/blog/admin/all?page=' + page)
      setBlogs(res.data.data.blogs)
      setTotalPages(res.data.data.totalPages || 1)
    } catch { toast.error('Failed to load blogs') }
    finally { setLoading(false) }
  }

  const openCreate = () => { setEditing(null); setForm(emptyForm); setImageFile(null); setShowForm(true) }
  const openEdit = (item) => {
    setEditing(item._id)
    setForm({ title: item.title, excerpt: item.excerpt || '', body: '', tags: (item.tags || []).join(', '), isFeatured: item.isFeatured, status: item.status })
    setImageFile(null)
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (imageFile) fd.append('image', imageFile)
      if (editing) {
        await api.patch(`/blog/${editing}`, fd)
        toast.success('Blog updated!')
      } else {
        await api.post('/blog', fd)
        toast.success('Blog created!')
      }
      setShowForm(false)
      fetchBlogs()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this blog post?')) return
    try {
      await api.delete(`/blog/${id}`)
      toast.success('Deleted')
      fetchBlogs()
    } catch { toast.error('Failed to delete') }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1A2744' }}>Blog Management</h1>
          <p className="text-sm text-gray-500 mt-1">Write, publish and manage blog posts</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold" style={{ background: '#E8872A' }}>
          <PlusIcon className="w-4 h-4" /> New Post
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12"><ArrowPathIcon className="w-8 h-8 animate-spin text-gray-300" /></div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No blog posts yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Title</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-gray-400 hidden md:table-cell">Status</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-gray-400 hidden lg:table-cell">Views</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-gray-400 hidden lg:table-cell">Comments</th>
                <th className="text-right p-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((item) => (
                <tr key={item._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {item.featuredImage?.url && <img src={item.featuredImage.url} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />}
                      <div>
                        <p className="font-medium text-gray-800 line-clamp-1">{item.title}</p>
                        {item.isFeatured && <span className="text-xs text-yellow-600 font-semibold">⭐ Featured</span>}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${item.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{item.status}</span>
                  </td>
                  <td className="p-4 text-gray-500 hidden lg:table-cell">{item.viewCount || 0}</td>
                  <td className="p-4 text-gray-500 hidden lg:table-cell">{item.commentCount || 0}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <a href={`/blog/${item.slug}`} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"><EyeIcon className="w-4 h-4" /></a>
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"><PencilIcon className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><TrashIcon className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 p-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${p === page ? 'text-white' : 'bg-gray-100 text-gray-600'}`}
                style={p === page ? { background: '#1A2744' } : {}}>{p}</button>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.5)' }}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="font-bold text-lg" style={{ color: '#1A2744' }}>{editing ? 'Edit Blog Post' : 'New Blog Post'}</h2>
                <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-gray-100"><XMarkIcon className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Title *</label>
                  <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Excerpt (short summary)</label>
                  <textarea rows={2} value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Body (full content) {!editing && '*'}</label>
                  <textarea required={!editing} rows={8} value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                    placeholder="Write your blog post content here..."
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 font-mono" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Tags (comma separated)</label>
                    <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                      placeholder="rte, education, policy"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Status</label>
                    <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="featured" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} className="rounded" />
                  <label htmlFor="featured" className="text-sm text-gray-600">Mark as Featured</label>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Featured Image</label>
                  <input ref={fileRef} type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])}
                    className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700" />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100">Cancel</button>
                  <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl text-sm text-white font-semibold disabled:opacity-60" style={{ background: '#1A2744' }}>
                    {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
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
