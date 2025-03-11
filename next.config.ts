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
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Added Unsplash hostname
      },
    ], // Allow images from localhost, github.com, and images.unsplash.com
  },
};

module.exports = nextConfig;
