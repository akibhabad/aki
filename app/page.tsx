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

const bio = [
  'techno-optimist',
  'astronomy, intelligence, fitness & longevity',
  '19 yr old cs & entrepreneurship student',
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

export default function HomePage() {
  return (
    <div className="home-shell">
      <section className="home-hero">
        <div className="home-hero-rocket">
          <RocketLazy className="home-rocket-canvas" />
        </div>

        <div className="home-hero-text">
          <AnimatedName />

          <ul className="home-bio">
            {bio.map((line) => (
              <li key={line}>
                <span aria-hidden="true" className="home-bio-mark">➢</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <div className="home-links">
            {sections.map(({ href, label }) => (
              <Link key={href} href={href} className="home-link">
                {label} →
              </Link>
            ))}
          </div>

          <div className="home-contact">
            <a href={`mailto:${EMAIL}`} className="home-contact-link" aria-label="Email">
              <span>{EMAIL}</span>
            </a>

            {socials.map(({ href, label, handle }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="home-contact-link"
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
                <span aria-hidden="true" className="home-contact-arrow">↗</span>
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
