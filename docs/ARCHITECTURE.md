# Architecture

## The picture

```
+--------------------+       +----------------------+       +-----------------------+
|  Browser (5173)    |  -->  |  Express BFF (8787)  |  -->  |  Lumen Wallet API     |
|  Vite + React JSX  |       |  thin proxy          |       |  (Azure Container App)|
|  Tailwind 4        |       |  + helmet + CORS     |       |                       |
|                    |       |  + rate limit        |       |  3 wallet endpoints   |
|  no auth, no token |       |  + Zod query check   |       |  (Custodial)          |
|                    |       |  injects:            |       |                       |
|                    |       |   lumen-api-key      |       |                       |
|                    |       |   lumen-api-secret   |       |                       |
+--------------------+       +----------------------+       +-----------------------+
        ^                              ^
        |                              |
        +----- single root .env -------+
              (server vars + VITE_*)
```

## Why a backend at all?

Vite/React's `VITE_*` env vars are baked into the JavaScript bundle and sent to every browser. If we put `LUMEN_API_SECRET` there, anyone visiting the site could open DevTools and copy it.

The Express server stays on **your** machine (or your hosting provider). It holds the secret, attaches it to outbound requests to Lumen, and returns the response to the React app. The browser only ever talks to the Express server, never directly to Lumen.

## Folder map

```
/                          single root .env, package.json with workspaces
├── server/                Express BFF
│   ├── package.json
│   └── src/
│       ├── index.js              Express bootstrap, security middleware, route mounting
│       ├── lumenClient.js        axios instance with the api-key+secret interceptor
│       ├── middleware/
│       │   ├── envCheck.js       fails fast if .env is missing or unfilled
│       │   ├── errorHandler.js   converts upstream Lumen errors into { ok:false, status, error }
│       │   └── validateQuery.js  Zod query schema for pagination/search/sort
│       └── routes/
│           └── wallets.routes.js the 3 proxied wallet routes
└── web/                   Vite + React
    ├── vite.config.js     envDir set to '..' so it reads root .env
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    └── src/
        ├── main.jsx              React entry
        ├── App.jsx               router only
        ├── index.css             Tailwind + Lumen design tokens
        ├── api/client.js         axios pointed at the local BFF
        ├── components/           Header, Layout, Spinner, ErrorBanner, Pagination, SearchSortBar, EmptyState
        └── pages/                Wallets, WalletDetail, NotFound
```

## The 3 routes

The Express server exposes exactly the same paths Lumen does, prefixed with `/api`. This makes the proxy easy to reason about: if you see `/api/wallets/Custodial`, it's hitting Lumen's `/wallets/Custodial`.

See [API_REFERENCE.md](API_REFERENCE.md) for details.

## Security choices

| Concern | Mitigation |
|---|---|
| Secret leakage | API key/secret live in `.env` (gitignored) and only on the server. `VITE_*` vars are intentionally limited to the BFF URL. |
| Cross-origin attacks | CORS allowlist via `ALLOWED_ORIGIN`. Only GET methods allowed on `/api`. |
| Header injection | Helmet sets a strict Content Security Policy with explicit `connect-src` allowlist. |
| Abuse / runaway scripts | `express-rate-limit` caps `/api/*` to 100 req / 15 min per IP. |
| Query parameter fuzzing | Zod schemas validate `pageNumber`, `pageSize`, `sort[0][field]` against an allowlist before forwarding. |
| Error leakage | Upstream errors are normalized; stack traces never reach the browser. |

## Design system choice

Lumen has a real design system at `@bayanichain/lumen-design-system`. We **don't** depend on it here because that package lives on GitHub Package Registry and would force every public user to configure `.npmrc` auth — which kills the "boomer-friendly" promise.

Instead, the sample mirrors the four Lumen design principles directly in Tailwind v4:
- **Flat / Sharp** — no rounded corners (border-radius: 0 everywhere except the loading spinner ring)
- **Monochrome** — black/white/gray only; the only color exceptions are `#ef4444` for errors and `#22c55e` for success
- **Typographic** — Sora font with tight tracking (-0.04em)
- **Minimal** — no shadows, no gradients, 1px solid borders

If you want to use the real design system in your own project, see how `mvp-baas-org-webapp` wires it up.

## What's intentionally NOT here

- **No BridgePass / end-user login.** This sample is the *organization* view. The org's own API key is the only credential needed.
- **No file upload.** Out of scope per the locked plan — `POST /user/files` requires the end-user flow.
- **No write operations.** The sample is read-only by design — it's for browsing the wallets you already have.
- **No database, no auth, no sessions.** The Express server holds zero state.

## Deploying this

The local-only flow works as-is. To put this on the public internet:
1. Frontend → Vercel or Netlify (free). Set `VITE_BFF_URL` to your backend URL.
2. Backend → Render, Railway, or Azure Container Apps. Set `LUMEN_API_KEY`, `LUMEN_API_SECRET`, `ALLOWED_ORIGIN` (= your frontend URL).
3. Update `ALLOWED_ORIGIN` to the deployed frontend URL. Update the Helmet CSP `connect-src` if needed.

For a true production deployment, you'd also want logging, distributed rate limiting (Redis-backed), and TLS at both hops — those are out of scope for the sample.
