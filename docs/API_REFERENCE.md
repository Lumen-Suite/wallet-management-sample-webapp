# API Reference

<p align="center">
  <img src="images/lumen-logo.svg" alt="Lumen" width="100" />
</p>

This page lists the four internet addresses (routes) the local Express server provides. The website part of the app uses them automatically when you click around — **you don't need to call them by hand** unless you're curious, debugging, or building something on top of this sample.

> **Note:** A **route** is a specific URL path the server responds to. For example, `GET /api/wallets/Custodial` is a route. **GET** means "ask for data" (as opposed to **POST**, which means "submit data").

All four routes are GET-only. Each one quietly forwards the request to the real Lumen Wallet API with your `lumen-api-key` and `lumen-api-secret` headers attached by the server — never by the browser.

**Base URL when running locally:** `http://localhost:8787`

> **Tip:** A **base URL** is the part of the address that goes in front of every route. So `GET /api/wallets/Custodial` actually lives at `http://localhost:8787/api/wallets/Custodial` when you run the app on your own computer.

---

## Route 1 — List all wallets

### `GET /api/wallets/Custodial`

Returns a paginated list (split across pages) of custodial wallets owned by your organization.

### Query parameters (all optional)

These are extra values you can attach to the URL after a `?` to filter or sort the results.

| Name | Type | Default | What it does |
|---|---|---|---|
| `pageNumber` | integer (1 to 10000) | 1 | Which page of results to return. |
| `pageSize` | integer (1 to 100) | 10 | How many rows per page. |
| `search` | string (up to 200 chars) | — | Full-text search across wallet fields. |
| `sort[0][field]` | string | — | One of: `WalletAddress`, `Provider.AccountName`, `Provider.Email`, `CreatedAt`, `UpdatedAt`. |
| `sort[0][order]` | `asc` or `desc` | — | Sort direction (ascending or descending). |

### Example

You can test the route by hand with `curl` (a command-line tool that fetches URLs):

```
curl "http://localhost:8787/api/wallets/Custodial?pageNumber=1&pageSize=5"
```

> **What you should see:** A blob of JSON (a structured text format) coming back, like the response shape below.

### Response shape

```json
{
  "Wallets": [
    {
      "id": "abc-123",
      "WalletAddress": "0x1234...abcd",
      "Provider": { "AccountName": "Alice", "Email": "alice@example.com" }
    }
  ],
  "Pagination": { "TotalRowCount": 42, "TotalPage": 5, "CurrentPage": 1 }
}
```

### What it wraps

The server forwards this to: `GET {LUMEN_API_BASE_URL}/wallets/Custodial`

---

## Route 2 — Get one wallet by ID

### `GET /api/wallets/Custodial/:id`

Returns the full record for a single wallet by its ID. Use this to find a wallet's `WalletAddress` before listing its files (Route 3).

### Path parameter

| Name | What it is |
|---|---|
| `:id` | The wallet's `id` field from the list endpoint (Route 1). |

> **Note:** The colon in `:id` is just documentation shorthand meaning "replace this with the real value". So `:id` becomes `abc-123` in the actual URL.

### Example

```
curl "http://localhost:8787/api/wallets/Custodial/abc-123"
```

> **What you should see:** A JSON object describing one wallet (the same shape as one entry in Route 1's `Wallets` array).

### Response shape

```json
{
  "id": "abc-123",
  "WalletAddress": "0x1234...abcd",
  "Provider": { "AccountName": "Alice", "Email": "alice@example.com" },
  "AccountType": "Custodial"
}
```

### What it wraps

`GET {LUMEN_API_BASE_URL}/wallets/Custodial/{id}`

---

## Route 3 — List files attached to a wallet

### `GET /api/wallets/Custodial/:addr/files`

Returns a paginated list of files owned by the given wallet **address** (not its ID).

> **Heads up:** The earlier two routes use the wallet's `id`. This third route uses the wallet's `WalletAddress`. They are different fields — don't mix them up.

### Path parameter

| Name | What it is |
|---|---|
| `:addr` | The wallet's `WalletAddress` — a long hexadecimal string starting with `0x`. |

### Query parameters

Same shape as Route 1 (`pageNumber`, `pageSize`, `search`, `sort[0][field]`, `sort[0][order]`). The allowed sort fields are different:

| Sort fields allowed for this route |
|---|
| `Name`, `FileExtension`, `OwnerAddress`, `CreatedAt`, `UpdatedAt` |

### Example

```
curl "http://localhost:8787/api/wallets/Custodial/0x1234abcd/files?pageNumber=1&pageSize=5"
```

> **What you should see:** A JSON object with a `Files` array and pagination info.

### Response shape

```json
{
  "Files": [
    {
      "id": "file-xyz",
      "Name": "report.pdf",
      "FileExtension": "pdf",
      "OwnerAddress": "0x1234...abcd",
      "Checksum": "base64-md5-here"
    }
  ],
  "Pagination": { "TotalRowCount": 7, "TotalPage": 2, "CurrentPage": 1 }
}
```

### What it wraps

`GET {LUMEN_API_BASE_URL}/wallets/Custodial/{WalletAddress}/files`

---

## Route 4 — List transactions for a wallet

### `GET /api/wallets/Custodial/:addr/transactions`

Returns a paginated list of on-chain transactions for the given wallet **address**. Includes both sent and received transactions.

> **Heads up:** Like Route 3, this uses the wallet's `WalletAddress` (the long `0x...` string), **not** the wallet's `id`.

### Path parameter

| Name | What it is |
|---|---|
| `:addr` | The wallet's `WalletAddress` — a long hexadecimal string starting with `0x`. |

### Query parameters

| Name | Type | Default | What it does |
|---|---|---|---|
| `pageNumber` | integer (1 to 10000) | 1 | Which page of results to return. |
| `pageSize` | integer (1 to 100) | 10 | How many rows per page. |

> **Note:** Unlike the file and wallet lists, this route does not support `search` or `sort` parameters.

### Example

```
curl "http://localhost:8787/api/wallets/Custodial/0x1234abcd/transactions?pageNumber=1&pageSize=5"
```

> **What you should see:** A JSON object with a `Transactions` array and pagination info.

### Response shape

```json
{
  "Transactions": [
    {
      "id": "tx-abc123",
      "Log": {
        "From": "0x1234...abcd",
        "To": "0x5678...efgh",
        "Value": "0.05",
        "Hash": "0xfeed...beef"
      }
    }
  ],
  "Pagination": { "TotalRowCount": 18, "TotalPage": 4, "CurrentPage": 1 }
}
```

### What it wraps

`GET {LUMEN_API_BASE_URL}/wallets/Custodial/{WalletAddress}/transactions`

---

## Error responses

When something goes wrong, all four routes come back with the same shape — and the HTTP status code (a 3-digit number that tells you what kind of problem it is) from the upstream Lumen call:

```json
{
  "ok": false,
  "status": 401,
  "error": "Invalid API key"
}
```

> **Note:** **HTTP status codes** are standard 3-digit numbers. Anything starting with `2` means success. `4xx` means the client (you) did something wrong. `5xx` means the server had a problem.

### Common statuses

| Status | What it means | How to fix it |
|---|---|---|
| 400 | Bad query parameter — for example `pageSize=9999` or an unknown sort field. Zod rejected it before the request ever reached Lumen. | Check your query string for typos and out-of-range numbers. |
| 401 | Your `LUMEN_API_KEY` or `LUMEN_API_SECRET` is invalid. | Re-check both values in `.env`, save, then restart with `npm start`. |
| 403 | Your API key is valid but doesn't have permission for the WALLETS module on your organization. | Contact the Lumen team to enable that module. |
| 404 | The wallet ID or address you asked for doesn't exist. | Double-check the value — easy to mistype a long address. |
| 429 | You hit the local rate limit (100 requests per 15 minutes per IP). | Slow down. Wait a few minutes and try again. |
| 500 | Something upstream failed. | Check the terminal where `npm start` is running for more detail. |

---

## Health check (outside `/api`)

### `GET /health`

A tiny endpoint to confirm the server is alive.

### Example

```
curl "http://localhost:8787/health"
```

> **What you should see:**
>
> ```json
> { "ok": true, "service": "wms-server" }
> ```

Use this when you suspect the server isn't running and want a quick yes/no answer before debugging anything bigger.
