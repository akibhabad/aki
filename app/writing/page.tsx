import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Writing' }

interface ArticleMeta {
  slug: string
  title: string
  dek?: string
  date?: string
  readingTime?: string
  tags?: string[]
}

function getArticles(): ArticleMeta[] {
  const dir = path.join(process.cwd(), 'content', 'writing')
  if (!fs.existsSync(dir)) return []

  return fs
    .readdirSync(dir)
    .filter(f => f.endsWith('.mdx'))
    .map(filename => {
      const raw = fs.readFileSync(path.join(dir, filename), 'utf-8')
      const { data } = matter(raw)
      return {
        slug: filename.replace(/\.mdx$/, ''),
        title: data.title ?? filename,
        dek: data.dek,
        date: data.date,
        readingTime: data.readingTime,
        tags: data.tags,
      }
    })
    .sort((a, b) => {
      if (!a.date || !b.date) return 0
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
}

export default function WritingPage() {
  const articles = getArticles()

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '7rem 1.5rem 6rem' }}>
      <p style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: '0.7rem',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: '#7c5cbf',
        marginBottom: '1.5rem',
      }}>
        Writing
      </p>

      <h1 style={{
        fontFamily: 'Georgia, serif',
        fontSize: '1.75rem',
        fontWeight: 'normal',
        color: '#dddae8',
        marginBottom: '3rem',
      }}>
        Essays &amp; Research
      </h1>

      {articles.length === 0 ? (
        <p style={{ fontFamily: 'Georgia, serif', fontSize: '0.9375rem', color: '#5e5e78' }}>
          No articles yet.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {articles.map(article => (
            <Link
              key={article.slug}
              href={`/writing/${article.slug}`}
              style={{
                display: 'block',
                padding: '1.75rem 0',
                borderBottom: '1px solid #1c1c26',
              }}
            >
              {article.tags && article.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.625rem', flexWrap: 'wrap' }}>
                  {article.tags.map(tag => (
                    <span key={tag} style={{
                      fontFamily: 'system-ui, sans-serif',
                      fontSize: '0.65rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#7c5cbf',
                      border: '1px solid rgba(124, 92, 191, 0.25)',
                      padding: '0.1rem 0.45rem',
                      borderRadius: '3px',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <h2 style={{
                fontFamily: 'Georgia, serif',
                fontSize: '1.125rem',
                fontWeight: 'normal',
                color: '#dddae8',
                marginBottom: article.dek ? '0.5rem' : '0.75rem',
                lineHeight: 1.35,
              }}>
                {article.title}
              </h2>

              {article.dek && (
                <p style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '0.9rem',
                  color: '#7a7692',
                  fontStyle: 'italic',
                  marginBottom: '0.75rem',
                  lineHeight: 1.6,
                }}>
                  {article.dek}
                </p>
              )}

              <div style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '0.78rem',
                color: '#3e3e54',
                display: 'flex',
                gap: '0.75rem',
              }}>
                {article.date && <span>{article.date}</span>}
                {article.readingTime && <span>{article.readingTime}</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
