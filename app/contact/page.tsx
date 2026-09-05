import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Contact' }

export default function ContactPage() {
  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '7rem 1.5rem 6rem' }}>
      <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#f2f2f2', marginBottom: '1.5rem' }}>
        Contact
      </p>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', fontWeight: 'normal', color: '#ececec', marginBottom: '2rem' }}>
        Get in Touch
      </h1>
      <p style={{ fontFamily: 'Georgia, serif', fontSize: '0.9375rem', color: '#7a7a7a', lineHeight: 1.75 }}>
        Coming soon.
      </p>
    </div>
  )
}
