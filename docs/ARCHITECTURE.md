# Architecture

<p align="center">
  <img src="images/lumen-logo.svg" alt="Lumen" width="100" />
</p>

This page explains how the sample app is put together and why each piece exists. You don't need to read this to use the app — but if you're curious how it works, or you want to extend it, this is the tour.

---

## The picture

```
+--------------------+       +----------------------+       +-----------------------+
|  Browser (5173)    |  -->  |  Express BFF (8787)  |  -->  |  Lumen Wallet API     |
|  Vite + React JSX  |       |  thin proxy          |       |  (Azure Container App)|
|  Tailwind 4        |       |  + helmet + CORS     |       |                       |
|                    |       |  + rate limit        |       |  4 wallet endpoints   |
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

There are three layers, left to right:

1. **The browser part** (the React app at `http://localhost:5173`). This is what you see and click on.
2. **The local Express server** at `http://localhost:8787`. A small program running on your computer that acts as a middleman.
3. **The Lumen Wallet API** out on the internet (hosted in Azure). The real source of wallet data.

Both halves of the app read from a single `.env` settings file at the project root.

> **Note:** **BFF** stands for "Backend For Frontend" — a small backend server dedicated to one specific frontend. It's the polite term for "tiny middleman server".

---

## Why is there a backend server at all?

The short answer: **to keep your API secret hidden.**

Here's the long version. Vite and React projects bundle their settings (anything starting with `VITE_`) directly into the JavaScript file that gets sent to every browser. That means if we put `LUMEN_API_SECRET=...` into a `VITE_` variable, anyone visiting the site could open their browser's developer tools (F12) and copy your secret right out of the JavaScript code.

The Express server side-steps that completely. It stays on **your** machine (or, if you deploy it later, on your hosting provider's server). It holds the secret. When the React app asks for wallet data, it asks the Express server. The Express server then asks Lumen — with the secret attached. Lumen replies. The Express server hands the reply back to the React app.

The browser never sees the secret. Even if someone inspects every byte of the JavaScript that runs in your browser, the secret isn't there.

---

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
│           └── wallets.routes.js the 4 proxied wallet routes
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

In plain English: there are two main folders. `server/` holds the middleman server. `web/` holds the website (React) part. The `.env` file at the very top is shared by both.

---

## The 4 routes

The Express server exposes exactly the same paths Lumen does, just with `/api` stuck on the front. This makes the proxy easy to follow: if you see `/api/wallets/Custodial` in the React code, it maps to Lumen's `/wallets/Custodial`.

The full reference is in [API_REFERENCE.md](API_REFERENCE.md).

---

## Security choices

Each row below is a possible attack or mistake, and what we did to block it.

| Concern | Mitigation |
|---|---|
| Secret leakage | The API key and secret live in `.env` (which is in `.gitignore`, so it never goes to Git) and only on the server. The browser-side `VITE_*` variables are intentionally limited to the BFF URL — nothing sensitive. |
| Cross-origin attacks | CORS (Cross-Origin Resource Sharing) is a browser rule limiting which websites can call your server. We use an allowlist driven by `ALLOWED_ORIGIN`. Only `GET` methods are allowed on `/api`. |
| Header injection | We use Helmet (a security middleware) to set a strict Content Security Policy with an explicit `connect-src` allowlist — so the browser refuses to load resources from unexpected places. |
| Abuse / runaway scripts | `express-rate-limit` caps `/api/*` at 100 requests per 15 minutes per IP address. If something starts hammering the server, it gets a `429 Too Many Requests` response. |
| Query parameter fuzzing | Zod (a validation library) checks every incoming query parameter — `pageNumber`, `pageSize`, `sort[0][field]` — against an allowlist before forwarding the request to Lumen. Junk values get rejected early. |
| Error leakage | Errors from Lumen are normalized into a clean `{ ok, status, error }` shape. Stack traces (which can reveal internal details) never reach the browser. |

> **Heads up:** These mitigations are good for a local sample and small deployments. For real production traffic, see "Deploying this" below.

---

## Why we don't use the real Lumen design system here

Lumen has a full design system package called `@bayanichain/lumen-design-system`. We deliberately do **not** depend on it in this sample, because that package lives on GitHub Package Registry — meaning every public user would have to set up an `.npmrc` file with an authentication token before `npm install` would work. That would completely break the "anyone can run this in ten minutes" promise of this sample.

Instead, we mirror the four core Lumen design principles directly in plain Tailwind v4:

- **Flat and sharp** — no rounded corners (`border-radius: 0` everywhere, except the loading spinner ring which needs a circle).
- **Monochrome** — black, white, and gray only. The only color exceptions are `#ef4444` for errors and `#22c55e` for success.
- **Typographic** — the Sora font, with tight letter spacing (`tracking: -0.04em`).
- **Minimal** — no shadows, no gradients, 1-pixel solid borders only.

If you're building your own internal app and want to use the real design system, look at how `mvp-baas-org-webapp` wires it up.

---

## What's intentionally NOT here

This sample is deliberately small. We left things out for clarity:

- **No BridgePass or end-user login.** This sample shows the *organization's* view. The organization's API key is the only credential the app needs.
- **No file upload.** Uploading files (`POST /user/files`) requires the end-user flow with a logged-in BridgePass user — that's out of scope here.
- **No write operations.** The sample is read-only by design. It's for browsing wallets you already have, not creating or modifying them.
- **No database, no auth, no sessions.** The Express server holds zero state. Restart it any time without losing anything.

---

## Deploying this

The local-only flow works as-is. If you want to put this sample on the public internet, here's the short version:

1. **Frontend** — deploy to Vercel or Netlify (both free tiers). Set the environment variable `VITE_BFF_URL` to your backend's public URL.
2. **Backend** — deploy to Render, Railway, or Azure Container Apps. Set `LUMEN_API_KEY`, `LUMEN_API_SECRET`, and `ALLOWED_ORIGIN` (= your frontend's public URL).
3. **CORS update** — make sure `ALLOWED_ORIGIN` matches the deployed frontend URL exactly. Update the Helmet CSP `connect-src` allowlist if it's pointing at a new host.

> **Tip:** For a true production deployment, you'd also want centralized logging, distributed rate limiting (backed by Redis instead of in-memory), and TLS (HTTPS) at both hops. Those upgrades are out of scope for this sample but are well-trodden paths if you want them.
