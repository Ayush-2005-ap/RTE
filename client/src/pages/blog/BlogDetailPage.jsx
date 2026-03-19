import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, ClockIcon, ShareIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import api from '../../services/api'
import { toast } from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'

export default function BlogDetailPage() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/blog/${slug}`)
        setPost(res.data.data.blog)
      } catch {
        toast.error('Blog post not found')
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [slug])

  if (loading) return <div className="min-h-screen pt-32 flex justify-center"><ArrowPathIcon className="w-8 h-8 animate-spin text-gray-400" /></div>
  
  if (!post) return <div className="min-h-screen pt-32 text-center text-gray-500">Post not found. <Link to="/blog" className="text-blue-600 underline">Go back</Link></div>

  return (
    <div style={{ paddingTop: '64px' }}>
      <div className="py-10 px-4" style={{ background: '#F5EFE0', minHeight: '100vh' }}>
        <div className="max-w-3xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#1A2744] mb-6 transition-colors">
            <ArrowLeftIcon className="w-4 h-4" /> Back to blog
          </Link>
          <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
            
            <div className="flex flex-wrap gap-2 mb-5">
              {post.tags?.map(t => <span key={t} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">{t}</span>)}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6" style={{ color: '#1A2744', lineHeight: 1.2 }}>{post.title}</h1>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 pb-6 mb-8 border-b border-gray-100">
              <span className="font-semibold text-gray-800">{post.author?.name || 'RTE Team'}</span>
              <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'})}</span>
              <span className="flex items-center gap-1"><ClockIcon className="w-4 h-4" /> 5 min read</span>
              <button className="ml-auto flex items-center gap-1 text-xs font-semibold hover:opacity-80 transition-opacity" style={{ color: '#E8872A' }}>
                <ShareIcon className="w-4 h-4" /> Share
              </button>
            </div>

            {post.featuredImage && (
              <div className="mb-10 w-full overflow-hidden rounded-2xl">
                <img src={post.featuredImage} alt={post.title} className="w-full object-cover max-h-[450px]" />
              </div>
            )}

            <div className="prose prose-lg max-w-none text-gray-700" style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
                <ReactMarkdown>{post.body || post.excerpt}</ReactMarkdown>
            </div>
            
            <div className="mt-12 pt-8 border-t border-gray-100 bg-gray-50 rounded-2xl p-6">
              <p className="text-base font-serif font-bold text-[#1A2744] mb-3">Have questions about this topic?</p>
              <div className="flex flex-wrap gap-3">
                <Link to="/community" className="px-5 py-2.5 rounded-xl text-sm font-semibold border-2 border-[#1A2744] text-[#1A2744] hover:bg-[#1A2744] hover:text-white transition-colors">Join Discussion</Link>
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </div>
  )
}
