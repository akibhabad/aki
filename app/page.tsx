import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import AnimatedName from '@/components/AnimatedName'
import GalaxyLazy from '@/components/galaxy/GalaxyLazy'
import RocketLazy from '@/components/rocket/RocketLazy'

export const metadata: Metadata = {
  title: 'Aki Bhabad',
}

const sections = [
  { href: '/writing',  label: 'Some of my writing'  },
  { href: '/projects', label: 'Some of my projects' },
  { href: '/astro',    label: 'My Astro'            },
]

const externalLinks = [
  { href: 'https://x.com/_bhab', label: 'X' },
  { href: 'https://www.linkedin.com/in/aki-bhabad/', label: 'LinkedIn' },
]

function LinkedInIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="currentColor"
    >
      <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3A2 2 0 1 0 5.3 7 2 2 0 0 0 5.25 3ZM20.44 12.44c0-3.08-1.64-4.51-3.84-4.51a3.33 3.33 0 0 0-3 1.64V8.5h-3.37c.04.71 0 11.5 0 11.5h3.37v-6.42c0-.34.02-.68.12-.92.27-.68.87-1.39 1.88-1.39 1.33 0 1.87 1.05 1.87 2.58V20H21s.04-6.33.04-7.56Z" />
    </svg>
  )
}

export default function HomePage() {
  return (
    <div className="home-shell">
      <section className="home-hero">
        <div className="home-hero-rocket">
          <RocketLazy className="home-rocket-canvas" />
        </div>

        <div className="home-hero-text">
          <AnimatedName />

          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '1rem',
            color: '#7a7a7a',
            marginBottom: 0,
            lineHeight: 1.6,
          }}>
            Curious about startups, intelligence, the universe, and how things work.
          </p>
        </div>

        <div className="home-hero-galaxy">
          <GalaxyLazy className="home-galaxy-canvas" />
        </div>
      </section>

      <div className="home-below">
      <p style={{
        fontFamily: 'Georgia, serif',
        fontSize: '0.9375rem',
        color: '#8a8a8a',
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
            color: '#f2f2f2',
            border: '1px solid rgba(255, 255, 255, 0.188)',
            padding: '0.45rem 1rem',
            borderRadius: '5px',
            display: 'inline-block',
            letterSpacing: '0.01em',
          }}>
            {label} →
          </Link>
        ))}
      </div>

      <div style={{
        marginTop: '3.25rem',
        paddingTop: '1.25rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.09)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.9rem',
        flexWrap: 'wrap',
      }}>
        <span style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '0.72rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#5c5c5c',
        }}>
          Elsewhere
        </span>

        {externalLinks.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontFamily: 'system-ui, sans-serif',
              fontSize: '0.84rem',
              color: '#cfcfcf',
              padding: '0.32rem 0.05rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.135)',
              transition: 'color 0.15s ease, border-color 0.15s ease, transform 0.15s ease',
            }}
            aria-label={`${label} profile`}
          >
            {label === 'X' ? (
              <Image
                src="/x-logo.svg"
                alt="X"
                width={16}
                height={16}
                style={{
                  width: '0.9rem',
                  height: '0.9rem',
                  display: 'block',
                }}
              />
            ) : (
              <>
                <LinkedInIcon />
                <span>{label}</span>
              </>
            )}
            <span aria-hidden="true" style={{ fontSize: '0.72rem', color: '#f2f2f2' }}>↗</span>
          </a>
        ))}
      </div>
      </div>
    </div>
  )
}
