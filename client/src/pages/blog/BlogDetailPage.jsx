import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, ClockIcon, ShareIcon } from '@heroicons/react/24/outline'

const posts = {
  'understanding-rte-25-percent-quota': {
    title: "Understanding the 25% EWS Quota Under RTE: A Complete Parent's Guide",
    author: 'Ayush Pandey', date: 'Mar 5, 2025', readTime: '8 min read',
    tags: ['EWS', 'Admissions', 'Guide'],
    body: `The Right to Education Act 2009 is one of India's most transformative education laws. Section 12(1)(c) of the Act requires every private unaided school to reserve 25% of its seats in Class 1 (or pre-primary, whichever is the lowest class) for children from economically weaker sections (EWS) and disadvantaged groups (DG).

## Who is eligible?

Children from EWS families — where annual family income is below ₹1 lakh per year (varies by state) — and children from disadvantaged groups (Scheduled Castes, Scheduled Tribes, or children with disabilities) are eligible.

## What schools are covered?

All private unaided schools are covered under Section 12(1)(c). Government and government-aided schools are not included in this provision.

## How to apply?

Most states have an online portal for RTE admissions. In Delhi, it is at edudel.nic.in. In Maharashtra, it is at student.maharashtra.gov.in. Applications typically open in January-February for the next academic year.

## Documents required

- Birth certificate of the child
- Residence proof (Aadhaar, ration card, electricity bill)
- Income certificate from competent authority
- Caste certificate (if applying under DG category)
- Disability certificate (if applicable)

## What if the school denies admission?

Schools cannot legally deny admission if the quota is not filled. If you face denial, you should file a complaint with the District Education Officer (DEO) immediately.`,
  },
}

export default function BlogDetailPage() {
  const { slug } = useParams()
  const post = posts[slug] || { title: 'Blog Post', author: 'Team', date: 'Recent', readTime: '5 min', tags: [], body: 'Content not available.' }

  return (
    <div style={{ paddingTop: '64px' }}>
      <div className="py-10 px-4" style={{ background: '#F5EFE0', minHeight: '100vh' }}>
        <div className="max-w-2xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink mb-6 transition-colors">
            <ArrowLeftIcon className="w-4 h-4" /> Back to blog
          </Link>
          <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 md:p-10 shadow-card">
            <div className="flex flex-wrap gap-2 mb-5">
              {post.tags.map(t => <span key={t} className="badge-navy text-xs">{t}</span>)}
            </div>
            <h1 className="text-h1 font-display mb-5" style={{ color: '#1A2744' }}>{post.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted pb-6 mb-6 border-b" style={{ borderColor: 'rgba(26,39,68,0.08)' }}>
              <span className="font-semibold text-ink">{post.author}</span>
              <span>{post.date}</span>
              <span className="flex items-center gap-1"><ClockIcon className="w-4 h-4" />{post.readTime}</span>
              <button className="ml-auto flex items-center gap-1 text-xs" style={{ color: '#E8872A' }}>
                <ShareIcon className="w-4 h-4" /> Share
              </button>
            </div>
            <div className="prose prose-sm max-w-none text-ink">
              {post.body.split('\n\n').map((block, i) => {
                if (block.startsWith('## ')) return <h2 key={i} className="text-h2 font-display mt-7 mb-3" style={{ color: '#1A2744' }}>{block.slice(3)}</h2>
                if (block.startsWith('- ')) {
                  return (
                    <ul key={i} className="mb-4 space-y-1">
                      {block.split('\n').map((line, li) => (
                        <li key={li} className="flex items-start gap-2 text-sm">
                          <span style={{ color: '#E8872A', marginTop: '3px' }}>•</span>
                          <span>{line.slice(2)}</span>
                        </li>
                      ))}
                    </ul>
                  )
                }
                return <p key={i} className="mb-4 leading-relaxed text-sm">{block}</p>
              })}
            </div>
            <div className="mt-8 pt-6 border-t" style={{ borderColor: 'rgba(26,39,68,0.08)' }}>
              <p className="text-sm font-semibold text-ink mb-3">Related actions</p>
              <div className="flex flex-wrap gap-3">
                <Link to="/community/ask" className="btn-secondary text-sm px-4 py-2">Ask a Question</Link>
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </div>
  )
}
