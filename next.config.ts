import type { NextConfig } from "next";

const proxy = process.env.NEXT_PUBLIC_API_PROXY_URL;
const connectSrc = ["'self'"];
if (proxy) {
  try {
    const u = new URL(proxy);
    connectSrc.push(u.origin);
  } catch {}
}

const csp = [
  "default-src 'self'",
  "script-src 'self' https://cdn.jsdelivr.net https://unpkg.com",
  "style-src 'self' https://cdn.jsdelivr.net https://unpkg.com",
  "img-src 'self' data:",
  "font-src 'self' https://cdn.jsdelivr.net",
  `connect-src ${connectSrc.join(' ')}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "Content-Security-Policy", value: csp },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "same-origin" },
        { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
        { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
        { key: "Origin-Agent-Cluster", value: "?1" },
        { key: "Report-To", value: "{\"group\":\"csp-endpoint\",\"max_age\":10886400}" },
        { key: "Require-Trusted-Types-For", value: "'script'" },
        { key: "Trusted-Types", value: "learnone#html" },
      ],
    },
  ],
};

export default nextConfig;
