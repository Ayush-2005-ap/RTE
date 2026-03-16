import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'

const articles = {
  1: {
    title: 'Centre Releases Annual RTE Compliance Report 2024-25',
    body: `The Ministry of Education released its annual Right to Education Act compliance report for the year 2024-25, showing a marginal improvement of 3.2 percentage points in overall compliance nationwide.

Kerala, Himachal Pradesh, and Tamil Nadu continue to lead the country in RTE implementation, with compliance scores of 91, 84, and 79 respectively. These states have successfully achieved near-universal enrollment for children from economically weaker sections and have maintained teacher-pupil ratios within mandated norms.

On the other end of the spectrum, Bihar, Jharkhand, and Uttar Pradesh continue to struggle with infrastructure gaps and teacher shortages. The national average compliance score stands at 61.2 out of 100.

The report highlighted several key findings:
- 25% EWS seat reservation: 78% compliance nationally (up from 74% last year)
- Teacher-pupil ratio compliance: 64% of schools within mandated norms
- Infrastructure compliance (toilets, classrooms, library): 71% nationally
- Free textbook/uniform provision: 88% compliance (highest metric)

The Ministry has directed all state education departments to submit action plans within 60 days for bringing non-compliant schools up to RTE norms.`,
    state: 'National', category: 'Policy', date: 'Mar 10, 2025', source: 'Ministry of Education', sourceUrl: '#',
  },
}

export default function NewsDetailPage() {
  const { id } = useParams()
  const article = articles[id] || {
    title: 'News Article', body: 'Content not available.', state: 'India', category: 'News', date: 'Recent', source: 'Unknown', sourceUrl: '#',
  }

  return (
    <div style={{ paddingTop: '64px' }}>
      <div className="py-10 px-4" style={{ background: '#F5EFE0', minHeight: '100vh' }}>
        <div className="max-w-2xl mx-auto">
          <Link to="/news" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink mb-6 transition-colors">
            <ArrowLeftIcon className="w-4 h-4" /> Back to news
          </Link>
          <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 shadow-card">
            <div className="flex gap-2 mb-4">
              <span className="badge-navy text-xs">{article.state}</span>
              <span className="badge-saffron text-xs">{article.category}</span>
            </div>
            <h1 className="text-h1 font-display mb-4" style={{ color: '#1A2744' }}>{article.title}</h1>
            <div className="flex items-center justify-between pb-5 mb-6 border-b" style={{ borderColor: 'rgba(26,39,68,0.08)' }}>
              <p className="text-sm text-muted">Source: <span className="font-semibold text-ink">{article.source}</span> · {article.date}</p>
              <a href={article.sourceUrl} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold transition-colors"
                style={{ color: '#E8872A' }}>
                Full article <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="prose prose-sm max-w-none text-ink">
              {article.body.split('\n\n').map((p, i) => (
                <p key={i} className="mb-4 leading-relaxed">{p}</p>
              ))}
            </div>
          </motion.article>
        </div>
      </div>
    </div>
  )
}
