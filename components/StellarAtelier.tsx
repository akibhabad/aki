'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { NODES, ACCENTS, NodeId, NodeConfig } from './atelier/atelier-types'

// Lazy-load the heavy 3D scene so the loader and overlay paint first.
const AtelierScene = dynamic(() => import('./atelier/AtelierScene'), {
  ssr: false,
})

/* ─────────────────────────────────────────────────────────────
   Loader
   ───────────────────────────────────────────────────────────── */
function Loader({ visible }: { visible: boolean }) {
  return (
    <div
      aria-hidden={!visible}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background: 'radial-gradient(ellipse at center, #0a0e22 0%, #05050a 70%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1.4rem',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.8s ease',
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          border: '1px solid rgba(111, 227, 255, 0.25)',
          borderTopColor: '#6FE3FF',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <div
        style={{
          fontFamily: '"SF Mono","Menlo",monospace',
          fontSize: '0.72rem',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          color: 'rgba(111, 227, 255, 0.8)',
        }}
      >
        Calibrating telescope
      </div>
      <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Active node content panel
   ───────────────────────────────────────────────────────────── */
function ContentPanel({
  node,
  onClose,
}: {
  node: NodeConfig
  onClose: () => void
}) {
  const accent = ACCENTS[node.accent]
  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 30,
        right: 'clamp(1rem, 4vw, 3rem)',
        top: '50%',
        transform: 'translateY(-50%)',
        width: 'min(420px, calc(100vw - 2rem))',
        padding: '1.8rem 1.6rem',
        background: 'rgba(8, 10, 24, 0.72)',
        border: `1px solid ${accent}40`,
        borderRadius: 4,
        backdropFilter: 'blur(14px) saturate(140%)',
        WebkitBackdropFilter: 'blur(14px) saturate(140%)',
        boxShadow: `0 0 40px ${accent}22, inset 0 0 24px rgba(0,0,0,0.4)`,
        animation: 'panelIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        opacity: 0,
      }}
    >
      <div
        style={{
          fontFamily: '"SF Mono","Menlo",monospace',
          fontSize: '0.66rem',
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: accent,
          marginBottom: '0.8rem',
          opacity: 0.85,
        }}
      >
        {node.callsign}
      </div>
      <h2
        style={{
          fontFamily: 'Georgia, serif',
          fontSize: '2rem',
          fontWeight: 300,
          color: '#ffffff',
          letterSpacing: '-0.01em',
          margin: 0,
          marginBottom: '1rem',
          textShadow: `0 0 24px ${accent}55`,
        }}
      >
        {node.name}
      </h2>
      <p
        style={{
          fontFamily: 'Georgia, serif',
          fontSize: '0.95rem',
          color: '#d3cfeb',
          lineHeight: 1.65,
          margin: 0,
          marginBottom: '1.5rem',
          fontStyle: 'italic',
        }}
      >
        {node.blurb}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {node.items.map((it, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.2rem',
              padding: '0.7rem 0.85rem',
              background: 'rgba(255,255,255,0.025)',
              border: `1px solid ${accent}1f`,
              borderRadius: 3,
              transition: 'background 0.2s ease, border-color 0.2s ease',
              cursor: 'default',
            }}
          >
            <div
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: '0.95rem',
                color: '#f4f1ff',
              }}
            >
              {it.title}
            </div>
            {it.meta && (
              <div
                style={{
                  fontFamily: '"SF Mono","Menlo",monospace',
                  fontSize: '0.66rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(176, 165, 220, 0.65)',
                }}
              >
                {it.meta}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={onClose}
        style={{
          marginTop: '1.6rem',
          padding: '0.55rem 0.9rem',
          background: 'transparent',
          border: `1px solid ${accent}55`,
          borderRadius: 3,
          color: accent,
          fontFamily: '"SF Mono","Menlo",monospace',
          fontSize: '0.7rem',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          transition: 'background 0.18s ease, color 0.18s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = `${accent}18`
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
        }}
      >
        ← Return to space
      </button>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes panelIn {
          from { opacity: 0; transform: translateY(calc(-50% + 14px)); }
          to   { opacity: 1; transform: translateY(-50%); }
        }
      `}} />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Persistent HUD: title, hints, node list
   ───────────────────────────────────────────────────────────── */
function HUD({
  activeId,
  setActiveId,
}: {
  activeId: NodeId | null
  setActiveId: (id: NodeId | null) => void
}) {
  return (
    <>
      {/* Top-left identity block */}
      <div
        style={{
          position: 'fixed',
          top: 'calc(52px + 1.2rem)',
          left: '1.5rem',
          zIndex: 20,
          pointerEvents: 'none',
          opacity: activeId ? 0.35 : 1,
          transition: 'opacity 0.4s ease',
        }}
      >
        <div
          style={{
            fontFamily: '"SF Mono","Menlo",monospace',
            fontSize: '0.66rem',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'rgba(111, 227, 255, 0.7)',
            marginBottom: '0.6rem',
          }}
        >
          Stellar Atelier · v0.2 · Live
        </div>
        <h1
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
            fontWeight: 300,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            margin: 0,
            lineHeight: 1.05,
            textShadow: '0 0 30px rgba(111, 227, 255, 0.2)',
          }}
        >
          Aki Bhabad
        </h1>
        <p
          style={{
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            fontSize: '1rem',
            color: 'rgba(211, 207, 235, 0.75)',
            marginTop: '0.4rem',
            maxWidth: '380px',
            lineHeight: 1.5,
          }}
        >
          Curious about startups, intelligence, the universe,
          and how things work.
        </p>
      </div>

      {/* Bottom-left controls / hints */}
      <div
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          left: '1.5rem',
          zIndex: 20,
          pointerEvents: 'none',
          fontFamily: '"SF Mono","Menlo",monospace',
          fontSize: '0.66rem',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'rgba(176, 195, 220, 0.55)',
          display: 'flex',
          gap: '1.2rem',
          flexWrap: 'wrap',
          opacity: activeId ? 0 : 1,
          transition: 'opacity 0.4s ease',
        }}
      >
        <span>
          <span style={{ color: '#6FE3FF' }}>◇</span> drag to look
        </span>
        <span>
          <span style={{ color: '#6FE3FF' }}>◇</span> scroll to zoom
        </span>
        <span>
          <span style={{ color: '#6FE3FF' }}>◇</span> click an object
        </span>
      </div>

      {/* Bottom-right node index */}
      <div
        style={{
          position: 'fixed',
          right: '1.5rem',
          bottom: '1.5rem',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '0.4rem',
          opacity: activeId ? 0 : 1,
          pointerEvents: activeId ? 'none' : 'auto',
          transition: 'opacity 0.4s ease',
        }}
      >
        <div
          style={{
            fontFamily: '"SF Mono","Menlo",monospace',
            fontSize: '0.62rem',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'rgba(176, 195, 220, 0.5)',
            marginBottom: '0.4rem',
          }}
        >
          Destinations
        </div>
        {NODES.map((n) => {
          const accent = ACCENTS[n.accent]
          return (
            <button
              key={n.id}
              onClick={() => setActiveId(n.id)}
              style={{
                background: 'rgba(8, 10, 24, 0.55)',
                border: `1px solid ${accent}33`,
                color: accent,
                padding: '0.45rem 0.8rem',
                borderRadius: 2,
                fontFamily: '"SF Mono","Menlo",monospace',
                fontSize: '0.7rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                transition: 'background 0.2s ease, border-color 0.2s ease, transform 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${accent}1c`
                e.currentTarget.style.borderColor = `${accent}88`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(8, 10, 24, 0.55)'
                e.currentTarget.style.borderColor = `${accent}33`
              }}
            >
              <span style={{ opacity: 0.55 }}>{n.callsign.split(' ')[0]}</span>
              <span style={{ color: '#fff' }}>{n.name}</span>
              <span>↗</span>
            </button>
          )
        })}
      </div>
    </>
  )
}

/* ─────────────────────────────────────────────────────────────
   Reduced-motion fallback (static)
   ───────────────────────────────────────────────────────────── */
function StaticFallback() {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - 52px)',
        background:
          'radial-gradient(ellipse at 20% 30%, #14203a 0%, #050714 60%), radial-gradient(ellipse at 80% 70%, #2a1240 0%, transparent 50%)',
        backgroundColor: '#050714',
        padding: '8rem 1.5rem 4rem',
        maxWidth: '720px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          fontFamily: '"SF Mono","Menlo",monospace',
          fontSize: '0.7rem',
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: '#6FE3FF',
          marginBottom: '1.2rem',
        }}
      >
        Stellar Atelier · static mode
      </div>
      <h1
        style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(2.5rem, 7vw, 4rem)',
          fontWeight: 300,
          color: '#ffffff',
          margin: 0,
          letterSpacing: '-0.02em',
        }}
      >
        Aki Bhabad
      </h1>
      <p
        style={{
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic',
          color: '#d3cfeb',
          marginTop: '1rem',
          marginBottom: '3rem',
          fontSize: '1.05rem',
          lineHeight: 1.5,
        }}
      >
        Curious about startups, intelligence, the universe, and how things work.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {NODES.map((n) => {
          const accent = ACCENTS[n.accent]
          return (
            <div
              key={n.id}
              style={{
                padding: '1rem 1.1rem',
                border: `1px solid ${accent}33`,
                borderRadius: 3,
                background: 'rgba(8, 10, 24, 0.5)',
              }}
            >
              <div
                style={{
                  fontFamily: '"SF Mono","Menlo",monospace',
                  fontSize: '0.66rem',
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: accent,
                  marginBottom: '0.4rem',
                }}
              >
                {n.callsign}
              </div>
              <div
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '1.3rem',
                  color: '#fff',
                  marginBottom: '0.4rem',
                }}
              >
                {n.name}
              </div>
              <div
                style={{
                  fontFamily: 'Georgia, serif',
                  color: '#a8a3c8',
                  fontSize: '0.9rem',
                  fontStyle: 'italic',
                  lineHeight: 1.5,
                }}
              >
                {n.blurb}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   StellarAtelier (default export)
   ───────────────────────────────────────────────────────────── */
export default function StellarAtelier() {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [sceneReady, setSceneReady] = useState(false)
  const [activeId, setActiveId] = useState<NodeId | null>(null)
  const [arrived, setArrived] = useState(false)

  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(m.matches)
    const onChange = () => setReducedMotion(m.matches)
    m.addEventListener?.('change', onChange)
    setIsMobile(window.innerWidth < 768 || /android|iphone|ipad|ipod/i.test(navigator.userAgent))
    return () => m.removeEventListener?.('change', onChange)
  }, [])

  // Show content panel after the camera has had time to fly in.
  useEffect(() => {
    setArrived(false)
    if (!activeId) return
    const id = setTimeout(() => setArrived(true), 1100)
    return () => clearTimeout(id)
  }, [activeId])

  // Esc closes active panel
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeId) setActiveId(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeId])

  if (reducedMotion) {
    return <StaticFallback />
  }

  const activeNode = activeId ? NODES.find((n) => n.id === activeId) ?? null : null

  return (
    <>
      <Loader visible={!sceneReady} />
      <AtelierScene
        activeId={activeId}
        setActiveId={setActiveId}
        setSceneReady={setSceneReady}
        onArrived={() => setArrived(true)}
        isMobile={isMobile}
      />
      <HUD activeId={activeId} setActiveId={setActiveId} />
      {activeNode && arrived && (
        <ContentPanel node={activeNode} onClose={() => setActiveId(null)} />
      )}
      {/* spacer so footer doesn't sit on top of the canvas */}
      <div style={{ height: 'calc(100vh - 52px)' }} />
    </>
  )
}
