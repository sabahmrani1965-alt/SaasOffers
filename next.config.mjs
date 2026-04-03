/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  async redirects() {
    return [
      {
        source: '/aws-credit',
        destination: '/offers/aws-activate',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
