# Getting your Lumen Dev credentials

To run this sample you need two things from your Lumen Dev account:
- An **API key**
- An **API secret**

These are how the local Express server proves to Lumen that requests are coming from your organization.

## Step-by-step

1. **Sign up / log in** to the Lumen Dev portal. If you don't have access yet, contact the Lumen team — Dev access is invite-based during the developer preview.

2. **Open the API Keys section** of your organization's dashboard. (Usually under Settings > API Keys.)

3. **Create a new API key** for this sample. Give it a name you'll recognize — e.g., `wallet-sample-localhost`.

4. **Copy the key and secret immediately.** The secret is typically shown **once**. If you close the dialog without copying, you'll have to delete the key and create a new one.

5. **Paste them into your local `.env` file** as described in [SETUP.md step 5](SETUP.md#step-5--create-your-env-file).

## What can each credential do?

| Credential | What it does | Where it goes |
|---|---|---|
| `LUMEN_API_KEY` | Identifies your organization | Server `.env` only |
| `LUMEN_API_SECRET` | Proves the request really comes from you | Server `.env` only |

Both stay on your local Express server. The browser never sees them.

## If something goes wrong

| Symptom | Cause | Fix |
|---|---|---|
| 401 Unauthorized | Key/secret typo, or the key was revoked | Re-copy from the dashboard, re-paste into `.env` |
| 403 Forbidden | Your key doesn't have wallet read permission | Contact the Lumen team to enable the WALLETS module on your org |
| "errorMsg: API key not found" | You pasted the wrong field | Make sure the value you put in `LUMEN_API_KEY` is the public part, not the secret |

## Keep it private

- **Never commit `.env`** to Git. The included `.gitignore` already prevents this.
- **Never paste your secret in chat / Slack / screenshots.** If you do, immediately delete that API key from the dashboard and create a new one.
- For production deployments, store the values in your hosting provider's secrets manager — never in source control.
