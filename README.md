# Lumen Wallet Management — Public Sample

A friendly, public sample showing how to use the **Lumen Dev Wallet APIs** from an **organization's perspective**. You see your custodial wallets and the files associated with each one. No login screens, no crypto wallets in the browser — just your API key on the server.

> Built for two audiences: developers evaluating the Lumen platform, **and** non-coders who want to see it work without writing code. If you can install Node.js and edit a text file, you can run this in under 10 minutes.

**Tech stack:** Vite + React (JSX) + Tailwind v4 on the frontend, Express on the backend, one root `.env`, one `npm start`.

---

## Quickstart (8 steps)

1. **Install Node.js 20+** from [nodejs.org](https://nodejs.org). Pick the "LTS" version.
2. **Get your Lumen credentials** — see [docs/GET_CREDENTIALS.md](docs/GET_CREDENTIALS.md). You need an API key and an API secret.
3. **Download this repo.** Either click the green "Code" button on GitHub and choose "Download ZIP", or in a terminal run:
   ```
   git clone https://github.com/Bayanichain/wallet-management-sample-webapp.git
   cd wallet-management-sample-webapp
   ```
4. **Copy the example env file** to a real one:
   - Windows (PowerShell): `Copy-Item .env.example .env`
   - macOS / Linux: `cp .env.example .env`
5. **Open `.env`** in Notepad, TextEdit, or VS Code. Paste your real API key after `LUMEN_API_KEY=` and your secret after `LUMEN_API_SECRET=`. No quotes, no spaces.
6. **Install dependencies** (run once):
   ```
   npm install
   ```
7. **Start the app:**
   ```
   npm start
   ```
   Wait until you see two lines like `SRV ready on 8787` and `WEB Local: http://localhost:5173`.
8. **Open** [http://localhost:5173](http://localhost:5173) in Chrome. The wallets dashboard loads right away.

That's it.

---

## What you'll see

- A list of all custodial wallets belonging to your organization, with search, sort, and pagination.
- Click any wallet to see its details and the files associated with that wallet's address.

If your organization is brand new and has no wallets yet, the dashboard will say so. Create some wallets from the Lumen dashboard and refresh.

---

## How it works (in 30 seconds)

```
Your browser  ->  Local Express server  ->  Lumen Dev Wallet API
   :5173             :8787                   (Azure)
```

The Express server is a **thin proxy**. Its only job is to add your API key + secret to outgoing requests so those secrets never reach the browser. The React app calls the local Express server; the Express server calls Lumen.

Why the proxy? Putting your API key directly in frontend code is unsafe — anyone could copy it from the browser. By keeping it on the server, you stay safe even if you deploy this to the public internet.

More detail: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

---

## Docs

- [docs/SETUP.md](docs/SETUP.md) — installation walkthrough for first-timers (no command-line experience required).
- [docs/GET_CREDENTIALS.md](docs/GET_CREDENTIALS.md) — where to find your Lumen API key and secret.
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — what's in each folder and why.
- [docs/API_REFERENCE.md](docs/API_REFERENCE.md) — the 3 routes the local server exposes.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `port 8787 in use` | Change `SERVER_PORT` in `.env` to e.g. `8788` and run `npm start` again. |
| `LUMEN_API_KEY missing` | You haven't filled in `.env` yet. See SETUP step 5. |
| Wallets list is empty | Your org has no wallets. Create one in the Lumen dashboard. |
| 401 / 403 errors in the UI | Your API key or secret is wrong. Double-check `.env`, then restart with `npm start`. |
| CORS errors in browser console | You changed the Vite port without updating `ALLOWED_ORIGIN` in `.env`. Set them to match. |

---

## License

MIT — see [LICENSE](LICENSE).
