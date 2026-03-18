import { Link } from 'react-router-dom'

const footerLinks = {
  'Know Your RTE': [
    { label: 'About RTE Act', href: '/know-your-rte/about' },
    { label: "Children's Rights", href: '/know-your-rte/rights' },
  ],
  'State Compliance': [
    { label: 'All States', href: '/states' },
    { label: 'News & Updates', href: '/news' },
  ],
  Community: [
    { label: 'Q&A Forum', href: '/community/questions' },
    { label: 'Discussions', href: '/community/discussions' },
  ],
  Resources: [
    { label: 'Blog', href: '/blog' },
    { label: 'Documents', href: '/resources' },
    { label: 'Search', href: '/search' },
  ],
}

export default function Footer() {
  return (
    <footer style={{ background: '#1A2744' }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-8">
        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#E8872A,#f0a952)' }}>
                <span className="text-white font-bold text-sm font-display">RTE</span>
              </div>
              <span className="font-display font-bold text-lg">
                Right to <span style={{ color: '#E8872A' }}>Education</span>
              </span>
            </div>
            <p className="text-white/55 text-sm leading-relaxed">
              Empowering citizens to track, advocate, and enforce the Right to Education Act 2009 across India.
            </p>
            <p className="mt-4 text-xs text-white/30">
              An initiative by CCS India & Ayush Pandey
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">{group}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-white/65 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Strip */}
        <div className="py-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10">
          <p className="font-display text-lg text-white/80">
            Every child deserves an{' '}
            <span style={{ color: '#E8872A' }}>education.</span>
          </p>
          <div className="flex gap-3">
            <Link to="/community/ask" className="btn-primary text-sm px-5 py-2.5 text-white border-white/30 hover:bg-white hover:text-navy-DEFAULT">
              Ask the Community
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/35">
            © {new Date().getFullYear()} righttoeducation.in — Built under the RTE Act 2009 advocacy initiative.
          </p>
          <div className="flex gap-4 text-xs text-white/35">
            <Link to="/privacy" className="hover:text-white/60 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white/60 transition-colors">Terms</Link>
            <Link to="/sitemap" className="hover:text-white/60 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
