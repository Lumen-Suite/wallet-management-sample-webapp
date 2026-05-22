# Setup Guide

A no-experience-required walkthrough. If you've never used a terminal before, this is for you.

## What you need

- A computer running Windows, macOS, or Linux
- A web browser (Chrome recommended)
- About 10 minutes
- A Lumen Dev API key + secret (see [GET_CREDENTIALS.md](GET_CREDENTIALS.md))

---

## Step 1 — Install Node.js

Node.js is what runs the code in this sample.

1. Go to [https://nodejs.org](https://nodejs.org).
2. Download the **LTS** version (it's labeled "Recommended For Most Users").
3. Run the installer. Click "Next" through every step — defaults are fine.
4. To confirm it worked, open a terminal:
   - **Windows:** press the Windows key, type `powershell`, press Enter.
   - **macOS:** press Cmd+Space, type `terminal`, press Enter.
5. Type `node --version` and press Enter. You should see something like `v20.x.x`. If you do, Node is installed.

> If you see "command not found", close the terminal, open a new one, and try again. If it still fails, restart your computer — the installer needs that sometimes.

---

## Step 2 — Get your Lumen credentials

See [GET_CREDENTIALS.md](GET_CREDENTIALS.md). You'll come back here with two values:
- `LUMEN_API_KEY`
- `LUMEN_API_SECRET`

---

## Step 3 — Download this repo

**Easiest way (no Git needed):**
1. On the GitHub page for this repo, click the green **"Code"** button.
2. Click **"Download ZIP"**.
3. Unzip it somewhere you can find — for example your Documents folder.

**With Git (if you have it):**
```
git clone https://github.com/Bayanichain/wallet-management-sample-webapp.git
```

---

## Step 4 — Open the folder in a terminal

You need to be "inside" the folder for the next commands to work.

- **Windows (PowerShell):**
  ```
  cd "C:\Users\YOU\Documents\wallet-management-sample-webapp"
  ```
  Replace `YOU\Documents\...` with the actual path to where you unzipped it.

- **macOS / Linux:**
  ```
  cd ~/Documents/wallet-management-sample-webapp
  ```

> Tip: in Windows File Explorer, you can right-click inside the folder and choose "Open in Terminal" to skip this step.

---

## Step 5 — Create your `.env` file

There's a file called `.env.example` in the folder. It's a template. You need to make a real copy called `.env`.

- **Windows (PowerShell):**
  ```
  Copy-Item .env.example .env
  ```
- **macOS / Linux:**
  ```
  cp .env.example .env
  ```

Now open `.env` in any text editor (Notepad, TextEdit, VS Code — anything). You'll see lines like this:

```
LUMEN_API_KEY=paste-your-api-key-here
LUMEN_API_SECRET=paste-your-api-secret-here
```

Replace the `paste-your-...-here` text with your real values from step 2.

**Important rules:**
- Do **not** add quotes around the values.
- Do **not** add spaces around the `=` sign.
- The line must look like `LUMEN_API_KEY=abc123-def456` and nothing else.

Save the file when done.

---

## Step 6 — Install dependencies

In your terminal, run:

```
npm install
```

This downloads everything the app needs. It might take 1-2 minutes the first time. When it finishes, you'll see a friendly message telling you what to do next.

If you see "npm: command not found", go back to step 1 — Node didn't install correctly.

---

## Step 7 — Start the app

```
npm start
```

You should see colored output. Wait until you see two lines like:

```
SRV [wms-server] SRV ready on 8787
WEB   VITE v6.x.x  ready in 234 ms
WEB   ➜  Local:   http://localhost:5173/
```

If you see those, the app is running.

---

## Step 8 — Open it

Open Chrome and go to: [http://localhost:5173](http://localhost:5173)

The wallets dashboard appears. Done.

---

## Stopping the app

In the terminal where you ran `npm start`, press `Ctrl + C` (Windows/Linux) or `Cmd + C` (macOS). You can start it again later with `npm start`.

---

## Troubleshooting matrix

### "port 8787 is already in use"

Another program is using that port. Open `.env`, change `SERVER_PORT=8787` to `SERVER_PORT=8788` (or any other number), save, then `npm start` again.

### "[ERROR] Your .env file is incomplete"

You skipped step 5 or left a `paste-your-...-here` value. Open `.env` and make sure both `LUMEN_API_KEY` and `LUMEN_API_SECRET` are real values.

### Wallets list says "No wallets yet"

Your Lumen organization has no custodial wallets yet. That's normal for new accounts. Create some wallets from the Lumen dashboard, then refresh the page.

### Red error banner: "Invalid API key" or "Unauthorized"

Your `LUMEN_API_KEY` or `LUMEN_API_SECRET` is wrong, or there are extra spaces/quotes around them. Re-open `.env`, fix them, stop the app (Ctrl+C), and run `npm start` again.

### Browser console shows CORS error

You probably changed the Vite port. In `.env`, make sure `ALLOWED_ORIGIN` matches the URL the browser is visiting — including the `http://` and the port.

### Nothing happens / blank screen

1. Check the terminal — did `npm start` fail?
2. Open the browser's developer tools (F12), look at the Console tab.
3. Take a screenshot of any errors and ask on the repo's Issues page.
