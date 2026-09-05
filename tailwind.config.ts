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
        'cosmic-bg': '#080808',
        'cosmic-surface': '#111111',
        'cosmic-border': '#1f1f1f',
        'cosmic-text': '#ececec',
        'cosmic-muted': '#7a7a7a',
        'cosmic-purple': '#f2f2f2',
        'cosmic-purple-dim': '#9a9a9a',
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
            color: '#cfcfcf',
            a: {
              color: '#f2f2f2',
              '&:hover': {
                color: '#ffffff',
              },
            },
            h1: {
              color: '#ececec',
            },
            h2: {
              color: '#ececec',
            },
            h3: {
              color: '#ececec',
            },
            strong: {
              color: '#ececec',
            },
            blockquote: {
              borderLeftColor: '#f2f2f2',
              color: '#8f8f8f',
            },
            code: {
              color: '#ffffff',
            },
            hr: {
              borderColor: '#1f1f1f',
            },
          },
        },
      },
    },
  },
  plugins: [],
}

export default config
