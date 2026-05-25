# Setup Guide

<p align="center">
  <img src="images/lumen-logo.svg" alt="Lumen" width="100" />
</p>

This is the long, no-experience-required version of the installation guide. If you've never used a terminal (the black-or-white window where you type commands) before, this is the right page for you.

> **What you'll do in this guide:** Install one program (Node.js), download this sample project, write two secret values into a settings file, and run two commands. Total time: about ten minutes.

---

## What you need before you start

- A computer running Windows, macOS, or Linux.
- A web browser. Chrome is recommended but any modern browser works.
- About ten free minutes.
- A Lumen Dev API key **and** API secret. If you don't have these yet, see [GET_CREDENTIALS.md](GET_CREDENTIALS.md) first.

> **Tip:** Read each step fully before doing it. The numbered steps are short on purpose.

---

## Step 1 â€” Install Node.js

**Node.js** is the program that runs the code in this sample. Think of it like a kitchen appliance: the recipe (the project's code) doesn't do anything until you plug in the appliance (Node.js).

### What to do

1. Go to [https://nodejs.org](https://nodejs.org) in your browser.
2. Download the **LTS** version (it stands for "Long-Term Support" â€” the stable version most people use). It's the button labeled "Recommended For Most Users".
3. Run the installer file you just downloaded. Click "Next" through every screen â€” the default choices are correct.

### What to expect

When the installer finishes, nothing visible happens. Node.js is a background tool, not an app with an icon on your desktop. To confirm it's there, open a terminal:

| Your computer | How to open a terminal |
|---|---|
| Windows | Press the Windows key, type `powershell`, press Enter. |
| macOS | Press Cmd+Space, type `terminal`, press Enter. |
| Linux | Press Ctrl+Alt+T (varies by distribution). |

Now type this and press Enter:

```
node --version
```

> **What you should see:** Something like `v20.10.0` or `v22.x.x`. As long as the first number is **20 or higher**, you're good.

> **If something looks wrong:** If you see "command not found" or "is not recognized", close the terminal window completely, open a fresh one, and try again. Sometimes a system restart is needed after installation â€” that's normal.

---

## Step 2 â€” Get your Lumen credentials

Follow [GET_CREDENTIALS.md](GET_CREDENTIALS.md) and come back here with two values written down:

- `LUMEN_API_KEY` â€” looks like a long random string of letters and numbers.
- `LUMEN_API_SECRET` â€” looks similar but is the secret half.

> **Heads up:** The secret is usually displayed only once. If you close the page before copying it, you'll have to throw it away and create a new key.

---

## Step 3 â€” Download this project

### Option A â€” The easy way (no Git needed)

1. On the project's GitHub page, click the green **"Code"** button.
2. Click **"Download ZIP"**.
3. Open the downloaded ZIP file and extract (unzip) it into a folder you can find later. Your **Documents** folder is a good choice.

### Option B â€” With Git

If you already have Git (a tool developers use), open a terminal and run:

```
git clone https://github.com/Lumen-Suite/wallet-management-sample-webapp.git
```

> **What you should see (either option):** A new folder named `wallet-management-sample-webapp` containing files like `package.json`, `README.md`, a `server` folder, and a `web` folder.

---

## Step 4 â€” Open the folder in a terminal

You need to be "inside" the project folder for the next commands to work. "Inside" just means the terminal is pointing at that folder when you type commands.

### What to do

| Your computer | What to type |
|---|---|
| Windows (PowerShell) | `cd "C:\Users\YOU\Documents\wallet-management-sample-webapp"` |
| macOS or Linux | `cd ~/Documents/wallet-management-sample-webapp` |

Replace `YOU` (Windows) or `~/Documents/...` (macOS/Linux) with the actual path to where you unzipped the project.

> **Tip (Windows):** Open the unzipped folder in File Explorer, right-click any empty spot inside it, and choose **"Open in Terminal"**. That puts you in the right place without typing the path.

> **What you should see:** Your terminal prompt now ends with the folder name `wallet-management-sample-webapp`.

---

## Step 5 â€” Create your `.env` file

The `.env` file is where you'll write your secret values. It's a plain text file with one setting per line. The project ships with a template called `.env.example`. You need to copy that template into a real file named `.env`.

### What to do

Run the command for your computer:

| Your computer | What to type |
|---|---|
| Windows (PowerShell) | `Copy-Item .env.example .env` |
| macOS or Linux | `cp .env.example .env` |

> **What you should see:** A new file called `.env` appears alongside `.env.example` in your project folder.

### Now edit the file

Open `.env` in any text editor â€” Notepad on Windows, TextEdit on macOS, or VS Code if you have it. You'll see something like:

```
LUMEN_API_KEY=paste-your-api-key-here
LUMEN_API_SECRET=paste-your-api-secret-here
SERVER_PORT=8787
ALLOWED_ORIGIN=http://localhost:5173
VITE_BFF_URL=http://localhost:8787
```

Replace the `paste-your-...-here` text with the real values from Step 2.

> **Important rules:**
>
> - Do **not** put quotes around the values. `LUMEN_API_KEY=abc123` is correct. `LUMEN_API_KEY="abc123"` is wrong.
> - Do **not** put spaces around the `=` sign. `LUMEN_API_KEY = abc123` is wrong.
> - Each setting must be on its own single line.

Save the file when you're done.

---

## Step 6 â€” Install the project's libraries

Software projects depend on lots of small helper packages (libraries) written by other people. The next command asks Node.js to download all of them.

### What to do

```
npm install
```

> **What you should see:** Lots of text scrolling. It takes one to two minutes the first time. When it finishes, you'll see a friendly message and your normal terminal prompt is back.

> **If something looks wrong:** If you see "npm: command not found" or similar, Node.js didn't install correctly. Go back to Step 1.

---

## Step 7 â€” Start the app

### What to do

```
npm start
```

### What to expect

You'll see colored text from two different sources at once â€” the server and the website. The important lines look like this:

```
SRV [wms-server] SRV ready on 8787
WEB   VITE v6.x.x  ready in 234 ms
WEB   âžœ  Local:   http://localhost:5173/
```

> **What you should see:** Both `SRV ready on 8787` and `WEB Local: http://localhost:5173` appear within a few seconds. If they do, the app is running.

The terminal stays "stuck" displaying these lines â€” that's correct. The app keeps running as long as the terminal window is open.

---

## Step 8 â€” Open the dashboard

Open your browser and go to:

[http://localhost:5173](http://localhost:5173)

The wallets dashboard loads.

> **Heads up:** `localhost` means "this computer". The number `5173` is the port â€” like an apartment number for which program inside your computer should answer. Only you can see this page; it's not on the internet.

---

## Stopping the app

When you want to stop the app, go back to the terminal where it's running and press:

| Your computer | What to press |
|---|---|
| Windows or Linux | `Ctrl + C` |
| macOS | `Cmd + C` (or `Ctrl + C`) |

The colored output stops and your normal prompt returns. Start the app again any time with `npm start`.

---

## Troubleshooting matrix

Each problem below has three parts: **what you saw** in your terminal or browser, **what it means** in plain English, and **how to fix it**.

### `port 8787 is already in use`

| What you saw | What it means | How to fix it |
|---|---|---|
| `Error: listen EADDRINUSE: address already in use :::8787` | Another program is already using port 8787 (the lane the server wants to listen on). | Open `.env`, change `SERVER_PORT=8787` to `SERVER_PORT=8788` (or any number between 1024 and 65535), save, then run `npm start` again. |

### `[ERROR] Your .env file is incomplete`

| What you saw | What it means | How to fix it |
|---|---|---|
| The app refuses to start with that error. | You skipped Step 5, or you left one of the `paste-your-...-here` placeholders in the file. | Open `.env` and make sure both `LUMEN_API_KEY` and `LUMEN_API_SECRET` have real values (not the placeholders). |

### The dashboard says "No wallets yet"

| What you saw | What it means | How to fix it |
|---|---|---|
| Empty wallets table after the page loads. | Your Lumen organization simply has no custodial wallets created yet. This is normal for new accounts. | Create one or more wallets from the Lumen dashboard, then refresh this page. |

### Red error banner: "Invalid API key" or "Unauthorized"

| What you saw | What it means | How to fix it |
|---|---|---|
| A red banner in the dashboard. | Your `LUMEN_API_KEY` or `LUMEN_API_SECRET` is wrong, or there are extra spaces or quotes around them in `.env`. | Re-open `.env`, fix the values, save, then stop the app (Ctrl+C) and run `npm start` again. |

### Browser console shows "CORS error"

| What you saw | What it means | How to fix it |
|---|---|---|
| Browser developer tools (F12) show a CORS error. | You probably changed the Vite port. The server has an allowlist of origins it accepts requests from, and your browser's address no longer matches. | In `.env`, set `ALLOWED_ORIGIN` to the exact URL shown in your browser's address bar (including `http://` and the port). |

### Nothing happens / blank screen

| What you saw | What it means | How to fix it |
|---|---|---|
| You opened [http://localhost:5173](http://localhost:5173) and it's blank or won't load. | Either the app failed to start, or the browser is hitting a wall. | (1) Check the terminal â€” did `npm start` show errors? (2) Open the browser's developer tools (press F12), click the Console tab. (3) If you're still stuck, take a screenshot and ask on the repo's Issues page. |
