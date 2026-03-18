/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  async rewrites() {
    return [
      {
        source: '/astro',
        destination: '/astro-static/index.html',
      },
    ]
  },
}

export default nextConfig
