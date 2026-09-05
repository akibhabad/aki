import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Library' }

export default function LibraryPage() {
  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '7rem 1.5rem 6rem' }}>
      <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#f2f2f2', marginBottom: '1.5rem' }}>
        Library
      </p>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', fontWeight: 'normal', color: '#ececec', marginBottom: '2rem' }}>
        Books &amp; Papers
      </h1>
      <p style={{ fontFamily: 'Georgia, serif', fontSize: '0.9375rem', color: '#7a7a7a', lineHeight: 1.75 }}>
        This archive is still being built.
      </p>
    </div>
  )
}
