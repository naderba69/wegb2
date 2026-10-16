/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // R163: Banken werden im Browser per Fetch geladen; fs/path nur auf dem Server/in Node.
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { ...config.resolve.fallback, fs: false, path: false };
    }
    return config;
  },
};

export default nextConfig;
