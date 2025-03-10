/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
    ], // Allow images from localhost and github.com
  },
};

module.exports = nextConfig;
