'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import GalaxyScene from './GalaxyScene'

const sections = [
  { href: '/writing',  label: 'Writing',  id: '01' },
  { href: '/projects', label: 'Projects', id: '02' },
  { href: '/astro',    label: 'Astro',    id: '03' },
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
      width="14"
      height="14"
      fill="currentColor"
    >
      <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3A2 2 0 1 0 5.3 7 2 2 0 0 0 5.25 3ZM20.44 12.44c0-3.08-1.64-4.51-3.84-4.51a3.33 3.33 0 0 0-3 1.64V8.5h-3.37c.04.71 0 11.5 0 11.5h3.37v-6.42c0-.34.02-.68.12-.92.27-.68.87-1.39 1.88-1.39 1.33 0 1.87 1.05 1.87 2.58V20H21s.04-6.33.04-7.56Z" />
    </svg>
  )
}

function TickCorner({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const size = 14
  const thick = 1
  const color = 'rgba(190, 170, 255, 0.55)'
  const offset = 20
  const style: React.CSSProperties = {
    position: 'absolute',
    width: size,
    height: size,
    pointerEvents: 'none',
  }
  if (position === 'tl') { style.top = offset; style.left = offset }
  if (position === 'tr') { style.top = offset; style.right = offset }
  if (position === 'bl') { style.bottom = offset; style.left = offset }
  if (position === 'br') { style.bottom = offset; style.right = offset }

  const h = position === 'tl' || position === 'bl' ? 'left' : 'right'
  const v = position === 'tl' || position === 'tr' ? 'top' : 'bottom'

  return (
    <div style={style}>
      <div style={{
        position: 'absolute',
        [v]: 0, [h]: 0,
        width: size, height: thick, background: color,
      } as React.CSSProperties} />
      <div style={{
        position: 'absolute',
        [v]: 0, [h]: 0,
        width: thick, height: size, background: color,
      } as React.CSSProperties} />
    </div>
  )
}

function useUTC() {
  const [now, setNow] = useState<string>('')
  useEffect(() => {
    const fmt = () => {
      const d = new Date()
      const hh = String(d.getUTCHours()).padStart(2, '0')
      const mm = String(d.getUTCMinutes()).padStart(2, '0')
      const ss = String(d.getUTCSeconds()).padStart(2, '0')
      return `${hh}:${mm}:${ss} UTC`
    }
    setNow(fmt())
    const id = setInterval(() => setNow(fmt()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

export default function HeroInterstellar() {
  const [mounted, setMounted] = useState(false)
  const utc = useUTC()

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <GalaxyScene />

      {/* vignette / scan overlay layer — sits between canvas and content */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 3px)',
          mixBlendMode: 'overlay',
        }}
      />

      {/* HUD corner ticks */}
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
        <TickCorner position="tl" />
        <TickCorner position="tr" />
        <TickCorner position="bl" />
        <TickCorner position="br" />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); filter: blur(6px); }
          to   { opacity: 1; transform: translateY(0);   filter: blur(0); }
        }
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes blink {
          0%, 60% { opacity: 1; }
          61%, 100% { opacity: 0.25; }
        }
        @keyframes scrollDot {
          0% { transform: translateY(0); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: translateY(14px); opacity: 0; }
        }
        .iso-fade { opacity: 0; }
        .iso-fade.in { animation: fadeIn 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .iso-delay-1.in { animation-delay: 0.25s; }
        .iso-delay-2.in { animation-delay: 0.55s; }
        .iso-delay-3.in { animation-delay: 0.9s; }
        .iso-delay-4.in { animation-delay: 1.3s; }
        .iso-delay-5.in { animation-delay: 1.7s; }

        .name-gradient {
          background: linear-gradient(
            100deg,
            #ffd9a8 0%,
            #ffb878 18%,
            #e79cff 42%,
            #9d7fe0 62%,
            #6fc8ff 82%,
            #aee5ff 100%
          );
          background-size: 220% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 14s linear infinite;
          filter: drop-shadow(0 0 22px rgba(156, 108, 255, 0.22));
        }

        .mono {
          font-family: 'SF Mono', 'JetBrains Mono', 'Menlo', 'Consolas', monospace;
          font-feature-settings: 'ss01', 'tnum';
        }

        .chip {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.7rem 1.1rem 0.7rem 0.9rem;
          background: rgba(14, 12, 28, 0.45);
          border: 1px solid rgba(157, 127, 224, 0.28);
          border-radius: 4px;
          color: #e7e3ff;
          font-family: 'SF Mono', 'Menlo', monospace;
          font-size: 0.78rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          transition: border-color 0.2s ease, background 0.2s ease,
                      transform 0.2s ease, color 0.2s ease,
                      box-shadow 0.25s ease;
          overflow: hidden;
        }
        .chip::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg,
            transparent 0%,
            rgba(157, 127, 224, 0.18) 45%,
            rgba(111, 200, 255, 0.18) 55%,
            transparent 100%);
          transform: translateX(-100%);
          transition: transform 0.7s ease;
        }
        .chip:hover {
          border-color: rgba(157, 127, 224, 0.65);
          background: rgba(28, 20, 55, 0.55);
          transform: translateY(-1px);
          color: #ffffff;
          box-shadow: 0 0 22px rgba(157, 127, 224, 0.18);
        }
        .chip:hover::before { transform: translateX(100%); }
        .chip .dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #9d7fe0;
          box-shadow: 0 0 10px #9d7fe0;
          animation: blink 2.4s ease-in-out infinite;
        }
        .chip .id {
          color: rgba(156, 140, 210, 0.8);
          font-size: 0.68rem;
          letter-spacing: 0.22em;
        }
        .chip .arrow { margin-left: auto; opacity: 0.7; }

        .ext-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'SF Mono', 'Menlo', monospace;
          font-size: 0.74rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #a8a3c8;
          padding: 0.4rem 0.7rem;
          border: 1px solid rgba(157, 127, 224, 0.18);
          border-radius: 3px;
          transition: all 0.2s ease;
          background: rgba(10, 8, 20, 0.35);
        }
        .ext-link:hover {
          color: #ffffff;
          border-color: rgba(157, 127, 224, 0.5);
          background: rgba(28, 20, 55, 0.5);
        }

        .scroll-hint {
          position: absolute;
          left: 50%;
          bottom: 2.5rem;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          color: rgba(176, 165, 220, 0.65);
          font-family: 'SF Mono', 'Menlo', monospace;
          font-size: 0.66rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
        }
        .scroll-hint .tube {
          width: 1px;
          height: 30px;
          background: linear-gradient(to bottom, rgba(157,127,224,0) 0%, rgba(157,127,224,0.5) 100%);
          position: relative;
          overflow: hidden;
        }
        .scroll-hint .tube::after {
          content: '';
          position: absolute;
          top: 0;
          left: -1px;
          width: 3px; height: 6px;
          background: #9d7fe0;
          box-shadow: 0 0 8px #9d7fe0;
          animation: scrollDot 2.2s ease-in-out infinite;
        }

        @media (max-width: 640px) {
          .hud-top-row { flex-direction: column !important; align-items: flex-start !important; gap: 0.4rem !important; }
          .hud-bottom { display: none !important; }
          .hero-name { letter-spacing: -0.02em !important; }
        }
      ` }} />

      {/* HUD top row */}
      <div
        className={`iso-fade iso-delay-1 ${mounted ? 'in' : ''}`}
        style={{
          position: 'fixed',
          top: '70px',
          left: '1.5rem',
          right: '1.5rem',
          zIndex: 3,
          pointerEvents: 'none',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <div className="mono hud-top-row" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.2rem',
          fontSize: '0.68rem',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'rgba(176, 165, 220, 0.7)',
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#6fc8ff',
              boxShadow: '0 0 8px #6fc8ff',
              animation: 'blink 2.4s ease-in-out infinite',
            }} />
            Node · 01
          </span>
          <span style={{ opacity: 0.5 }}>Obs · Milky&nbsp;Way · Sgr&nbsp;A★</span>
        </div>
        <div className="mono" style={{
          fontSize: '0.68rem',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'rgba(176, 165, 220, 0.7)',
        }}>
          {utc || '—'}
        </div>
      </div>

      {/* Hero content */}
      <div style={{
        position: 'relative',
        zIndex: 3,
        minHeight: 'calc(100vh - 52px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '6rem 1.5rem 8rem',
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        {/* designation label */}
        <div
          className={`mono iso-fade iso-delay-2 ${mounted ? 'in' : ''}`}
          style={{
            fontSize: '0.7rem',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: 'rgba(157, 127, 224, 0.8)',
            marginBottom: '1.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
          }}
        >
          <span style={{
            width: '36px',
            height: '1px',
            background: 'linear-gradient(to right, rgba(157,127,224,0), rgba(157,127,224,0.9))',
          }} />
          Designation · Human · 40.0° N
        </div>

        {/* name */}
        <h1
          className={`hero-name iso-fade iso-delay-3 ${mounted ? 'in' : ''}`}
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 'clamp(3.2rem, 11vw, 8rem)',
            fontWeight: 300,
            lineHeight: 0.98,
            letterSpacing: '-0.035em',
            margin: 0,
            marginBottom: '1.6rem',
          }}
        >
          <span className="name-gradient">Aki Bhabad</span>
        </h1>

        {/* tagline row */}
        <div
          className={`iso-fade iso-delay-3 ${mounted ? 'in' : ''}`}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
            marginBottom: '1rem',
            maxWidth: '620px',
          }}
        >
          <span style={{
            flexShrink: 0,
            marginTop: '0.65rem',
            width: '22px',
            height: '1px',
            background: 'rgba(157, 127, 224, 0.55)',
          }} />
          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(1rem, 1.35vw, 1.18rem)',
            lineHeight: 1.55,
            color: '#e7e3ff',
            margin: 0,
            fontStyle: 'italic',
          }}>
            Curious about startups, intelligence, the universe,<br />
            and how things work.
          </p>
        </div>

        <p
          className={`mono iso-fade iso-delay-4 ${mounted ? 'in' : ''}`}
          style={{
            fontSize: '0.78rem',
            color: 'rgba(176, 165, 220, 0.75)',
            letterSpacing: '0.04em',
            lineHeight: 1.8,
            marginBottom: '3rem',
            maxWidth: '520px',
            marginLeft: '34px',
          }}
        >
          // a home for writing, projects, and ideas i'm working through.
        </p>

        {/* section chips */}
        <div
          className={`iso-fade iso-delay-4 ${mounted ? 'in' : ''}`}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.8rem',
            marginLeft: '34px',
          }}
        >
          {sections.map(({ href, label, id }) => (
            <Link key={href} href={href} className="chip">
              <span className="dot" />
              <span className="id">{id}</span>
              <span>{label}</span>
              <span className="arrow">↗</span>
            </Link>
          ))}
        </div>

        {/* bottom: elsewhere */}
        <div
          className={`iso-fade iso-delay-5 ${mounted ? 'in' : ''}`}
          style={{
            marginTop: '3.5rem',
            marginLeft: '34px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '0.8rem',
          }}
        >
          <span className="mono" style={{
            fontSize: '0.66rem',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'rgba(157, 127, 224, 0.7)',
          }}>
            Transmit
          </span>
          {externalLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="ext-link"
              aria-label={`${label} profile`}
            >
              {label === 'X' ? (
                <>
                  <Image
                    src="/x-logo.svg"
                    alt="X"
                    width={12}
                    height={12}
                    style={{ width: '0.78rem', height: '0.78rem', display: 'block', filter: 'brightness(1.3)' }}
                  />
                  <span>X</span>
                </>
              ) : (
                <>
                  <LinkedInIcon />
                  <span>LinkedIn</span>
                </>
              )}
            </a>
          ))}
        </div>
      </div>

      {/* scroll hint */}
      <div
        className={`hud-bottom iso-fade iso-delay-5 ${mounted ? 'in' : ''}`}
        style={{ position: 'fixed', zIndex: 3, pointerEvents: 'none', inset: 0 }}
      >
        <div className="scroll-hint">
          <span>Observe</span>
          <div className="tube" />
        </div>
      </div>
    </>
  )
}
