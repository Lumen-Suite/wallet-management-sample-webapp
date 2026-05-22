import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Wallets from './pages/Wallets.jsx'
import WalletDetail from './pages/WalletDetail.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Wallets />} />
        <Route path="/wallets/:id" element={<WalletDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
