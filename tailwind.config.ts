import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.mdx',
  ],
  theme: {
    extend: {
      colors: {
        'cosmic-bg': '#0a0a0f',
        'cosmic-surface': '#111118',
        'cosmic-border': '#1e1e2e',
        'cosmic-text': '#e8e6f0',
        'cosmic-muted': '#6b6b8a',
        'cosmic-purple': '#8b5cf6',
        'cosmic-purple-dim': '#5b3d9e',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      maxWidth: {
        'article': '720px',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#d1cfe8',
            a: {
              color: '#8b5cf6',
              '&:hover': {
                color: '#a78bfa',
              },
            },
            h1: {
              color: '#e8e6f0',
            },
            h2: {
              color: '#e8e6f0',
            },
            h3: {
              color: '#e8e6f0',
            },
            strong: {
              color: '#e8e6f0',
            },
            blockquote: {
              borderLeftColor: '#8b5cf6',
              color: '#9d96c4',
            },
            code: {
              color: '#a78bfa',
            },
            hr: {
              borderColor: '#1e1e2e',
            },
          },
        },
      },
    },
  },
  plugins: [],
}

export default config
