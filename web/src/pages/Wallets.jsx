import { useEffect, useState, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api, extractError } from '../api/client.js'
import Spinner from '../components/Spinner.jsx'
import ErrorBanner from '../components/ErrorBanner.jsx'
import EmptyState from '../components/EmptyState.jsx'
import Pagination from '../components/Pagination.jsx'
import SearchSortBar from '../components/SearchSortBar.jsx'

const SORT_OPTIONS = [
  { value: 'WalletAddress', label: 'Wallet address' },
  { value: 'Provider.AccountName', label: 'Owner name' },
  { value: 'Provider.Email', label: 'Owner email' },
  { value: 'CreatedAt', label: 'Created' },
]

function shortenAddress(addr) {
  if (!addr) return '-'
  if (addr.length <= 14) return addr
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

export default function Wallets() {
  const [params, setParams] = useSearchParams()

  const pageNumber = Number(params.get('pageNumber') || 1)
  const pageSize = Number(params.get('pageSize') || 10)
  const search = params.get('search') || ''
  const sortField = params.get('sort[0][field]') || ''
  const sortOrder = params.get('sort[0][order]') || 'asc'

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const query = { pageNumber, pageSize }
      if (search) query.search = search
      if (sortField) {
        query['sort[0][field]'] = sortField
        query['sort[0][order]'] = sortOrder
      }
      const res = await api.get('/wallets/Custodial', { params: query })
      setData(res.data)
    } catch (e) {
      setError(extractError(e))
    } finally {
      setLoading(false)
    }
  }, [pageNumber, pageSize, search, sortField, sortOrder])

  useEffect(() => {
    load()
  }, [load])

  const updateParams = (changes) => {
    const next = new URLSearchParams(params)
    for (const [k, v] of Object.entries(changes)) {
      if (v === undefined || v === '' || v === null) next.delete(k)
      else next.set(k, String(v))
    }
    setParams(next)
  }

  const wallets = data?.Wallets ?? data?.wallets ?? []
  const pagination = data?.Pagination ?? data?.pagination

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Custodial wallets</h1>
        <p className="text-sm text-lumen-muted mt-1">
          All wallets owned by your organization. Click a row to see its files.
        </p>
      </header>

      <SearchSortBar
        search={search}
        onSearchChange={(v) => updateParams({ search: v, pageNumber: 1 })}
        sortField={sortField}
        sortOrder={sortOrder}
        onSortChange={({ field, order }) =>
          updateParams({ 'sort[0][field]': field, 'sort[0][order]': field ? order : undefined, pageNumber: 1 })
        }
        sortOptions={SORT_OPTIONS}
        placeholder="Search wallets..."
      />

      <ErrorBanner message={error} onRetry={load} />

      {loading ? (
        <Spinner label="Loading wallets..." />
      ) : wallets.length === 0 ? (
        <EmptyState
          title={search ? 'No wallets match your search' : 'No wallets yet'}
          message={
            search
              ? 'Try a different search term, or clear the search box to see all wallets.'
              : 'Your organization has no custodial wallets yet. Create one from the Lumen dashboard.'
          }
        />
      ) : (
        <div className="border border-lumen-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-lumen-subtle border-b border-lumen-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-lumen-muted uppercase text-xs tracking-wider">Wallet address</th>
                <th className="text-left px-4 py-3 font-medium text-lumen-muted uppercase text-xs tracking-wider">Owner</th>
                <th className="text-left px-4 py-3 font-medium text-lumen-muted uppercase text-xs tracking-wider hidden sm:table-cell">Email</th>
                <th className="text-left px-4 py-3 font-medium text-lumen-muted uppercase text-xs tracking-wider hidden md:table-cell">Type</th>
              </tr>
            </thead>
            <tbody>
              {wallets.map((w) => {
                const id = w.id ?? w.Id ?? w.WalletAddress
                return (
                  <tr key={id} className="border-b border-lumen-border last:border-b-0 hover:bg-lumen-row-hover">
                    <td className="px-4 py-3 font-mono">
                      <Link to={`/wallets/${encodeURIComponent(id)}`} className="text-lumen-fg underline-offset-2 hover:underline">
                        {shortenAddress(w.WalletAddress)}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{w.Provider?.AccountName ?? '-'}</td>
                    <td className="px-4 py-3 hidden sm:table-cell text-lumen-muted">{w.Provider?.Email ?? '-'}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-lumen-muted">{w.AccountType ?? 'Custodial'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        pagination={pagination}
        pageSize={pageSize}
        onPageChange={(p) => updateParams({ pageNumber: p })}
        onPageSizeChange={(s) => updateParams({ pageSize: s, pageNumber: 1 })}
      />
    </div>
  )
}
