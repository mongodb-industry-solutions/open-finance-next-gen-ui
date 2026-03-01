/** @type {import('next').NextConfig} */
const nextConfig = {
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: `${process.env.CORE_BACKEND_URL || 'http://localhost:8003'}/api/v1/:path*`,
      },
      {
        source: '/api/chatbot/:path*',
        destination: `${process.env.CHATBOT_BACKEND_URL || 'http://localhost:8002'}/:path*`,
      },
    ];
  },
};

export default nextConfig;
