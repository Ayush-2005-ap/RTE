import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRightIcon, ClockIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import api from '../../services/api'
import { toast } from 'react-hot-toast'

export default function BlogListPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const res = await api.get('/blog?limit=50')
      setPosts(res.data.data.blogs)
    } catch {
      toast.error('Failed to load blog posts')
    } finally {
      setLoading(false)
    }
  }

  const featured = posts.find(p => p.isFeatured)
  const rest = posts.filter(p => p._id !== featured?._id)

  return (
    <div style={{ paddingTop: '64px' }}>
      <div className="py-12 px-4" style={{ background: 'linear-gradient(135deg,#1A2744,#243356)' }}>
        <div className="max-w-6xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest mb-2 block" style={{ color: '#E8872A' }}>RTE Blog</span>
          <h1 className="text-h1 text-white" style={{ fontFamily: "'Playfair Display',serif" }}>Insights & Guides</h1>
          <p className="text-white/60 text-sm mt-2 max-w-lg">Research, guides, and analysis on RTE Act implementation in India.</p>
        </div>
      </div>

      <div className="py-12 px-4 min-h-[50vh]" style={{ background: '#F5EFE0' }}>
        <div className="max-w-6xl mx-auto">
          
          {loading ? (
             <div className="flex justify-center py-20"><ArrowPathIcon className="w-8 h-8 animate-spin text-gray-400" /></div>
          ) : posts.length === 0 ? (
             <div className="text-center py-20 text-gray-500">No blog posts found.</div>
          ) : (
            <>
              {/* Featured */}
              {featured && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                  <Link to={`/blog/${featured.slug}`}>
                    <div className="bg-white rounded-3xl p-8 card-hover border-2 flex flex-col md:flex-row gap-8" style={{ borderColor: 'rgba(232,135,42,0.3)' }}>
                      {featured.featuredImage?.url && (
                        <div className="w-full md:w-1/3">
                          <img src={featured.featuredImage.url} alt="" className="w-full h-48 md:h-full object-cover rounded-2xl" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="badge font-semibold px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(232,135,42,0.15)', color: '#E8872A' }}>⭐ Featured</span>
                          {featured.tags?.map(t => <span key={t} className="badge-muted text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{t}</span>)}
                        </div>
                        <h2 className="text-h2 font-display mb-3" style={{ color: '#1A2744' }}>{featured.title}</h2>
                        <p className="text-gray-500 mb-4 leading-relaxed line-clamp-3">{featured.excerpt}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-auto pt-4 border-t border-gray-100">
                          <span className="font-semibold text-gray-800">{featured.author?.name || 'RTE Team'}</span>
                          <span className="flex items-center gap-1"><ClockIcon className="w-4 h-4" /> 5 min read</span>
                          <span>{new Date(featured.publishedAt || featured.createdAt).toLocaleDateString()}</span>
                          <span className="ml-auto flex items-center gap-1 font-semibold" style={{ color: '#E8872A' }}>
                            Read <ArrowRightIcon className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {rest.map((post, i) => (
                  <motion.div key={post._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="h-full">
                    <Link to={`/blog/${post.slug}`} className="block h-full">
                      <div className="bg-white rounded-2xl overflow-hidden shadow-sm card-hover border h-full flex flex-col"
                        style={{ borderColor: 'rgba(26,39,68,0.07)' }}>
                        {post.featuredImage?.url && (
                          <img src={post.featuredImage.url} alt="" className="w-full h-40 object-cover" />
                        )}
                        <div className="p-5 flex-1 flex flex-col">
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {post.tags?.map(t => <span key={t} className="badge-muted text-xs bg-gray-100 px-2 rounded text-gray-500">{t}</span>)}
                          </div>
                          <h3 className="font-semibold text-lg text-gray-900 leading-snug mb-2 flex-1">{post.title}</h3>
                          <p className="text-sm text-gray-500 line-clamp-2 mb-4">{post.excerpt}</p>
                          <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-4 border-t" style={{ borderColor: 'rgba(26,39,68,0.06)' }}>
                            <div>
                              <span className="font-semibold text-gray-700">{post.author?.name || 'RTE Team'}</span> · {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                            </div>
                            <span className="flex items-center gap-1"><ClockIcon className="w-3.5 h-3.5" /> 5 min</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
