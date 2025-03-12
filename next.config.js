/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'upload.wikimedia.org', // For the sample images we're using
      'picsum.photos', // For placeholder images
    ],
  },
};

module.exports = nextConfig; 