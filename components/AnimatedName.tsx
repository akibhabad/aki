'use client'

import { useEffect, useState } from 'react'

export default function AnimatedName() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <style>{`
        @keyframes nameIn {
          0%   { opacity: 0; filter: blur(6px); transform: translateY(6px); }
          100% { opacity: 1; filter: blur(0px); transform: translateY(0px); }
        }
        @keyframes subtleFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-3px); }
        }
        .name-word {
          display: inline-block;
          opacity: 0;
        }
        .name-word.visible {
          animation: nameIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards,
                     subtleFloat 6s ease-in-out 1s infinite;
        }
        .name-word:nth-child(2).visible {
          animation-delay: 0.18s, 1.18s;
        }
      `}</style>

      <h1 style={{
        fontFamily: 'Georgia, serif',
        fontSize: 'clamp(2rem, 6vw, 3.25rem)',
        fontWeight: 'normal',
        color: '#dddae8',
        marginBottom: '1.5rem',
        letterSpacing: '-0.02em',
        lineHeight: 1.1,
      }}>
        <span className={`name-word${visible ? ' visible' : ''}`}>Aki</span>
        {' '}
        <span className={`name-word${visible ? ' visible' : ''}`} style={{ color: '#9d7fe0' }}>Bhabad</span>
      </h1>
    </>
  )
}
