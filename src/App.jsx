import { Routes, Route } from 'react-router-dom'
import { AppProvider, useApp } from './contexts/AppContext'
import Header from './components/Header'
import Footer from './components/Footer'
import StorePage from './pages/StorePage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import ConfirmationPage from './pages/ConfirmationPage'
import AdminPage from './pages/AdminPage'
import TermsPage from './pages/TermsPage'
import GuidesPage from './pages/GuidesPage'
import GoogleSheetsBanner from './components/GoogleSheetsBanner'

const HeaderWithCart = () => {
  const { cart } = useApp()
  return <Header cart={cart} />
}

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col">
        <HeaderWithCart />
        <GoogleSheetsBanner />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<StorePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/guides" element={<GuidesPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AppProvider>
  )
}

export default App
