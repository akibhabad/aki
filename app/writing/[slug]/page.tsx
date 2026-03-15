import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import type { Metadata } from 'next'

const contentDir = path.join(process.cwd(), 'content', 'writing')

interface Frontmatter {
  title: string
  dek?: string
  author?: string
  date?: string
  readingTime?: string
  institution?: string
  tags?: string[]
  pdf?: string
  summary?: string
}

export async function generateStaticParams() {
  if (!fs.existsSync(contentDir)) return []
  return fs
    .readdirSync(contentDir)
    .filter(f => f.endsWith('.mdx'))
    .map(f => ({ slug: f.replace(/\.mdx$/, '') }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const fp = path.join(contentDir, `${params.slug}.mdx`)
  if (!fs.existsSync(fp)) return { title: 'Not Found' }
  const { data } = matter(fs.readFileSync(fp, 'utf-8'))
  const fm = data as Frontmatter
  return { title: fm.title, description: fm.dek ?? fm.summary }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const fp = path.join(contentDir, `${params.slug}.mdx`)

  if (!fs.existsSync(fp)) {
    return (
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '7rem 1.5rem 6rem' }}>
        <p style={{ fontFamily: 'Georgia, serif', color: '#5e5e78' }}>Article not found.</p>
        <Link href="/writing" style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.875rem', color: '#7c5cbf' }}>
          ← Writing
        </Link>
      </div>
    )
  }

  const raw = fs.readFileSync(fp, 'utf-8')
  const { data, content } = matter(raw)
  const fm = data as Frontmatter

  return (
    <div style={{ paddingTop: '52px' }}>
      <article style={{ maxWidth: '680px', margin: '0 auto', padding: '4rem 1.5rem 6rem' }}>

        {/* Back */}
        <div style={{ marginBottom: '3rem' }}>
          <Link href="/writing" style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '0.8125rem',
            color: '#4a4a62',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}>
            ← Writing
          </Link>
        </div>

        {/* Tags */}
        {fm.tags && fm.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {fm.tags.map(tag => (
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

        {/* Title */}
        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
          fontWeight: 'normal',
          color: '#dddae8',
          lineHeight: 1.25,
          letterSpacing: '-0.01em',
          marginBottom: fm.dek ? '1rem' : '1.5rem',
        }}>
          {fm.title}
        </h1>

        {/* Dek */}
        {fm.dek && (
          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '1.0625rem',
            color: '#7a7692',
            fontStyle: 'italic',
            lineHeight: 1.65,
            marginBottom: '1.5rem',
          }}>
            {fm.dek}
          </p>
        )}

        {/* Metadata row */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          paddingTop: '1rem',
          paddingBottom: '1rem',
          borderTop: '1px solid #1c1c26',
          borderBottom: '1px solid #1c1c26',
          marginBottom: '2.5rem',
        }}>
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '0.8rem',
            color: '#4a4a62',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            alignItems: 'center',
          }}>
            {fm.author && <span style={{ color: '#8a8699' }}>{fm.author}</span>}
            {fm.author && fm.institution && <span>·</span>}
            {fm.institution && <span>{fm.institution}</span>}
            {fm.date && <><span>·</span><span>{fm.date}</span></>}
            {fm.readingTime && <><span>·</span><span>{fm.readingTime}</span></>}
          </div>

          {fm.pdf && (
            <a href={fm.pdf} download style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '0.78rem',
              color: '#7c5cbf',
              border: '1px solid rgba(124, 92, 191, 0.3)',
              padding: '0.3rem 0.75rem',
              borderRadius: '4px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              whiteSpace: 'nowrap',
            }}>
              ↓ Download PDF
            </a>
          )}
        </div>

        {/* Abstract */}
        {fm.summary && (
          <div style={{
            borderLeft: '2px solid rgba(124, 92, 191, 0.5)',
            paddingLeft: '1.25rem',
            marginBottom: '2.5rem',
          }}>
            <p style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#7c5cbf',
              marginBottom: '0.5rem',
            }}>
              Abstract
            </p>
            <p style={{
              fontFamily: 'Georgia, serif',
              fontSize: '0.9375rem',
              color: '#8a8699',
              lineHeight: 1.75,
              fontStyle: 'italic',
            }}>
              {fm.summary}
            </p>
          </div>
        )}

        {/* Body */}
        <div className="article-body">
          <MDXRemote source={content} />
        </div>

        {/* Bottom PDF */}
        {fm.pdf && (
          <div style={{
            marginTop: '4rem',
            paddingTop: '2rem',
            borderTop: '1px solid #1c1c26',
          }}>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', color: '#4a4a62', marginBottom: '0.75rem' }}>
              This paper is also available as a PDF.
            </p>
            <a href={fm.pdf} download style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '0.8125rem',
              color: '#7c5cbf',
              border: '1px solid rgba(124, 92, 191, 0.3)',
              padding: '0.4rem 1rem',
              borderRadius: '4px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}>
              ↓ Download PDF
            </a>
          </div>
        )}

        {/* Back nav */}
        <div style={{ marginTop: '3.5rem' }}>
          <Link href="/writing" style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '0.8125rem',
            color: '#4a4a62',
          }}>
            ← All writing
          </Link>
        </div>
      </article>
    </div>
  )
}
