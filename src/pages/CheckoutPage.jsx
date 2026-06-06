import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useApp } from '../contexts/AppContext'
import { isConsultPrice } from '../utils/productHelpers'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const { cart, config, createOrder, clearCart } = useApp()
  const [paymentMethod, setPaymentMethod] = useState('mercado_pago')
  const [installationType, setInstallationType] = useState('self') // 'self' or 'local'
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    whatsapp: '',
    paymentProof: null
  })

  const defaultImage = "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=600&auto=format&fit=crop"

  // Información de pago según método
  const paymentInfo = {
    mercado_pago: { alias: '', cbu: '', cvu: '' },
    transferencia: { banco: '', cbu: '', cuit: '' },
    crypto: { red: '', wallet: '', address: '' }
  }

  const orderItems = cart

  // Calcular totales dinámicamente
  const subtotal = cart.reduce((sum, item) => {
    const price = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0
    return sum + price
  }, 0)

  // Detectar si hay productos con precio "Consultar"
  const hasConsultPrice = cart.some((item) => isConsultPrice(item.price))

  // Si es instalación local, agregar 50%
  const installationFee = installationType === 'local' ? subtotal * 0.5 : 0
  const taxes = (subtotal + installationFee) * 0.21 // 21% IVA
  const total = subtotal + installationFee + taxes

  const handleCompleteOrder = async () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.whatsapp) {
      alert('Por favor completa todos los campos de información del cliente')
      return
    }

    if (!customerInfo.paymentProof) {
      alert('Por favor sube el comprobante de pago')
      return
    }

    if (cart.length === 0) {
      alert('El carrito está vacío')
      return
    }

    // Verificar si hay productos con precio "Consultar"
    if (hasConsultPrice) {
      alert('Hay productos con precio "Consultar" en tu carrito. Por favor contacta al administrador para obtener el precio antes de completar el pedido.')
      return
    }

    // Calcular total
    const baseTotal = cart.reduce((sum, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0
      return sum + price
    }, 0)
    
    // Si es instalación local, agregar 50%
    const orderInstallationFee = installationType === 'local' ? baseTotal * 0.5 : 0
    const orderTaxes = (baseTotal + orderInstallationFee) * 0.21
    const finalTotal = baseTotal + orderInstallationFee + orderTaxes

    // Crear pedido
    const order = await createOrder({
      items: cart,
      customerInfo,
      installationType,
      paymentMethod,
      total: `$${finalTotal.toFixed(2)}`
    })

    // Generar mensaje de WhatsApp con el código del pedido
    const itemsList = cart.map(item => `• ${item.name} - ${item.price}`).join('\n')
    const whatsappMessage = encodeURIComponent(
      `🎮 *Nuevo Pedido - CyberVault*\n\n` +
      `📋 *Código del Pedido:* ${order.orderCode}\n\n` +
      `👤 *Cliente:* ${customerInfo.name}\n` +
      `📧 *Email:* ${customerInfo.email}\n` +
      `📱 *WhatsApp:* +${customerInfo.whatsapp}\n\n` +
      `📦 *Productos:*\n${itemsList}\n\n` +
      `💰 *Total:* ${order.total}\n` +
      `💳 *Método de Pago:* ${paymentMethod === 'mercado_pago' ? 'Mercado Pago' : paymentMethod === 'transferencia' ? 'Transferencia' : 'Crypto'}\n` +
      `🔧 *Tipo de Instalación:* ${installationType === 'self' ? 'Cuenta Propia' : 'En Local'}\n\n` +
      `✅ *Estado:* Pendiente de confirmación`
    )

    // Abrir WhatsApp
    window.open(`https://wa.me/${config.waNumber}?text=${whatsappMessage}`, '_blank')

    // Navegar a página de confirmación
    navigate(`/confirmation?code=${order.orderCode}`)
  }

  return (
    <main className="pt-32 pb-24 px-gutter max-w-container-max mx-auto">
      {/* Progress Stepper */}
      <nav className="mb-12 flex justify-center items-center gap-4 max-w-2xl mx-auto">
        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center border-primary/50 text-primary">
            <span className="material-symbols-outlined text-sm">check</span>
          </div>
          <span className="font-label-caps text-label-caps text-onSurfaceVariant">Carrito</span>
        </div>
        <div className="h-[1px] bg-outline-variant/30 flex-1 -mt-6"></div>
        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-on-primary step-active">
            <span className="material-symbols-outlined">payments</span>
          </div>
          <span className="font-label-caps text-label-caps text-primary">Checkout</span>
        </div>
        <div className="h-[1px] bg-outline-variant/30 flex-1 -mt-6"></div>
        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center opacity-40">
            <span className="material-symbols-outlined">verified</span>
          </div>
          <span className="font-label-caps text-label-caps text-onSurfaceVariant opacity-40">Confirmación</span>
        </div>
      </nav>

      {/* Alert for products with "Consultar" price */}
      {hasConsultPrice && (
        <div className="mb-8 glass-panel rounded-xl p-4 border border-tertiary/50 bg-tertiary/10">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-tertiary text-2xl">info</span>
            <div>
              <p className="font-bold text-tertiary mb-1">Productos con precio a consultar</p>
              <p className="text-sm text-onSurfaceVariant mb-2">
                Hay productos en tu carrito con precio "Consultar". No puedes completar el pago hasta que el administrador te asigne un precio.
              </p>
              <a
                href={`https://wa.me/${config.waNumber}?text=${encodeURIComponent('Hola! Tengo productos con precio "Consultar" en mi carrito. ¿Podrías asignarme el precio?')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-tertiary text-background px-4 py-2 rounded-lg text-sm font-bold hover:bg-tertiary/90 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">chat</span>
                Contactar al Admin
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Side: Forms */}
        <div className="lg:col-span-8 space-y-8">
          {/* Customer Information Section */}
          <section className="glass-panel rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-xl">person</span>
              <h2 className="font-headline-sm text-headline-sm">Información del Cliente</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-label-caps text-label-caps text-onSurfaceVariant text-xs ml-1">Nombre Completo</label>
                <input 
                  className="w-full bg-surfaceContainerLowest border border-outlineVariant/30 rounded-lg px-3 py-2 text-sm text-onSurface focus:ring-0 transition-all neon-glow" 
                  placeholder="John Wick" 
                  type="text" 
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="font-label-caps text-label-caps text-onSurfaceVariant text-xs ml-1">Email de Entrega</label>
                <input 
                  className="w-full bg-surfaceContainerLowest border border-outlineVariant/30 rounded-lg px-3 py-2 text-sm text-onSurface focus:ring-0 transition-all neon-glow" 
                  placeholder="baba.yaga@continental.com" 
                  type="email" 
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="font-label-caps text-label-caps text-onSurfaceVariant text-xs ml-1">WhatsApp</label>
                <div className="flex">
                  <span className="bg-surfaceContainer border border-r-0 border-outlineVariant/30 rounded-l-lg px-3 py-2 text-onSurfaceVariant text-sm">+</span>
                  <input 
                    className="w-full bg-surfaceContainerLowest border border-outlineVariant/30 rounded-r-lg px-3 py-2 text-sm text-onSurface focus:ring-0 transition-all neon-glow" 
                    placeholder="54 9 11 1234 5678" 
                    type="tel" 
                    value={customerInfo.whatsapp}
                    onChange={(e) => setCustomerInfo({...customerInfo, whatsapp: e.target.value})}
                    required
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Installation Type Section */}
          <section className="glass-panel rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-xl">install_desktop</span>
              <h2 className="font-headline-sm text-headline-sm">Tipo de Instalación</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className={`relative cursor-pointer group ${installationType === 'self' ? 'ring-2 ring-primary' : ''}`}>
                <input className="peer sr-only" name="installation" type="radio" checked={installationType === 'self'} onChange={() => setInstallationType('self')} />
                <div className="h-full p-4 rounded-xl border border-outlineVariant/30 bg-surfaceContainerLowest peer-checked:border-primary peer-checked:bg-primary/5 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-2xl text-primary">person</span>
                    <div className="font-body-md font-bold text-sm">Cuenta Propia</div>
                  </div>
                  <div className="text-xs text-onSurfaceVariant opacity-70">
                    Recibe las keys por email con guía de instalación
                  </div>
                </div>
              </label>
              <label className={`relative cursor-pointer group ${installationType === 'local' ? 'ring-2 ring-primary' : ''}`}>
                <input className="peer sr-only" name="installation" type="radio" checked={installationType === 'local'} onChange={() => setInstallationType('local')} />
                <div className="h-full p-4 rounded-xl border border-outlineVariant/30 bg-surfaceContainerLowest peer-checked:border-primary peer-checked:bg-primary/5 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-2xl text-primary">store</span>
                    <div className="font-body-md font-bold text-sm">En Local</div>
                  </div>
                  <div className="text-xs text-onSurfaceVariant opacity-70">
                    Acude al local para instalación física
                  </div>
                </div>
              </label>
            </div>
          </section>

          {/* Payment Method Section */}
          <section className="glass-panel rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-xl">account_balance_wallet</span>
              <h2 className="font-headline-sm text-headline-sm">Método de Pago</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Mercado Pago */}
              <label className="relative cursor-pointer group">
                <input className="peer sr-only" name="payment" type="radio" checked={paymentMethod === 'mercado_pago'} onChange={() => setPaymentMethod('mercado_pago')} />
                <div className="h-full p-4 rounded-xl border border-outlineVariant/30 bg-surfaceContainerLowest peer-checked:border-primary peer-checked:bg-primary/5 transition-all flex flex-col items-center gap-2 text-center">
                  <span className="material-symbols-outlined text-3xl text-onSurfaceVariant group-hover:text-primary transition-colors">account_balance</span>
                  <div className="font-body-md font-bold text-sm">Mercado Pago</div>
                </div>
              </label>
              {/* Transferencia */}
              <label className="relative cursor-pointer group">
                <input className="peer sr-only" name="payment" type="radio" checked={paymentMethod === 'transferencia'} onChange={() => setPaymentMethod('transferencia')} />
                <div className="h-full p-4 rounded-xl border border-outlineVariant/30 bg-surfaceContainerLowest peer-checked:border-primary peer-checked:bg-primary/5 transition-all flex flex-col items-center gap-2 text-center">
                  <span className="material-symbols-outlined text-3xl text-onSurfaceVariant group-hover:text-primary transition-colors">swap_horiz</span>
                  <div className="font-body-md font-bold text-sm">Transferencia</div>
                </div>
              </label>
              {/* Crypto */}
              <label className="relative cursor-pointer group">
                <input className="peer sr-only" name="payment" type="radio" checked={paymentMethod === 'crypto'} onChange={() => setPaymentMethod('crypto')} />
                <div className="h-full p-4 rounded-xl border border-outlineVariant/30 bg-surfaceContainerLowest peer-checked:border-primary peer-checked:bg-primary/5 transition-all flex flex-col items-center gap-2 text-center">
                  <span className="material-symbols-outlined text-3xl text-onSurfaceVariant group-hover:text-primary transition-colors">currency_bitcoin</span>
                  <div className="font-body-md font-bold text-sm">USDT (Binance)</div>
                </div>
              </label>
            </div>

            {/* Payment Details */}
            <div className="mt-4 p-4 bg-surfaceContainerHigh rounded-xl border border-outlineVariant/20">
              {paymentMethod === 'mercado_pago' && (
                <div className="space-y-2">
                  <p className="font-bold text-primary text-sm mb-2">Datos Mercado Pago</p>
                  <div className="flex justify-between items-center">
                    <span className="text-onSurfaceVariant text-sm">Alias:</span>
                    <span className="font-mono text-onSurface text-sm bg-surfaceContainer px-2 py-1 rounded">{paymentInfo.mercado_pago.alias}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-onSurfaceVariant text-sm">CVU/CBU:</span>
                    <span className="font-mono text-onSurface text-sm bg-surfaceContainer px-2 py-1 rounded">{paymentInfo.mercado_pago.cbu}</span>
                  </div>
                </div>
              )}
              {paymentMethod === 'transferencia' && (
                <div className="space-y-2">
                  <p className="font-bold text-primary text-sm mb-2">Datos Transferencia</p>
                  <div className="flex justify-between items-center">
                    <span className="text-onSurfaceVariant text-sm">Banco:</span>
                    <span className="text-onSurface text-sm">{paymentInfo.transferencia.banco}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-onSurfaceVariant text-sm">CBU:</span>
                    <span className="font-mono text-onSurface text-sm bg-surfaceContainer px-2 py-1 rounded">{paymentInfo.transferencia.cbu}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-onSurfaceVariant text-sm">CUIT:</span>
                    <span className="font-mono text-onSurface text-sm">{paymentInfo.transferencia.cuit}</span>
                  </div>
                </div>
              )}
              {paymentMethod === 'crypto' && (
                <div className="space-y-2">
                  <p className="font-bold text-primary text-sm mb-2">Datos Crypto (USDT)</p>
                  <div className="flex justify-between items-center">
                    <span className="text-onSurfaceVariant text-sm">Red:</span>
                    <span className="text-onSurface text-sm">{paymentInfo.crypto.red}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-onSurfaceVariant text-sm">Wallet:</span>
                    <span className="text-onSurface text-sm">{paymentInfo.crypto.wallet}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-onSurfaceVariant text-sm">ID Binance:</span>
                    <span className="font-mono text-onSurface text-sm bg-surfaceContainer px-2 py-1 rounded">{paymentInfo.crypto.address}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Proof Upload */}
            <div className="mt-4 p-4 bg-surfaceContainerHigh rounded-xl border border-outlineVariant/20">
              <p className="font-bold text-primary text-sm mb-2">Comprobante de Pago</p>
              <p className="text-onSurfaceVariant text-xs mb-3">Sube una captura del comprobante de transferencia para confirmar tu pedido</p>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        setCustomerInfo({...customerInfo, paymentProof: reader.result})
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                  className="w-full text-sm text-onSurface file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-on-primary hover:file:bg-primary/90 cursor-pointer"
                />
                {customerInfo.paymentProof && (
                  <div className="mt-2">
                    <p className="text-xs text-neonGreen mb-1">✓ Comprobante cargado</p>
                    <img src={customerInfo.paymentProof} alt="Comprobante" className="max-w-full h-32 object-cover rounded-lg border border-outlineVariant/30" />
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Right Side: Order Summary */}
        <aside className="lg:col-span-4 sticky top-28">
          <div className="glass-panel rounded-xl p-6 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-16 -mt-16"></div>
            <h3 className="font-headline-sm text-headline-sm">Resumen del Pedido</h3>
            <div className="space-y-4">
              {orderItems.length > 0 ? orderItems.map((item, index) => (
                <div key={item.cartId ?? index} className="flex gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-outlineVariant/20 bg-surfaceContainer">
                    <img className="w-full h-full object-cover" src={item.img || defaultImage} alt={item.name} onError={(e) => e.target.src = defaultImage} />
                  </div>
                  <div className="flex-1">
                    <p className="font-body-md font-bold text-onSurface text-sm leading-tight">{item.name}</p>
                    <p className="text-onSurfaceVariant text-xs">{item.platform}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-body-md font-bold text-primary text-sm">{item.price}</p>
                  </div>
                </div>
              )) : (
                <p className="text-center text-onSurfaceVariant py-4 text-sm">Tu carrito está vacío</p>
              )}
            </div>
            <div className="space-y-2 pt-4 border-t border-outline-variant/20">
              <div className="flex justify-between text-onSurfaceVariant text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {installationFee > 0 && (
                <div className="flex justify-between text-primary text-sm">
                  <span>Instalación Local (+50%)</span>
                  <span>+${installationFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-onSurfaceVariant text-sm">
                <span>IVA (21%)</span>
                <span>${taxes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="font-headline-sm text-onSurface">Total</span>
                <span className="font-headline-sm text-primary">${total.toFixed(2)}</span>
              </div>
            </div>
            <div className="pt-4">
              <button 
                onClick={handleCompleteOrder}
                className="w-full bg-blue-600 text-on-primary py-3 rounded-xl font-bold font-body-md flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(190,198,224,0.4)] transition-all active:scale-[0.98]"
              >
                Finalizar Pedido
                <span className="material-symbols-outlined">rocket_launch</span>
              </button>
              <p className="text-center text-[10px] text-onSurfaceVariant mt-3 uppercase tracking-widest opacity-60">
                <span className="material-symbols-outlined align-middle text-[10px] mr-1">encrypted</span>
                Pago Encriptado
              </p>
            </div>
          </div>
          {/* Trust Badge */}
          <div className="mt-4 flex items-center justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
            <span className="material-symbols-outlined text-3xl">verified_user</span>
            <span className="material-symbols-outlined text-3xl">shield</span>
            <span className="material-symbols-outlined text-3xl">lock</span>
          </div>
        </aside>
      </div>
    </main>
  )
}

export default CheckoutPage
