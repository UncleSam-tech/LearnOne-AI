LearnOne AI - PWA (Front-end)

Stack: Next.js (App Router) + TS + Tailwind + Zustand + idb + next-intl + Vitest.

Getting Started

```bash
npm install
npm run dev
```

Proxy or Mock

- Default: MockAdapter (offline/preview mode). A banner indicates this.
- To use a backend proxy, set `NEXT_PUBLIC_API_PROXY_URL` in `.env.local` and restart.

Security

- Strict CSP & Trusted Types via `next.config.ts`
- No API keys in client
- DOMPurify sanitization and lint rule forbidding `dangerouslySetInnerHTML`

PWA

- `public/sw.js` and `manifest.webmanifest`
- Offline shell and cache hygiene; proxy calls are network-only

Testing

- Vitest + Testing Library ready; `npm test`
