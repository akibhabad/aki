import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Astro' }

export default function AstroPage() {
  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '7rem 1.5rem 6rem' }}>
      <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7c5cbf', marginBottom: '1.5rem' }}>
        Astro
      </p>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', fontWeight: 'normal', color: '#dddae8', marginBottom: '2rem' }}>
        The Universe
      </h1>
      <p style={{ fontFamily: 'Georgia, serif', fontSize: '0.9375rem', color: '#5e5e78', lineHeight: 1.75 }}>
        Coming soon.
      </p>
    </div>
  )
}
