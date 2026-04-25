import type { Metadata } from 'next'
import HeroInterstellar from '@/components/HeroInterstellar'

export const metadata: Metadata = {
  title: 'Aki Bhabad',
}

export default function HomePage() {
  return <HeroInterstellar />
}
