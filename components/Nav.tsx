'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Home' },
  { href: '/writing', label: 'Writing' },
  { href: '/projects', label: 'Projects' },
  { href: '/curiosities', label: 'Curiosities' },
  { href: '/library', label: 'Library' },
  { href: '/astro', label: 'Astro' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Nav() {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      borderBottom: '1px solid rgba(157, 127, 224, 0.14)',
      backgroundColor: 'rgba(8, 6, 18, 0.55)',
      backdropFilter: 'blur(14px) saturate(140%)',
      WebkitBackdropFilter: 'blur(14px) saturate(140%)',
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 1.5rem',
        height: '52px',
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
      }}>
        <Link href="/" style={{
          fontFamily: 'Georgia, serif',
          fontSize: '0.9375rem',
          color: '#dddae8',
          flexShrink: 0,
        }}>
          Aki Bhabad
        </Link>

        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.125rem',
          overflowX: 'auto',
          flexShrink: 0,
        }}>
          {links.slice(1).map(({ href, label }) => {
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '0.8125rem',
                  color: active ? '#b0a8d0' : '#4a4a62',
                  padding: '0.3rem 0.6rem',
                  borderRadius: '4px',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.15s',
                  letterSpacing: '0.01em',
                }}
              >
                {label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
