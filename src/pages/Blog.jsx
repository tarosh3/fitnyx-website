import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getAllPosts } from '../data/posts'

export default function Blog() {
  const [posts, setPosts] = useState([])
  useEffect(() => { getAllPosts().then(setPosts) }, [])
  const siteUrl = 'https://fitnyx.in'
  const pageUrl = `${siteUrl}/blog`

  return (
    <>
      <Helmet>
        <title>Fitness Insights & Training Science · FitNyx Blog</title>
        <meta name="description" content="Training science, AI coaching, programming, and recovery — written for lifters who want to know what's actually working." />
        <meta name="keywords" content="fitness blog, workout guides, training science, AI coaching, nutrition, muscle gain, fat loss, recovery, programming" />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="FitNyx Insights — training science for serious lifters" />
        <meta property="og:description" content="Training science, AI coaching, programming, and recovery." />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={`${siteUrl}/og-image.png`} />
        <meta property="og:site_name" content="FitNyx" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={`${siteUrl}/og-image.png`} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'FitNyx Insights',
          url: pageUrl,
          publisher: { '@type': 'Organization', name: 'FitNyx', url: siteUrl },
          blogPost: posts.map((p) => ({
            '@type': 'BlogPosting',
            headline: p.title,
            datePublished: p.date,
            url: `${siteUrl}/blog/${p.slug}`,
            author: { '@type': 'Person', name: p.author?.name || 'FitNyx' },
          })),
        })}</script>
      </Helmet>

      <section className="blog-page">
        <div className="blog-page-inner">
          <header className="blog-page-head">
            <span className="blog-page-eyebrow">Insights</span>
            <h1 className="blog-page-title">Training science, written for lifters.</h1>
            <p className="blog-page-sub">
              Programming, AI coaching, nutrition, recovery. No fluff, no hype. Read what's working in the lab and at the rack.
            </p>
          </header>

          <ol className="blog-list">
            {posts.map((p, i) => (
              <li key={p.slug} className="blog-list-item">
                <Link to={`/blog/${p.slug}`} className="blog-list-link">
                  <span className="blog-list-index">{String(i + 1).padStart(2, '0')}</span>
                  <div className="blog-list-body">
                    <div className="blog-list-meta">
                      {p.tags.map((t) => (
                        <span className="blog-tag" key={t}>{t}</span>
                      ))}
                      <span className="blog-list-date">
                        {new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="blog-list-read">· {p.readMinutes} min read</span>
                    </div>
                    <h2 className="blog-list-title">{p.title}</h2>
                    <p className="blog-list-excerpt">{p.excerpt}</p>
                    <span className="blog-list-arrow">
                      Read post
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
