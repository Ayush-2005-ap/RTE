import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusIcon, TrashIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import api from '../../../services/api'
import { toast } from 'react-hot-toast'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'moderator' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await api.get('/users/admins')
      setUsers(res.data.data.users)
    } catch { toast.error('Failed to load admin users') }
    finally { setLoading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post('/users/admins', form)
      toast.success('Admin user created successfully!')
      setShowForm(false)
      fetchUsers()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id, role) => {
    if (role === 'admin' && users.filter(u => u.role === 'admin').length <= 1) {
        return toast.error('Cannot delete the last admin user')
    }
    if (!confirm('Are you sure you want to revoke access and delete this user?')) return
    try {
      await api.delete(`/users/admins/${id}`)
      toast.success('User deleted')
      fetchUsers()
    } catch { toast.error('Failed to delete') }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1A2744' }}>Admin Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage platform moderators and administrators</p>
        </div>
        <button onClick={() => { setForm({ name: '', email: '', password: '', role: 'moderator' }); setShowForm(true) }} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold" style={{ background: '#E8872A' }}>
          <PlusIcon className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden p-6">
        {loading ? (
          <div className="flex justify-center py-12"><ArrowPathIcon className="w-8 h-8 animate-spin text-gray-300" /></div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Name</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Email</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Role</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Joined</th>
                <th className="text-right p-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item) => (
                <tr key={item._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-semibold text-gray-800">{item.name}</td>
                  <td className="p-4 text-gray-600">{item.email}</td>
                  <td className="p-4">
                    <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded-full ${item.role === 'admin' ? 'bg-[#1A2744] text-white' : 'bg-orange-100 text-orange-700'}`}>
                        {item.role}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400">{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(item._id, item.role)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                        <TrashIcon className="w-4 h-4" />
                    </button>
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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative">
              <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100"><XMarkIcon className="w-5 h-5" /></button>
              
              <h2 className="font-bold text-lg mb-6" style={{ color: '#1A2744' }}>Create Admin User</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Email Address</label>
                  <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Temporary Password</label>
                  <input required type="password" minLength="8" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none font-mono tracking-widest" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Access Role</label>
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button type="button" onClick={() => setForm(f => ({...f, role: 'moderator'}))} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${form.role==='moderator' ? 'bg-white shadow pointer-events-none' : 'text-gray-500'}`}>Moderator</button>
                        <button type="button" onClick={() => setForm(f => ({...f, role: 'admin'}))} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${form.role==='admin' ? 'bg-white shadow pointer-events-none' : 'text-gray-500'}`}>Admin</button>
                    </div>
                </div>
                
                <button type="submit" disabled={saving} className="w-full mt-2 px-5 py-2.5 rounded-xl text-sm text-white font-semibold disabled:opacity-60" style={{ background: '#1A2744' }}>
                  {saving ? 'Creating...' : 'Create Account'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
