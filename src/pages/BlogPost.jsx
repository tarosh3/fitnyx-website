import { useEffect, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getPost, getAllPosts } from '../data/posts'

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(undefined)
  const [all, setAll] = useState([])

  useEffect(() => {
    let cancelled = false
    Promise.all([getPost(slug), getAllPosts()]).then(([p, list]) => {
      if (cancelled) return
      setPost(p)
      setAll(list)
    })
    return () => { cancelled = true }
  }, [slug])

  useEffect(() => {
    if (post && post.title) document.title = `${post.title} · FitNyx Insights`
  }, [post])

  if (post === undefined) return <div className="blog-post"><div className="blog-post-inner"><p className="muted">Loading...</p></div></div>
  if (post === null) return <Navigate to="/blog" replace />

  const siteUrl = 'https://fitnyx.in'
  const url = `${siteUrl}/blog/${post.slug}`
  const idx = all.findIndex((p) => p.slug === post.slug)
  const prev = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null
  const next = idx > 0 ? all[idx - 1] : null

  const dateLabel = new Date(post.date).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })

  return (
    <>
      <Helmet>
        <title>{post.title} · FitNyx Insights</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={post.cover || `${siteUrl}/og-image.png`} />
        <meta property="og:site_name" content="FitNyx" />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content={post.author?.name || 'FitNyx'} />
        {post.tags.map((t) => (
          <meta property="article:tag" content={t} key={t} />
        ))}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={post.cover || `${siteUrl}/og-image.png`} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          datePublished: post.date,
          dateModified: post.date,
          image: post.cover || `${siteUrl}/og-image.png`,
          author: { '@type': 'Person', name: post.author?.name || 'FitNyx' },
          publisher: {
            '@type': 'Organization',
            name: 'FitNyx',
            url: siteUrl,
            logo: { '@type': 'ImageObject', url: `${siteUrl}/favicon.png` },
          },
          mainEntityOfPage: { '@type': 'WebPage', '@id': url },
          keywords: post.tags.join(', '),
        })}</script>
      </Helmet>

      <article className="blog-post">
        <div className="blog-post-inner">
          <Link to="/blog" className="blog-post-back">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            All insights
          </Link>

          <header className="blog-post-head">
            <div className="blog-post-meta">
              {post.tags.map((t) => (
                <span className="blog-tag" key={t}>{t}</span>
              ))}
              <span className="blog-post-date">{dateLabel}</span>
              <span className="blog-post-read">· {post.readMinutes} min read</span>
            </div>
            <h1 className="blog-post-title">{post.title}</h1>
            <p className="blog-post-excerpt">{post.excerpt}</p>
            {post.author && (
              <div className="blog-post-author">
                <span className="blog-post-author-avatar">{post.author.name.charAt(0)}</span>
                <div>
                  <span className="blog-post-author-name">{post.author.name}</span>
                  <span className="blog-post-author-role">{post.author.role}</span>
                </div>
              </div>
            )}
          </header>

          {post.cover && (
            <div className="blog-post-cover">
              <img src={post.cover} alt={post.title} loading="lazy" />
            </div>
          )}

          <div className="blog-post-body" dangerouslySetInnerHTML={{ __html: post.content }} />

          {(prev || next) && (
            <nav className="blog-post-nav" aria-label="More posts">
              <span className="blog-post-nav-eyebrow">More insights</span>
              <div className="blog-post-nav-row">
                {prev && (
                  <Link to={`/blog/${prev.slug}`} className="blog-post-nav-link blog-post-nav-link--prev">
                    <span className="blog-post-nav-lbl">← Previous</span>
                    <span className="blog-post-nav-title">{prev.title}</span>
                  </Link>
                )}
                {next && (
                  <Link to={`/blog/${next.slug}`} className="blog-post-nav-link blog-post-nav-link--next">
                    <span className="blog-post-nav-lbl">Next →</span>
                    <span className="blog-post-nav-title">{next.title}</span>
                  </Link>
                )}
              </div>
            </nav>
          )}
        </div>
      </article>
    </>
  )
}
