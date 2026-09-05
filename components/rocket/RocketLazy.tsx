'use client'

import dynamic from 'next/dynamic'

const Rocket = dynamic(() => import('./Rocket'), { ssr: false })

export default function RocketLazy({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <Rocket className={className} style={style} />
}
