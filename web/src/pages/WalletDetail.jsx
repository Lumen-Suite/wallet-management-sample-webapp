import { useEffect, useState, useCallback } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { api, extractError } from '../api/client.js'
import Spinner from '../components/Spinner.jsx'
import ErrorBanner from '../components/ErrorBanner.jsx'
import EmptyState from '../components/EmptyState.jsx'
import Pagination from '../components/Pagination.jsx'
import SearchSortBar from '../components/SearchSortBar.jsx'

const FILE_SORT_OPTIONS = [
  { value: 'Name', label: 'File name' },
  { value: 'FileExtension', label: 'Extension' },
  { value: 'CreatedAt', label: 'Created' },
]

function InfoRow({ label, value, mono }) {
  return (
    <div className="grid grid-cols-3 gap-3 py-2 border-b border-lumen-border last:border-b-0">
      <div className="text-xs uppercase tracking-wider text-lumen-muted">{label}</div>
      <div className={`col-span-2 text-sm break-all ${mono ? 'font-mono' : ''}`}>{value ?? '-'}</div>
    </div>
  )
}

export default function WalletDetail() {
  const { id } = useParams()
  const [params, setParams] = useSearchParams()

  const pageNumber = Number(params.get('pageNumber') || 1)
  const pageSize = Number(params.get('pageSize') || 10)
  const search = params.get('search') || ''
  const sortField = params.get('sort[0][field]') || ''
  const sortOrder = params.get('sort[0][order]') || 'asc'

  const [wallet, setWallet] = useState(null)
  const [files, setFiles] = useState(null)
  const [loadingWallet, setLoadingWallet] = useState(true)
  const [loadingFiles, setLoadingFiles] = useState(false)
  const [error, setError] = useState(null)

  const loadWallet = useCallback(async () => {
    setLoadingWallet(true)
    setError(null)
    try {
      const res = await api.get(`/wallets/Custodial/${encodeURIComponent(id)}`)
      setWallet(res.data)
    } catch (e) {
      setError(extractError(e))
      setWallet(null)
    } finally {
      setLoadingWallet(false)
    }
  }, [id])

  const loadFiles = useCallback(async (address) => {
    if (!address) return
    setLoadingFiles(true)
    try {
      const query = { pageNumber, pageSize }
      if (search) query.search = search
      if (sortField) {
        query['sort[0][field]'] = sortField
        query['sort[0][order]'] = sortOrder
      }
      const res = await api.get(`/wallets/Custodial/${encodeURIComponent(address)}/files`, { params: query })
      setFiles(res.data)
    } catch (e) {
      setError(extractError(e))
    } finally {
      setLoadingFiles(false)
    }
  }, [pageNumber, pageSize, search, sortField, sortOrder])

  useEffect(() => {
    loadWallet()
  }, [loadWallet])

  useEffect(() => {
    if (wallet?.WalletAddress) loadFiles(wallet.WalletAddress)
  }, [wallet, loadFiles])

  const updateParams = (changes) => {
    const next = new URLSearchParams(params)
    for (const [k, v] of Object.entries(changes)) {
      if (v === undefined || v === '' || v === null) next.delete(k)
      else next.set(k, String(v))
    }
    setParams(next)
  }

  const filesList = files?.Files ?? files?.files ?? []
  const pagination = files?.Pagination ?? files?.pagination

  return (
    <div>
      <div className="mb-6">
        <Link to="/" className="text-sm text-lumen-muted hover:text-lumen-fg">
          &larr; Back to wallets
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight mt-2">Wallet detail</h1>
      </div>

      <ErrorBanner message={error} onRetry={loadWallet} />

      {loadingWallet ? (
        <Spinner label="Loading wallet..." />
      ) : !wallet ? null : (
        <section className="border border-lumen-border p-5 mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-lumen-muted mb-3">Wallet info</h2>
          <InfoRow label="ID" value={wallet.id ?? wallet.Id} mono />
          <InfoRow label="Address" value={wallet.WalletAddress} mono />
          <InfoRow label="Account name" value={wallet.Provider?.AccountName} />
          <InfoRow label="Email" value={wallet.Provider?.Email} />
          <InfoRow label="Account type" value={wallet.AccountType ?? 'Custodial'} />
        </section>
      )}

      <section>
        <header className="mb-3">
          <h2 className="text-lg font-semibold tracking-tight">Files in this wallet</h2>
          <p className="text-sm text-lumen-muted mt-1">
            Every file owned by this wallet address.
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
          sortOptions={FILE_SORT_OPTIONS}
          placeholder="Search files..."
        />

        {loadingFiles ? (
          <Spinner label="Loading files..." />
        ) : filesList.length === 0 ? (
          <EmptyState
            title={search ? 'No files match your search' : 'No files yet'}
            message="This wallet has no files associated with it."
          />
        ) : (
          <div className="border border-lumen-border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-lumen-subtle border-b border-lumen-border">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-lumen-muted uppercase text-xs tracking-wider">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-lumen-muted uppercase text-xs tracking-wider">Extension</th>
                  <th className="text-left px-4 py-3 font-medium text-lumen-muted uppercase text-xs tracking-wider hidden md:table-cell">Owner</th>
                  <th className="text-left px-4 py-3 font-medium text-lumen-muted uppercase text-xs tracking-wider hidden lg:table-cell">Checksum</th>
                </tr>
              </thead>
              <tbody>
                {filesList.map((f) => {
                  const fid = f.id ?? f.Id ?? f.Name
                  return (
                    <tr key={fid} className="border-b border-lumen-border last:border-b-0 hover:bg-lumen-row-hover">
                      <td className="px-4 py-3 font-medium">{f.Name ?? '-'}</td>
                      <td className="px-4 py-3 text-lumen-muted">{f.FileExtension ?? '-'}</td>
                      <td className="px-4 py-3 hidden md:table-cell font-mono text-lumen-muted">{f.OwnerAddress ? `${f.OwnerAddress.slice(0, 6)}...${f.OwnerAddress.slice(-4)}` : '-'}</td>
                      <td className="px-4 py-3 hidden lg:table-cell font-mono text-xs text-lumen-muted">{f.Checksum ? f.Checksum.slice(0, 12) + '...' : '-'}</td>
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
      </section>
    </div>
  )
}
