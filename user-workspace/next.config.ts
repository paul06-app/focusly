import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: '/focusly',
  assetPrefix: '/focusly/',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/photos/**',
      },
    ],
  },
}

export default nextConfig
