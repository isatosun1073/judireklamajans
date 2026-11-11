import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // three.js ekosistemi ESM paketlerini transpile et
  transpilePackages: ['three'],
}

export default nextConfig
