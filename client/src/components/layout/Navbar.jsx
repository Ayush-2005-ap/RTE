import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'

const navLinks = [
  {
    label: 'Know Your RTE',
    children: [
      { label: 'About RTE Act', href: '/know-your-rte/about' },
      { label: "Children's Rights", href: '/know-your-rte/rights' },
    ],
  },
  { label: 'States', href: '/states' },
  {
    label: 'Community',
    children: [
      { label: 'Q&A Forum', href: '/community/questions' },
      { label: 'Discussions', href: '/community/discussions' },
    ],
  },
  { label: 'News', href: '/news' },
  { label: 'Blog', href: '/blog' },
  { label: 'Publications', href: '/publications' },
]

import useAuthStore from '../../store/authStore'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [openDropdown, setOpenDropdown] = useState(null)
  
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuthStore()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setQuery('')
      setSearchOpen(false)
    }
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-navy-DEFAULT/95 backdrop-blur-md shadow-md' : 'bg-transparent'
        }`}
        style={{ backgroundColor: scrolled ? 'rgba(26,39,68,0.96)' : 'rgba(26,39,68,0.96)' }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#E8872A,#f0a952)' }}>
              <span className="text-white font-bold text-sm font-display">RTE</span>
            </div>
            <span className="font-display font-bold text-white text-lg hidden sm:block leading-tight">
              Right to<br className="hidden" />
              <span className="text-saffron-DEFAULT" style={{ color: '#E8872A' }}> Education</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/10">
                    {link.label}
                    <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform ${openDropdown === link.label ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-full left-0 mt-1 w-52 rounded-xl shadow-xl overflow-hidden"
                        style={{ background: '#1A2744', border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            to={child.href}
                            className="block px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                            onClick={() => setOpenDropdown(null)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive ? 'text-white bg-white/15' : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              )
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Open search"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>

            {/* Only show user controls if authenticated */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center gap-2">
                {(user?.role === 'admin' || user?.role === 'moderator') && (
                  <Link to="/admin" className="flex items-center gap-2 px-3 py-2 text-sm font-semibold hover:text-white transition-colors rounded-lg bg-white/10 hover:bg-white/15" style={{ color: '#E8872A' }}>
                    Dashboard
                  </Link>
                )}
                <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/10">
                  <UserCircleIcon className="w-6 h-6" />
                  <span className="max-w-[100px] truncate">{user?.name?.split(' ')[0]}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-1.5 text-white/80 hover:text-white transition-colors hover:bg-white/10 rounded-lg"
                  title="Logout"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                </button>
              </div>
            )}

            <button
              className="md:hidden p-2 text-white/80 hover:text-white transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed inset-0 z-40 pt-16"
            style={{ background: '#1A2744' }}
          >
            <div className="flex flex-col p-6 gap-1 overflow-y-auto h-full">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.label}>
                    <p className="px-3 py-2 text-xs font-semibold text-white/40 uppercase tracking-wider">
                      {link.label}
                    </p>
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        to={child.href}
                        className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors text-lg"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              )}

              {/* Only show auth controls in mobile menu if authenticated */}
              {isAuthenticated && (
                <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6">
                  {(user?.role === 'admin' || user?.role === 'moderator') && (
                    <Link to="/admin" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-[#E8872A] font-bold bg-white/5 rounded-xl text-center mb-2">
                      Admin Dashboard
                    </Link>
                  )}
                  <Link to="/profile" onClick={() => setMobileOpen(false)} className="btn-secondary text-white border-white/30 text-center">My Profile</Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }} 
                    className="btn-primary text-center"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4"
            style={{ background: 'rgba(26,39,68,0.85)', backdropFilter: 'blur(8px)' }}
            onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.94, y: -16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: -16 }}
              className="w-full max-w-2xl"
            >
              <form onSubmit={handleSearch} className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search questions, news, blog, states…"
                  className="w-full pl-12 pr-6 py-5 rounded-2xl text-lg bg-white text-ink shadow-2xl"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                />
              </form>
              <p className="text-center text-white/40 text-sm mt-3">Press Enter to search · Esc to close</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}