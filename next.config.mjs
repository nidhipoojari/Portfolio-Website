/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // We use simple <img> tags for max simplicity; this just disables the
    // built-in image optimizer warning if you swap to next/image later.
    unoptimized: true,
  },
};

export default nextConfig;
