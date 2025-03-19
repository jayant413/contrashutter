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
      {
        protocol: "https",
        hostname: "contrashutter-backend.onrender.com", // Added new domain
      },
    ], // Allow images from localhost, github.com, images.unsplash.com, and contrashutter-backend.onrender.com
    minimumCacheTTL: 0,
  },
};

module.exports = nextConfig;
