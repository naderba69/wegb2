// 🛡️ R305/ب16: رؤوس أمان أساسية — دفاع إضافي لا إصلاح عطل قائم. المفتاح وعنوانه
// (BYOK) يبقيان بتصميمهما الحالي (المستخدم يختار مزوّده بحرية)، فـconnect-src يسمح
// بأي https: بدل حصره بمزوّدَين فقط حتى لا يكسر مزوّدًا مخصّصًا يضيفه المستخدم.
// لا frame-ancestors/X-Frame-Options هنا عمداً: قد يمنعان عرض المعاينة الحيّة بإطار.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "media-src 'self'",
  "connect-src 'self' https:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

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
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: CSP },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "microphone=(self), camera=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
