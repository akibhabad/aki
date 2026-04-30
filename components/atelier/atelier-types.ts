export type NodeId = 'writing' | 'projects' | 'about' | 'contact'

export interface NodeConfig {
  id: NodeId
  name: string
  callsign: string
  position: [number, number, number]
  accent: 'cyan' | 'amber'
  blurb: string
  items: { title: string; meta?: string }[]
}

export const NODES: NodeConfig[] = [
  {
    id: 'writing',
    name: 'Writing',
    callsign: 'A-01 · Constellation',
    position: [-9, 1.2, 2],
    accent: 'cyan',
    blurb:
      'Essays and notes — long-form attempts to think clearly. Some land, some are still drifting.',
    items: [
      { title: 'On Wearables, Longevity, and the Body as Sensor', meta: 'Essay · 2025' },
      { title: 'What Curiosity Actually Is', meta: 'Note · in progress' },
    ],
  },
  {
    id: 'projects',
    name: 'Projects',
    callsign: 'A-02 · Ringed Planet',
    position: [8.5, -1.6, -2.5],
    accent: 'amber',
    blurb:
      'Things I have built or am building. Tools, experiments, products that began as questions.',
    items: [
      { title: 'Astrophotography Site', meta: 'Photo archive · live' },
      { title: 'Curiosities', meta: 'Open notebook · ongoing' },
    ],
  },
  {
    id: 'about',
    name: 'About',
    callsign: 'A-03 · Pulsar',
    position: [-3.2, 4.2, -8],
    accent: 'cyan',
    blurb:
      'Curious about startups, intelligence, the universe, and how things work. Currently in Chapel Hill, NC.',
    items: [
      { title: 'Studying CS at UNC', meta: 'Class of 2027' },
      { title: 'Background', meta: 'Building, writing, looking up' },
    ],
  },
  {
    id: 'contact',
    name: 'Contact',
    callsign: 'A-04 · Beacon',
    position: [4.5, -3.2, 7],
    accent: 'amber',
    blurb: 'Open signal. Reach out about ideas, collaboration, or anything worth thinking about.',
    items: [
      { title: 'bhabad@unc.edu', meta: 'Email · best route' },
      { title: '@_bhab on X', meta: 'Public broadcast' },
    ],
  },
]

export const ACCENTS = {
  cyan: '#6FE3FF',
  amber: '#FFB878',
} as const

export const ACCENTS_DIM = {
  cyan: '#3a8db0',
  amber: '#a07050',
} as const
