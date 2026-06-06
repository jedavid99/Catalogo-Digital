import { Link } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'

const CartPage = () => {
  const { cart, removeFromCart, clearCart } = useApp()

  const defaultImage = "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=600&auto=format&fit=crop"

  // Calcular totales dinámicamente
  const subtotal = cart.reduce((sum, item) => {
    const price = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0
    return sum + (price * (item.quantity || 1))
  }, 0)

  const taxes = subtotal * 0.21 // 21% IVA
  const discount = 0 // Se puede agregar lógica de descuentos
  const total = subtotal + taxes - discount

  return (
    <main className="flex-grow pt-32 pb-24 px-gutter max-w-container-max mx-auto w-full">
      {/* Progress Stepper */}
      <div className="flex items-center justify-center gap-4 mb-16 max-w-xl mx-auto">
        <div className="relative flex flex-col items-center gap-2 group flex-1">
          <div className="text-primary font-label-caps text-label-caps step-active flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">shopping_cart</span>
            CARRITO
          </div>
        </div>
        <div className="h-px bg-outline-variant/30 flex-1 mb-6"></div>
        <div className="relative flex flex-col items-center gap-2 group flex-1">
          <div className="text-onSurfaceVariant font-label-caps text-label-caps flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">payments</span>
            CHECKOUT
          </div>
        </div>
        <div className="h-px bg-outline-variant/30 flex-1 mb-6"></div>
        <div className="relative flex flex-col items-center gap-2 group flex-1">
          <div className="text-onSurfaceVariant font-label-caps text-label-caps flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">verified</span>
            CONFIRMACIÓN
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-8 tracking-tighter">
            Tu <span className="text-primary">Bóveda</span> de Juegos
          </h1>

          {cart.length === 0 ? (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-6xl text-outlineVariant mb-4 block">
                shopping_cart
              </span>
              <h3 className="font-headline-sm text-onSurface mb-2">Tu carrito está vacío</h3>
              <p className="text-onSurfaceVariant mb-6">
                Agrega juegos para comenzar tu compra
              </p>
              <Link to="/" className="bg-primary text-on-primary px-6 py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(190,198,224,0.4)] transition-all">
                Explorar Tienda
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.cartId} className="glass-card rounded-xl p-4 flex flex-col sm:flex-row gap-6 hover:bg-surfaceContainerHigh transition-all group neon-glow-primary">
                <div className="w-full sm:w-48 aspect-video sm:aspect-square overflow-hidden rounded-lg border border-outlineVariant/30 relative bg-surfaceContainer">
                  <img alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={item.img || defaultImage} onError={(e) => e.target.src = defaultImage} />
                  <div className={`absolute top-2 left-2 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${item.platform === 'Steam' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-[#FCEE09]/20 text-[#FCEE09] border-[#FCEE09]/30'}`}>
                    {item.platform}
                  </div>
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-headline-sm text-headline-sm text-onSurface">{item.name}</h3>
                      <button className="text-onSurfaceVariant hover:text-error transition-colors material-symbols-outlined" onClick={() => removeFromCart(item.cartId)}>
                        delete
                      </button>
                    </div>
                    <p className="text-onSurfaceVariant text-body-sm mt-1">{item.platform} • Digital Key</p>
                  </div>
                  <div className="flex justify-between items-end mt-6">
                    <div className="flex items-center gap-3 bg-surfaceContainer rounded-lg p-1 border border-outlineVariant/20">
                      <button className="w-8 h-8 flex items-center justify-center hover:bg-primary/10 rounded-md transition-colors material-symbols-outlined text-body-sm">
                        remove
                      </button>
                      <span className="font-bold w-4 text-center">{item.quantity || 1}</span>
                      <button className="w-8 h-8 flex items-center justify-center hover:bg-primary/10 rounded-md transition-colors material-symbols-outlined text-body-sm">
                        add
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-primary font-headline-sm text-headline-sm">{item.price}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          <div className="pt-8 flex items-center gap-2 text-onSurfaceVariant hover:text-primary transition-colors cursor-pointer group">
            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <Link to="/" className="font-body-md">Seguir explorando la tienda</Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <div className="glass-card rounded-2xl p-6 border-primary/20 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 blur-[80px]"></div>
            <h2 className="font-headline-sm text-headline-sm mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                receipt_long
              </span>
              Resumen del Pedido
            </h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-onSurfaceVariant">
                <span className="font-body-md">Subtotal</span>
                <span className="font-body-md">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-onSurfaceVariant">
                <span className="font-body-md">Impuestos (Protocolo IVA)</span>
                <span className="font-body-md">${taxes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-tertiary">
                <span className="font-body-md">Descuento aplicado</span>
                <span className="font-body-md">-${discount.toFixed(2)}</span>
              </div>
              <div className="h-px bg-outline-variant/20 my-4"></div>
              <div className="flex justify-between items-center">
                <span className="font-headline-sm text-headline-sm">Total</span>
                <span className="font-headline-md text-headline-md text-primary tracking-tight">${total.toFixed(2)}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="relative">
                <input className="w-full bg-surfaceContainer border-outlineVariant/30 rounded-lg py-3 px-4 focus:ring-1 focus:ring-primary focus:border-primary transition-all text-body-sm" placeholder="Código de acceso (PROMO)" type="text" />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-primary font-label-caps text-[10px] hover:underline px-2">
                  APLICAR
                </button>
              </div>
              <Link to="/checkout" className="w-full bg-blue-600 text-on-primary font-headline-sm py-4 rounded-xl flex items-center justify-center gap-3 hover:shadow-[0_0_20px_rgba(190,198,224,0.4)] transition-all active:scale-[0.98] group">
                Continuar al Checkout
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-4 gap-4 opacity-40">
              <div className="aspect-video bg-onSurfaceVariant/20 rounded-md flex items-center justify-center">
                <span className="material-symbols-outlined text-xs">credit_card</span>
              </div>
              <div className="aspect-video bg-onSurfaceVariant/20 rounded-md flex items-center justify-center text-[10px] font-bold">
                PAY
              </div>
              <div className="aspect-video bg-onSurfaceVariant/20 rounded-md flex items-center justify-center">
                <span className="material-symbols-outlined text-xs">account_balance_wallet</span>
              </div>
              <div className="aspect-video bg-onSurfaceVariant/20 rounded-md flex items-center justify-center text-[10px] font-bold">
                BTC
              </div>
            </div>
          </div>
          <p className="text-center text-onSurfaceVariant text-body-sm mt-6 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-sm">lock</span>
            Transacción Encriptada 256-bit AES
          </p>
        </div>
      </div>
    </main>
  )
}

export default CartPage
