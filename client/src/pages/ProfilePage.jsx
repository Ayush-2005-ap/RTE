import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { UserCircleIcon, MapPinIcon, PencilSquareIcon } from '@heroicons/react/24/outline'

const mockUser = {
  name: 'Ayush Pandey',
  email: 'ayush@example.com',
  state: 'Maharashtra',
  userType: 'Educator',
  joinDate: 'January 2025',
  stats: { questionsAsked: 4, grievancesFiled: 2, answersPosted: 9 },
}

export default function ProfilePage() {
  return (
    <div style={{ paddingTop: '64px' }}>
      <div className="py-16 px-4" style={{ background: 'linear-gradient(135deg,#1A2744,#243356)' }}>
        <div className="max-w-3xl mx-auto flex items-end gap-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#E8872A,#f0a952)' }}>
            {mockUser.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-h1 text-white font-display">{mockUser.name}</h1>
            <p className="text-white/60 text-sm mt-1 flex items-center gap-2">
              <MapPinIcon className="w-3.5 h-3.5" /> {mockUser.state} · {mockUser.userType} · Joined {mockUser.joinDate}
            </p>
          </div>
          <button className="ml-auto btn-ghost text-white/70 hover:text-white flex items-center gap-1">
            <PencilSquareIcon className="w-4 h-4" /> Edit
          </button>
        </div>
      </div>

      <div className="py-10 px-4" style={{ background: '#F5EFE0' }}>
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(mockUser.stats).map(([key, val]) => (
              <div key={key} className="bg-white rounded-2xl p-5 text-center shadow-sm">
                <div className="font-bold text-2xl font-display" style={{ color: '#1A2744' }}>{val}</div>
                <p className="text-xs text-muted capitalize mt-1">{key.replace(/([A-Z])/g, ' $1')}</p>
              </div>
            ))}
          </div>

          {/* Account Details */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-ink mb-4">Account Details</h2>
            <dl className="space-y-3 text-sm">
              {[
                { label: 'Email', value: mockUser.email },
                { label: 'State', value: mockUser.state },
                { label: 'User Type', value: mockUser.userType },
                { label: 'Member Since', value: mockUser.joinDate },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'rgba(26,39,68,0.06)' }}>
                  <dt className="text-muted">{item.label}</dt>
                  <dd className="font-semibold text-ink">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Quick Links */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Link to="/grievances/my" className="bg-white rounded-2xl p-5 card-hover border flex items-center gap-3" style={{ borderColor: 'rgba(26,39,68,0.07)' }}>
              <div className="w-10 h-10 rounded-xl" style={{ background: 'rgba(232,135,42,0.12)' }} />
              <div>
                <p className="font-semibold text-sm text-ink">My Grievances</p>
                <p className="text-xs text-muted">{mockUser.stats.grievancesFiled} filed</p>
              </div>
            </Link>
            <Link to="/community/questions" className="bg-white rounded-2xl p-5 card-hover border flex items-center gap-3" style={{ borderColor: 'rgba(26,39,68,0.07)' }}>
              <div className="w-10 h-10 rounded-xl" style={{ background: 'rgba(26,39,68,0.08)' }} />
              <div>
                <p className="font-semibold text-sm text-ink">My Questions</p>
                <p className="text-xs text-muted">{mockUser.stats.questionsAsked} asked</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
