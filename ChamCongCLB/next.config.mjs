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
        pathname: '/extension/image',
      },
    ],
  },
}

export default nextConfig
