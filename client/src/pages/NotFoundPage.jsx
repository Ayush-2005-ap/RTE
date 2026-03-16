import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpenIcon } from '@heroicons/react/24/outline'

export default function NotFoundPage() {
  return (
    <div style={{ paddingTop: '64px', background: '#F5EFE0', minHeight: '100vh' }}
      className="flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <BookOpenIcon className="w-20 h-20 mx-auto mb-6 opacity-20" style={{ color: '#1A2744' }} />
        <div className="font-display font-bold text-8xl mb-4" style={{ color: '#E8872A' }}>404</div>
        <h1 className="text-h2 font-display mb-3" style={{ color: '#1A2744' }}>Page not found</h1>
        <p className="text-muted mb-8 max-w-xs mx-auto">This page doesn't exist or has been moved. Let's get you back on track.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary">Back to Home</Link>
          <Link to="/states" className="btn-secondary">View States</Link>
        </div>
      </motion.div>
    </div>
  )
}
