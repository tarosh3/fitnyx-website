# Blog authoring — quick guide

All blog content lives in **one file**: `src/data/blogPosts.js`.

## Add a new post

1. Open `src/data/blogPosts.js`.
2. Add a new object to the `blogPosts` array (top of array = newest, but order doesn't matter — posts are sorted by `date`).

```js
{
  slug: 'my-new-post-url-slug',        // becomes /blog/my-new-post-url-slug
  title: 'My post title',
  excerpt: 'One-sentence summary used on the list page and meta description.',
  date: '2026-05-20',                  // ISO YYYY-MM-DD
  readMinutes: 5,
  tags: ['Training', 'Recovery'],      // shown as chips
  cover: '/assets/blog-my-post.jpg',   // optional cover image — path under /public
  author: { name: 'Your name', role: 'Your title' },
  content: `
<p>Opening paragraph.</p>
<h2>A section heading</h2>
<p>More text. Use <strong>bold</strong> and <em>italics</em> as needed.</p>
<ul>
  <li>Bullet one</li>
  <li>Bullet two</li>
</ul>
<img src="/assets/blog-my-post-inline.jpg" alt="Description of image" />
<blockquote>A pull quote.</blockquote>
  `,
},
```

3. Save. Dev server hot-reloads. Production build (`npm run build`) auto-regenerates `sitemap.xml`.

## Add images

### Cover image
- Drop file in `public/assets/` (e.g. `public/assets/blog-my-post.jpg`).
- Reference in the post object as `cover: '/assets/blog-my-post.jpg'`.
- Renders as a 16:9 banner above the body.

### Inline images inside post content
- Drop file in `public/assets/`.
- Reference inside the `content` HTML string:

```html
<img src="/assets/blog-my-post-inline.jpg" alt="Alt text for SEO + a11y" />
```

- Or use a `<figure>` with caption:

```html
<figure>
  <img src="/assets/blog-my-post-inline.jpg" alt="Alt text" />
  <figcaption>Caption text shown under the image.</figcaption>
</figure>
```

- Always include an `alt` attribute — required for SEO and accessibility.

## Recommended image specs

- **Format**: WebP or JPG. WebP for smaller file sizes.
- **Cover size**: 1600 × 900 (16:9), under 200 KB after compression.
- **Inline size**: 1200 wide max, under 150 KB.
- **Tools**: [squoosh.app](https://squoosh.app) for quick browser-based compression.

## Supported HTML tags inside `content`

- Headings: `<h2>`, `<h3>`
- Paragraphs: `<p>`
- Lists: `<ul>`, `<ol>`, `<li>`
- Emphasis: `<strong>`, `<em>`
- Links: `<a href="...">`
- Images: `<img>`, `<figure>`, `<figcaption>`
- Quotes: `<blockquote>`
- Code: `<code>`, `<pre><code>...</code></pre>`

Everything inherits the design system — no CSS needed in post content.

## Sitemap

Every post automatically lands in `dist/sitemap.xml` on build. Submit the sitemap once to Google Search Console — future posts are picked up on each deploy.

## Quick checklist for a new post

- [ ] Unique `slug` (lowercase, dashes, no spaces)
- [ ] Compelling `title` (under 70 chars for SEO)
- [ ] `excerpt` (under 160 chars — used as meta description)
- [ ] `date` in `YYYY-MM-DD`
- [ ] `tags` (1–3)
- [ ] Cover image in `/public/assets/`
- [ ] All inline `<img>` tags have `alt` attributes
- [ ] Headings use `<h2>` / `<h3>` (the post title is the page's `<h1>`)
- [ ] `npm run build` succeeds, sitemap shows new URL
