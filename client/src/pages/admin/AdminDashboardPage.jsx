import { useState } from 'react'
import { NavLink, Routes, Route, Link } from 'react-router-dom'
import {
  ChartBarIcon, UsersIcon, ShieldCheckIcon, MapIcon,
  NewspaperIcon, DocumentTextIcon, BookOpenIcon,
  PhotoIcon, ChatBubbleLeftRightIcon, ArrowLeftOnRectangleIcon, AcademicCapIcon
} from '@heroicons/react/24/outline'

import AdminOverview from './sections/AdminOverview'
import AdminNews from './sections/AdminNews'
import AdminBlog from './sections/AdminBlog'
import AdminPublications from './sections/AdminPublications'
import AdminSlider from './sections/AdminSlider'
import AdminBook from './sections/AdminBook'
import AdminStates from './sections/AdminStates'
import AdminCommunity from './sections/AdminCommunity'
import AdminComments from './sections/AdminComments'
import AdminUsers from './sections/AdminUsers'

const navItems = [
  { label: 'Overview',      icon: ChartBarIcon,           href: '/admin',              end: true },
  { label: 'News',          icon: NewspaperIcon,           href: '/admin/news' },
  { label: 'Blog',          icon: DocumentTextIcon,        href: '/admin/blog' },
  { label: 'Publications',  icon: BookOpenIcon,            href: '/admin/publications' },
  { label: 'Slider',        icon: PhotoIcon,               href: '/admin/slider' },
  { label: 'Landing Book',  icon: AcademicCapIcon,         href: '/admin/book' },
  { label: 'States',        icon: MapIcon,                 href: '/admin/states' },
  { label: 'Community',     icon: ChatBubbleLeftRightIcon, href: '/admin/community' },
  { label: 'Comments',      icon: ShieldCheckIcon,         href: '/admin/comments' },
  { label: 'Users',         icon: UsersIcon,               href: '/admin/users' },
]

export default function AdminDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div style={{ paddingTop: '64px', display: 'flex', minHeight: '100vh', background: '#F5EFE0' }}>
      {/* Sidebar */}
      <aside
        className={`w-56 flex-shrink-0 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : ''} hidden md:flex`}
        style={{ background: '#1A2744', minHeight: 'calc(100vh - 64px)', position: 'sticky', top: '64px' }}
      >
        <div className="p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive ? 'text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`
              }
              style={({ isActive }) => isActive ? { background: 'rgba(232,135,42,0.18)', color: '#f0a952' } : {}}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <Link to="/" className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors">
            <ArrowLeftOnRectangleIcon className="w-4 h-4" />
            Back to site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto min-w-0">
        <Routes>
          <Route index element={<AdminOverview />} />
          <Route path="news/*" element={<AdminNews />} />
          <Route path="blog/*" element={<AdminBlog />} />
          <Route path="publications/*" element={<AdminPublications />} />
          <Route path="slider/*" element={<AdminSlider />} />
          <Route path="book/*" element={<AdminBook />} />
          <Route path="states/*" element={<AdminStates />} />
          <Route path="community/*" element={<AdminCommunity />} />
          <Route path="comments/*" element={<AdminComments />} />
          <Route path="users/*" element={<AdminUsers />} />
        </Routes>
      </main>
    </div>
  )
}
