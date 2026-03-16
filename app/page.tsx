import Link from 'next/link'
import type { Metadata } from 'next'
import AnimatedName from '@/components/AnimatedName'

export const metadata: Metadata = {
  title: 'Aki Bhabad',
}

const sections = [
  { href: '/writing',  label: 'Some of my writing'  },
  { href: '/projects', label: 'Some of my projects' },
  { href: '/astro',    label: 'My Astro'            },
]

export default function HomePage() {
  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '7rem 1.5rem 6rem' }}>
      <AnimatedName />

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
        color: '#7a7692',
        lineHeight: 1.75,
        marginBottom: '3.5rem',
        maxWidth: '460px',
      }}>
        This site is a home for writing, projects, and ideas I'm working through.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start' }}>
        {sections.map(({ href, label }) => (
          <Link key={href} href={href} style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '0.875rem',
            color: '#7c5cbf',
            border: '1px solid rgba(124, 92, 191, 0.25)',
            padding: '0.45rem 1rem',
            borderRadius: '5px',
            display: 'inline-block',
            letterSpacing: '0.01em',
          }}>
            {label} →
          </Link>
        ))}
      </div>
    </div>
  )
}
