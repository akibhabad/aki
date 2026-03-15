import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aki Bhabad',
}

export default function HomePage() {
  return (
    <div style={{ paddingTop: '80px', maxWidth: '680px', margin: '0 auto', padding: '7rem 1.5rem 6rem' }}>
      <h1 style={{
        fontFamily: 'Georgia, serif',
        fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
        fontWeight: 'normal',
        color: '#dddae8',
        marginBottom: '1.25rem',
        letterSpacing: '-0.01em',
      }}>
        Aki Bhabad
      </h1>

      <p style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: '1rem',
        color: '#5e5e78',
        marginBottom: '2.5rem',
        lineHeight: 1.6,
      }}>
        Curious about startups, intelligence, the universe, and how things work.
      </p>

      <p style={{
        fontFamily: 'Georgia, serif',
        fontSize: '0.9375rem',
        color: '#8a8699',
        lineHeight: 1.75,
        marginBottom: '3rem',
        maxWidth: '480px',
      }}>
        This site is a home for writing, projects, and ideas I'm working through.
      </p>

      <Link href="/writing" style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: '0.875rem',
        color: '#7c5cbf',
        borderBottom: '1px solid rgba(124, 92, 191, 0.35)',
        paddingBottom: '1px',
        transition: 'border-color 0.15s',
      }}>
        Read the writing →
      </Link>
    </div>
  )
}
