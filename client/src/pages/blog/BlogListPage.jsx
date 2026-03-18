import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRightIcon, ClockIcon } from '@heroicons/react/24/outline'

const posts = [
  { slug: 'understanding-rte-25-percent-quota', title: "Understanding the 25% EWS Quota Under RTE: A Complete Parent's Guide", excerpt: 'Everything you need to know about the 25% reservation for economically weaker sections in private schools — eligibility, application process, and your rights.', author: 'Ayush Pandey', readTime: '8 min read', date: 'Mar 5, 2025', tags: ['EWS', 'Admissions', 'Guide'], isFeatured: true },
  { slug: 'state-compliance-report-2024', title: 'Annual State RTE Compliance Report 2024: Winners and Laggards', excerpt: 'Our team analysed government data to rank all 36 states and UTs on RTE compliance across 20 key parameters.', author: 'Research Team', readTime: '12 min read', date: 'Feb 10, 2025', tags: ['Research', 'States'], isFeatured: false },
  { slug: 'private-schools-rte-obligations', title: 'What Private Schools Are Required to Do by Law Under RTE', excerpt: 'Many private school managements claim exemptions they are not entitled to. Here is what the law actually says.', author: 'Ayush Pandey', readTime: '7 min read', date: 'Jan 25, 2025', tags: ['Private Schools', 'Law'], isFeatured: false },
]

export default function BlogListPage() {
  const featured = posts.find(p => p.isFeatured)
  const rest = posts.filter(p => !p.isFeatured)

  return (
    <div style={{ paddingTop: '64px' }}>
      <div className="py-12 px-4" style={{ background: 'linear-gradient(135deg,#1A2744,#243356)' }}>
        <div className="max-w-6xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest mb-2 block" style={{ color: '#E8872A' }}>RTE Blog</span>
          <h1 className="text-h1 text-white" style={{ fontFamily: "'Playfair Display',serif" }}>Insights & Guides</h1>
          <p className="text-white/60 text-sm mt-2 max-w-lg">Research, guides, and analysis on RTE Act implementation in India.</p>
        </div>
      </div>

      <div className="py-12 px-4" style={{ background: '#F5EFE0' }}>
        <div className="max-w-6xl mx-auto">
          {/* Featured */}
          {featured && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
              <Link to={`/blog/${featured.slug}`}>
                <div className="bg-white rounded-3xl p-8 card-hover border-2" style={{ borderColor: 'rgba(232,135,42,0.3)' }}>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="badge font-semibold px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(232,135,42,0.15)', color: '#E8872A' }}>⭐ Featured</span>
                    {featured.tags.map(t => <span key={t} className="badge-muted text-xs">{t}</span>)}
                  </div>
                  <h2 className="text-h2 font-display mb-3" style={{ color: '#1A2744' }}>{featured.title}</h2>
                  <p className="text-muted mb-4 leading-relaxed">{featured.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-muted">
                    <span className="font-semibold text-ink">{featured.author}</span>
                    <span className="flex items-center gap-1"><ClockIcon className="w-4 h-4" /> {featured.readTime}</span>
                    <span>{featured.date}</span>
                    <span className="ml-auto flex items-center gap-1 font-semibold" style={{ color: '#E8872A' }}>
                      Read <ArrowRightIcon className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map((post, i) => (
              <motion.div key={post.slug} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Link to={`/blog/${post.slug}`}>
                  <div className="bg-white rounded-2xl p-5 card-hover border h-full flex flex-col"
                    style={{ borderColor: 'rgba(26,39,68,0.07)' }}>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {post.tags.map(t => <span key={t} className="badge-muted text-xs">{t}</span>)}
                    </div>
                    <h3 className="font-semibold text-ink leading-snug mb-2 flex-1">{post.title}</h3>
                    <p className="text-sm text-muted line-clamp-2 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-muted mt-auto pt-3 border-t" style={{ borderColor: 'rgba(26,39,68,0.06)' }}>
                      <div>
                        <span className="font-semibold text-ink">{post.author}</span> · {post.date}
                      </div>
                      <span className="flex items-center gap-1"><ClockIcon className="w-3.5 h-3.5" />{post.readTime}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
