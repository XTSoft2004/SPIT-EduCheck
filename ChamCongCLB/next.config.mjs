/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'xtcoder2004.io.vn',
        port: '5000',
        pathname: '/extension/image/**',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        pathname: '/thumbnails/**',
      },
    ],
  },
}

export default nextConfig
