import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllPosts } from '../data/posts'
import { blogPosts as fallback } from '../data/blogPosts'

export default function BlogPreview() {
  const [posts, setPosts] = useState([])
  useEffect(() => {
    getAllPosts().then((p) => {
      const seen = new Set()
      const merged = [...p, ...fallback].filter((post) => {
        if (seen.has(post.slug)) return false
        seen.add(post.slug)
        return true
      })
      setPosts(merged.slice(0, 3))
    })
  }, [])
  if (!posts.length) return null

  return (
    <section className="std-section blog-preview" id="insights">
      <div className="si-inner">
        <div className="blog-preview-head">
          <div>
            <span className="blog-page-eyebrow">Insights</span>
            <h2 className="blog-preview-title">Read what actually moves the needle.</h2>
          </div>
          <Link to="/blog" className="blog-preview-all">
            View all posts
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="blog-preview-grid">
          {posts.map((p) => (
            <Link to={`/blog/${p.slug}`} key={p.slug} className="blog-card">
              <div className="blog-card-meta">
                {p.tags.slice(0, 1).map((t) => (
                  <span className="blog-tag" key={t}>{t}</span>
                ))}
                <span className="blog-card-date">
                  {new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <h3 className="blog-card-title">{p.title}</h3>
              <p className="blog-card-excerpt">{p.excerpt}</p>
              <span className="blog-card-arrow">
                Read
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
