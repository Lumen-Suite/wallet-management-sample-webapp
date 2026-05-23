import { Link } from 'react-router-dom'
import lumenLogo from '../assets/lumen.png'

export default function Header() {
  return (
    <header className="border-b border-lumen-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={lumenLogo}
            alt="Lumen"
            className="inline-flex items-center justify-center w-8 h-8"
          />
          <span className="font-semibold tracking-tight text-lumen-fg">
            Lumen Wallet Management
          </span>
          <span className="hidden sm:inline text-xs uppercase tracking-widest text-lumen-muted ml-1 px-2 py-1 border border-lumen-border">
            Sample
          </span>
        </Link>
        <nav className="text-sm">
          <a
            href="https://github.com/Bayanichain/wallet-management-sample-webapp"
            target="_blank"
            rel="noreferrer"
            className="text-lumen-muted hover:text-lumen-fg"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  )
}
