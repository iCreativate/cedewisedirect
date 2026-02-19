/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
  async rewrites() {
    return [
      // Serve logo as favicon so /favicon.ico does not 404
      { source: "/favicon.ico", destination: "/logo.svg" },
    ];
  },
};

export default nextConfig;

