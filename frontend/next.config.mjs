/** @type {import('next').NextConfig} */
const nextConfig = {
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: `${process.env.CORE_BACKEND_URL || 'http://localhost:8003'}/api/v1/:path*`,
      },
      // Chatbot proxy moved to app/api/chatbot/[...path]/route.js
      // Next.js rewrites buffer SSE responses; Route Handlers stream natively.
    ];
  },
};

export default nextConfig;
