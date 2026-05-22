# API Reference

The local Express server exposes 3 routes under `/api`. The frontend uses them automatically — **you don't need to call them directly** unless you're curious or extending the sample.

All 3 routes are GET-only and proxy to the Lumen Wallet API with `lumen-api-key` and `lumen-api-secret` headers injected server-side.

Base URL (local): `http://localhost:8787`

---

## 1. List wallets

**`GET /api/wallets/Custodial`**

Returns the paginated list of custodial wallets owned by your organization.

**Query parameters** (all optional)

| Name | Type | Default | Notes |
|---|---|---|---|
| `pageNumber` | integer (1-10000) | 1 | Which page |
| `pageSize` | integer (1-100) | 10 | Rows per page |
| `search` | string (max 200) | — | Full-text search across wallet fields |
| `sort[0][field]` | string | — | One of: `WalletAddress`, `Provider.AccountName`, `Provider.Email`, `CreatedAt`, `UpdatedAt` |
| `sort[0][order]` | `asc` \| `desc` | — | Sort direction |

**Example**

```
curl "http://localhost:8787/api/wallets/Custodial?pageNumber=1&pageSize=5"
```

**Response shape**

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

**Wraps:** `GET {LUMEN_API_BASE_URL}/wallets/Custodial`

---

## 2. Get one wallet

**`GET /api/wallets/Custodial/:id`**

Returns the full record for a single wallet by its ID. Use this to find a wallet's `WalletAddress` before listing its files.

**Path parameter:** `:id` — the wallet's `id` field from the list endpoint above.

**Example**

```
curl "http://localhost:8787/api/wallets/Custodial/abc-123"
```

**Response shape**

```json
{
  "id": "abc-123",
  "WalletAddress": "0x1234...abcd",
  "Provider": { "AccountName": "Alice", "Email": "alice@example.com" },
  "AccountType": "Custodial"
}
```

**Wraps:** `GET {LUMEN_API_BASE_URL}/wallets/Custodial/{id}`

---

## 3. List files for a wallet

**`GET /api/wallets/Custodial/:addr/files`**

Returns the paginated list of files owned by the given wallet **address** (not ID).

**Path parameter:** `:addr` — the wallet's `WalletAddress` (a `0x...` hex string).

**Query parameters:** same as `/api/wallets/Custodial` (pagination + search + sort).

| Sort fields (allowed) |
|---|
| `Name`, `FileExtension`, `OwnerAddress`, `CreatedAt`, `UpdatedAt` |

**Example**

```
curl "http://localhost:8787/api/wallets/Custodial/0x1234abcd/files?pageNumber=1&pageSize=5"
```

**Response shape**

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

**Wraps:** `GET {LUMEN_API_BASE_URL}/wallets/Custodial/{WalletAddress}/files`

---

## Error responses

All errors come back with the same shape, and the HTTP status code from the upstream Lumen call:

```json
{
  "ok": false,
  "status": 401,
  "error": "Invalid API key"
}
```

Common statuses:

| Status | Meaning |
|---|---|
| 400 | Bad query parameter (e.g., `pageSize=9999`, unknown sort field). Zod schema rejected it before reaching Lumen. |
| 401 | `LUMEN_API_KEY` / `LUMEN_API_SECRET` invalid. Check your `.env`. |
| 403 | Your API key doesn't have permission for the WALLETS module on your org. |
| 404 | Wallet ID or address doesn't exist. |
| 429 | You hit the local rate limit (100 req / 15 min). |
| 500 | Something upstream failed. Check the server console. |

## Health check (not under `/api`)

**`GET /health`** — returns `{ "ok": true, "service": "wms-server" }`. Useful for confirming the server is up.
