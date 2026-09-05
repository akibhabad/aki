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
  { href: '/writing',  label: 'Writing'          },
  { href: '/projects', label: 'Projects'         },
  { href: '/astro',    label: 'Astrophotography' },
]

const EMAIL = 'akibhabad7@gmail.com'

const socials = [
  { href: 'https://x.com/_bhab',              label: 'X',         handle: '@_bhab'   },
  { href: 'https://www.instagram.com/gpt.aki', label: 'Instagram', handle: '@gpt.aki' },
]

function InstagramIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

const linkStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.45rem',
  fontFamily: 'system-ui, sans-serif',
  fontSize: '0.84rem',
  color: '#cfcfcf',
  padding: '0.3rem 0.05rem',
  borderBottom: '1px solid rgba(255, 255, 255, 0.135)',
  transition: 'color 0.15s ease, border-color 0.15s ease',
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
            marginBottom: '1.1rem',
            lineHeight: 1.6,
          }}>
            Curious about startups, intelligence, the universe, and how things work.
          </p>

          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '0.9375rem',
            color: '#8a8a8a',
            lineHeight: 1.7,
            marginBottom: '1.75rem',
            maxWidth: '420px',
          }}>
            This site is a home for writing, projects, and ideas I'm working through.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '2rem' }}>
            {sections.map(({ href, label }) => (
              <Link key={href} href={href} style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '0.86rem',
                color: '#f2f2f2',
                border: '1px solid rgba(255, 255, 255, 0.188)',
                padding: '0.42rem 0.95rem',
                borderRadius: '5px',
                display: 'inline-block',
                letterSpacing: '0.01em',
                whiteSpace: 'nowrap',
              }}>
                {label} →
              </Link>
            ))}
          </div>

          <div style={{
            paddingTop: '1.1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.09)',
            display: 'flex',
            alignItems: 'center',
            gap: '1.1rem',
            flexWrap: 'wrap',
          }}>
            <a href={`mailto:${EMAIL}`} style={linkStyle} aria-label="Email">
              <span>{EMAIL}</span>
            </a>

            {socials.map(({ href, label, handle }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer"
                style={linkStyle}
                aria-label={`${label} profile`}
              >
                {label === 'X' ? (
                  <Image
                    src="/x-logo.svg"
                    alt="X"
                    width={16}
                    height={16}
                    style={{ width: '0.85rem', height: '0.85rem', display: 'block' }}
                  />
                ) : (
                  <InstagramIcon />
                )}
                <span>{handle}</span>
                <span aria-hidden="true" style={{ fontSize: '0.7rem', color: '#8a8a8a' }}>↗</span>
              </a>
            ))}
          </div>
        </div>

        <div className="home-hero-galaxy">
          <GalaxyLazy className="home-galaxy-canvas" />
        </div>
      </section>
    </div>
  )
}
