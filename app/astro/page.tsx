import type { Metadata } from 'next'
import AstroExperience from '@/components/astro/AstroExperience'

export const metadata: Metadata = {
  title: 'Astrophotography',
  description:
    'Deep-sky astrophotography by Aki Bhabad — nebulae, galaxies, and the Milky Way, captured from Connecticut, Cape Cod, and Mauna Kea.',
}

export default function AstroPage() {
  return <AstroExperience />
}
