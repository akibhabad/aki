'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/writing', label: 'Writing' },
  { href: '/projects', label: 'Projects' },
  { href: '/library', label: 'Library' },
  { href: '/astro', label: 'Astrophotography' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  // close the mobile panel on navigation and on Escape
  useEffect(() => { setOpen(false) }, [pathname])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="site-nav">
      <div className="site-nav-inner">
        <Link href="/" className="site-nav-brand">
          Aki Bhabad
        </Link>

        <nav className="site-nav-links" aria-label="Primary">
          {links.slice(1).map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`site-nav-link${isActive(href) ? ' is-active' : ''}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="site-nav-toggle"
          aria-expanded={open}
          aria-controls="site-nav-panel"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="site-nav-toggle-label">{open ? 'Close' : 'Menu'}</span>
          <span className="site-nav-toggle-icon" aria-hidden="true">
            <span /><span />
          </span>
        </button>
      </div>

      <div id="site-nav-panel" className="site-nav-panel" hidden={!open}>
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`site-nav-panel-link${isActive(href) ? ' is-active' : ''}`}
          >
            {label}
          </Link>
        ))}
      </div>
    </header>
  )
}
