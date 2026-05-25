# Lumen Wallet Management â€” Public Sample

<p align="center">
  <img src="docs/images/lumen-logo.svg" alt="Lumen" width="120" />
</p>

This is a small, friendly example application that shows the wallets your organization owns inside the **Lumen** platform. You do **not** need to know how to code to run it. If you can install a program from a website and edit a text file, you can have this working on your computer in about ten minutes.

> **What this is for:** Two kinds of people. (1) Developers who want to see how the Lumen Dev Wallet APIs (the online services that hand out wallet data) work. (2) Non-coders who want to look at their wallets without writing any code themselves.

**What's under the hood (don't worry if these words mean nothing):** Vite + React (the part you see in the browser), Tailwind v4 (the visual styling), Express (a tiny server that runs on your own computer), one settings file called `.env`, and one command to start everything: `npm start`.

---

## Quickstart â€” 8 steps from zero to running

Follow these in order. Each step is small.

### Step 1 â€” Install Node.js

Node.js is the program that runs the code in this sample. Go to [nodejs.org](https://nodejs.org) and download the version labeled **"LTS"** (it stands for "Long-Term Support" â€” the stable one most people use). Run the installer. Click "Next" through every screen.

> **What you should see:** When the installer finishes, you can close it. Nothing visible happens on your screen â€” Node.js is a background tool, not an app with an icon.

### Step 2 â€” Get your Lumen credentials

You need two secret values from Lumen: an **API key** (a public-ish ID that says "this is my organization") and an **API secret** (a password that proves it). The full walkthrough is in [docs/GET_CREDENTIALS.md](docs/GET_CREDENTIALS.md).

> **Tip:** Keep both values in a safe place. The secret is usually only shown once.

### Step 3 â€” Download this project

The easiest way: on the project's GitHub page, click the green **"Code"** button, then **"Download ZIP"**. Unzip the file into a folder you can find later (your Documents folder is fine).

If you happen to already use Git (a tool programmers use to download code), you can instead open a terminal (the black-or-white window where you type commands) and run:

```
git clone https://github.com/Lumen-Suite/wallet-management-sample-webapp.git
cd wallet-management-sample-webapp
```

> **What you should see:** A new folder called `wallet-management-sample-webapp` somewhere on your computer.

### Step 4 â€” Make a copy of the settings file

The project comes with a template settings file named `.env.example`. You need to make a real copy of it called `.env` (just `.env`, no `.example`).

Open a terminal inside the project folder. Then run the command for your computer:

| Your computer | What to type |
|---|---|
| Windows (PowerShell) | `Copy-Item .env.example .env` |
| macOS or Linux | `cp .env.example .env` |

> **What you should see:** A new file called `.env` appears in the folder.

### Step 5 â€” Fill in your secrets

Open the new `.env` file in any text editor â€” Notepad on Windows, TextEdit on macOS, or VS Code if you have it. You'll see lines like `LUMEN_API_KEY=...` and `LUMEN_API_SECRET=...`. Replace the placeholder text after the `=` sign with the real values you got in Step 2.

> **Heads up:** No quotes. No spaces around the `=` sign. The line should look like `LUMEN_API_KEY=abc123-def456` and nothing else.

### Step 6 â€” Download the project's libraries

The app needs a bunch of small helper packages (libraries). Ask Node to download them by typing this in the terminal:

```
npm install
```

> **What you should see:** A lot of text scrolling. It takes one to two minutes the first time. When it stops, you'll be back at the normal terminal prompt with no red error messages.

### Step 7 â€” Start the app

Now turn on the app:

```
npm start
```

> **What you should see:** Two important lines, somewhere in the colored output:
>
> - `SRV ready on 8787` (your local server is running)
> - `WEB Local: http://localhost:5173` (the website part is ready)
>
> If you see both, the app is alive.

### Step 8 â€” Open the dashboard in your browser

Open Chrome (or any browser) and go to:

[http://localhost:5173](http://localhost:5173)

The wallets dashboard appears immediately. That's it â€” you're done.

---

## What you'll see

A list of every **custodial wallet** (a wallet the platform holds on behalf of a user) belonging to your organization. You can search, sort, and flip through pages. Click any wallet to see its details, then switch between two tabs:

- **Files** â€” documents, certificates, and other digital assets attached to that wallet's address.
- **Transactions** â€” the wallet's on-chain transaction history (everything it has sent or received).

> **If your dashboard says "No wallets":** That means your organization hasn't created any wallets yet. That's normal for a brand-new account. Create one in the Lumen dashboard and refresh this page.

---

## How it works (30-second version)

```
Your browser  ->  Local Express server  ->  Lumen Dev Wallet API
   :5173             :8787                   (Azure cloud)
```

The **Express server** is a tiny program running on your own computer. Its only job is to attach your API key and secret to outgoing requests before sending them to Lumen, so those secrets never end up in the browser where someone could steal them.

The React app in your browser only ever talks to the local Express server. The Express server then talks to Lumen on your behalf.

**Why bother with the middle server?** If we put your API secret directly in the browser code, anyone visiting the site could open the developer tools and copy it. Keeping it server-side keeps you safe â€” even if you later put this app on the public internet.

More detail in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## Documentation

- [docs/SETUP.md](docs/SETUP.md) â€” the long, step-by-step installation guide for people who've never used a terminal before.
- [docs/GET_CREDENTIALS.md](docs/GET_CREDENTIALS.md) â€” where to find your Lumen API key and secret, and how to keep them safe.
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) â€” a tour of what's in each folder and why.
- [docs/API_REFERENCE.md](docs/API_REFERENCE.md) â€” the four routes the local server provides, for the technically curious.

---

## Top 5 things that go wrong

| What you saw | What it means | How to fix it |
|---|---|---|
| `port 8787 in use` | Another program is already using that network port (a numbered "lane" on your computer). | Open `.env`, change `SERVER_PORT=8787` to something like `SERVER_PORT=8788`, save, then run `npm start` again. |
| `LUMEN_API_KEY missing` | You haven't filled in your secrets yet. | Re-read Step 5 above and edit `.env`. |
| The wallets page is empty | Your organization has no wallets yet â€” not an error. | Create some wallets in the Lumen dashboard, then refresh. |
| Red banner saying `401` or `403` | Your API key or secret is wrong, or the key doesn't have wallet permission. | Double-check `.env`, save, stop the app (Ctrl+C in the terminal), and run `npm start` again. |
| Browser console says "CORS error" | You changed the Vite port but didn't update the allowed-origin setting. | In `.env`, make sure `ALLOWED_ORIGIN` matches the URL in your browser's address bar exactly, including `http://` and the port. |

> **CORS** (Cross-Origin Resource Sharing) is a browser security rule that blocks websites on one address from talking to a server on a different address â€” unless the server explicitly allows it.

---

## License

MIT â€” see [LICENSE](LICENSE). That means: free to use, modify, and share.
