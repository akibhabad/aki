'use client'

import dynamic from 'next/dynamic'

const Galaxy = dynamic(() => import('./Galaxy'), { ssr: false })

export default function GalaxyLazy({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <Galaxy className={className} style={style} />
}
