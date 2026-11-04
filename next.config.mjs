// Sicherheitsheader ohne statisches Script-CSP: middleware.ts erzeugt pro HTML-Antwort
// einen Nonce und entfernt damit script-src 'unsafe-inline'. style-src bleibt wegen der
// umfangreichen React-Inline-Styles separat erlaubt.

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Arena-Live-Preview und lokale Browserprüfungen dürfen in der Entwicklung
  // Next-HMR-Chunks laden; in Produktions-Builds hat diese Liste keine Wirkung.
  allowedDevOrigins: ["*.e2b.app", "127.0.0.1", "localhost"],
  // Banken werden im Browser per Fetch geladen; fs/path nur auf dem Server/in Node.
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { ...config.resolve.fallback, fs: false, path: false };
    }
    return config;
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "microphone=(self), camera=(), geolocation=()" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        ],
      },
    ];
  },
};

export default nextConfig;
