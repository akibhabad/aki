import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import Nav from '@/components/Nav'

export const metadata: Metadata = {
  title: {
    default: 'Aki Bhabad',
    template: '%s — Aki Bhabad',
  },
  description: 'Writing, projects, and ideas.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Nav />
        <main style={{ flex: 1 }}>{children}</main>
        <footer style={{
          borderTop: '1px solid #1c1c26',
          padding: '2rem 1.5rem',
          textAlign: 'center',
          fontSize: '0.8rem',
          color: '#3a3a50',
          fontFamily: 'system-ui, sans-serif',
        }}>
          © {new Date().getFullYear()} Aki Bhabad
        </footer>
        <Analytics />
      </body>
    </html>
  )
}
