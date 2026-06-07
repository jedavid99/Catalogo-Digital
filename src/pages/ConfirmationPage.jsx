import { Link, useSearchParams } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'

const ConfirmationPage = () => {
  try {
    const [searchParams] = useSearchParams()
    const orderCode = searchParams.get('code')
    const { getOrderByCode, config } = useApp()
    const order = orderCode ? getOrderByCode(orderCode) : null

    const defaultImage = "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=600&auto=format&fit=crop"

    // Obtener plataformas únicas del pedido
    const uniquePlatforms = order && order.items && order.items.length > 0 
      ? [...new Set(order.items.map(item => item.platform))] 
      : ['Steam']

    // Recursos de instalación por plataforma
    const platformResources = {
      'Steam': {
        guide: '/guides/steam-installation.pdf',
        videos: [
          { title: 'Cómo activar un juego en Steam', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { title: 'Guía completa de Steam', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
        ]
      },
      'PC': {
        guide: '/guides/pc-installation.pdf',
        videos: [
          { title: 'Instalación de juegos en PC', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { title: 'Configuración óptima de PC', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
        ]
      },
      'PS4': {
        guide: '/guides/PS4-installation.pdf',
        videos: [
          { title: 'Canjear código en PS4 Store', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { title: 'Instalación en PS4/PS5', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
        ]
      },
      'PS4': {
        guide: '/guides/ps4-installation.pdf',
        videos: [
          { title: 'Canjear código en PS4', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { title: 'Instalación de juegos en PS4', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
        ]
      },
      'PS5': {
        guide: '/guides/ps5-installation.pdf',
        videos: [
          { title: 'Canjear código en PS5', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { title: 'Instalación de juegos en PS5', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
        ]
      },
      'PS3': {
        guide: '/guides/ps3-installation.pdf',
        videos: [
          { title: 'Canjear código en PS3', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { title: 'Instalación de juegos en PS3', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
        ]
      },
      'Xbox': {
        guide: '/guides/xbox-installation.pdf',
        videos: [
          { title: 'Redimir código en Xbox', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { title: 'Instalación en Xbox One/Series', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
        ]
      },
      'Xbox One': {
        guide: '/guides/xbox-one-installation.pdf',
        videos: [
          { title: 'Redimir código en Xbox One', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { title: 'Instalación en Xbox One', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
        ]
      },
      'Xbox Series': {
        guide: '/guides/xbox-series-installation.pdf',
        videos: [
          { title: 'Redimir código en Xbox Series X/S', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { title: 'Instalación en Xbox Series', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
        ]
      },
      'Nintendo': {
        guide: '/guides/nintendo-installation.pdf',
        videos: [
          { title: 'Canjear código en Nintendo eShop', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { title: 'Instalación en Switch', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
        ]
      },
      'Nintendo Switch': {
        guide: '/guides/switch-installation.pdf',
        videos: [
          { title: 'Canjear código en Switch', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { title: 'Instalación de juegos en Switch', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
        ]
      },
      'Epic Games': {
        guide: '/guides/epic-installation.pdf',
        videos: [
          { title: 'Activar juego en Epic Games', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { title: 'Guía de Epic Games Store', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
        ]
      },
      'Windows': {
        guide: '/guides/windows-activation.pdf',
        videos: [
          { title: 'Activar Windows 10/11', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { title: 'Instalación completa de Windows', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
        ]
      },
      'Office': {
        guide: '/guides/office-activation.pdf',
        videos: [
          { title: 'Activar Microsoft Office', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { title: 'Instalación de Office 365/2021', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
        ]
      },
      'Gift Cards': {
        guide: '/guides/giftcard-redemption.pdf',
        videos: [
          { title: 'Canjear Gift Card', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { title: 'Guía de Gift Cards', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
        ]
      },
      'Game Coins': {
        guide: '/guides/gamecoins-redemption.pdf',
        videos: [
          { title: 'Canjear monedas de juegos', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { title: 'Guía de monedas virtuales', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
        ]
      },
      'Steam Key': {
        guide: '/guides/steam-key-installation.pdf',
        videos: [
          { title: 'Activar Steam Key', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { title: 'Guía de Steam Keys', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
        ]
      },
      'Steam Global Key': {
        guide: '/guides/steam-global-key.pdf',
        videos: [
          { title: 'Activar Steam Global Key', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { title: 'Guía de Keys Globales', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
        ]
      },
      'Epic Games Key': {
        guide: '/guides/epic-key-installation.pdf',
        videos: [
          { title: 'Activar Epic Games Key', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { title: 'Guía de Epic Keys', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
        ]
      }
    }

    const orderItems = order?.items ?? []

  return (
    <main className="pt-10 pb-10 px-4 md:px-gutter max-w-5xl mx-auto">
      {/* Stepper */}
      <div className="mb-8">
        <nav className="flex items-center justify-center gap-4 max-w-2xl mx-auto">
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="w-10 h-10 rounded-full bg-slate-800 text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-sm">check</span>
            </div>
            <span className="font-label-caps text-label-caps text-primary">Carrito</span>
          </div>
          <div className="h-[1px] bg-primary flex-1 -mt-6"></div>
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="w-10 h-10 rounded-full bg-slate-800 text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-sm">check</span>
            </div>
            <span className="font-label-caps text-label-caps text-primary">Checkout</span>
          </div>
          <div className="h-[1px] bg-primary flex-1 -mt-6"></div>
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="w-10 h-10 rounded-full bg-green-600 text-on-primary flex items-center justify-center animate-pulse">
              <span className="material-symbols-outlined text-lg">verified</span>
            </div>
            <span className="font-label-caps text-label-caps text-primary">Confirmación</span>
          </div>
        </nav>
      </div>

      {/* Success Hero Section */}
     <div className="glass-panel rounded-xl p-4 md:p-2 text-center mb-6 relative overflow-hidden">
  <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-3xl -mr-24 -mt-24"></div>
  <div className="relative z-10">
    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-neonGreen/20 border-2 border-neonGreen mb-3">
      <span className="material-symbols-outlined text-neonGreen text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
        check_circle
      </span>
    </div>
    <h1 className="font-display-md text-display-md mb-1 text-primary tracking-tight">¡Pedido Recibido!</h1>
    <p className="font-body-sm text-body-sm text-onSurfaceVariant max-w-md mx-auto mb-3">
      Tu pedido ha sido creado correctamente. Estamos validando tu pago y te contactaremos pronto.
    </p>
    {order && order.orderCode && (
      <div className="inline-flex items-center gap-2 bg-surfaceContainerHigh px-3 py-1.5 rounded-lg border border-primary/30">
        <span className="text-xs text-onSurfaceVariant">Código:</span>
        <span className="font-mono font-semibold text-primary text-sm">{order.orderCode}</span>
      </div>
    )}
  </div>
</div>

      {/* Order Status Banner */}
      {order && order.status && (
        <div className={`glass-panel rounded-xl p-4 mb-8 flex items-center justify-between ${
          order.status === 'confirmed' ? 'border-neonGreen/30 bg-neonGreen/5' : 
          order.status === 'completed' ? 'border-primary/30 bg-primary/5' : 
          'border-tertiary/30 bg-tertiary/5'
        }`}>
          <div className="flex items-center gap-3">
            <span className={`material-symbols-outlined text-2xl ${
              order.status === 'confirmed' ? 'text-neonGreen' : 
              order.status === 'completed' ? 'text-primary' : 
              'text-tertiary'
            }`}>
              {order.status === 'confirmed' ? 'check_circle' : order.status === 'completed' ? 'verified' : 'pending'}
            </span>
            <div>
              <p className="font-bold text-onSurface">Estado del Pedido</p>
              <p className="text-sm text-onSurfaceVariant">
                {order.status === 'confirmed' ? 'Pago confirmado - Enviando productos' : 
                 order.status === 'completed' ? 'Pedido completado' : 
                 'Pendiente de validación de pago'}
              </p>
            </div>
          </div>
          <span className={`font-bold text-sm px-4 py-2 rounded-lg ${
            order.status === 'confirmed' ? 'bg-neonGreen text-background' : 
            order.status === 'completed' ? 'bg-primary text-on-primary' : 
            'bg-tertiary text-background'
          }`}>
            {order.status === 'confirmed' ? 'CONFIRMADO' : order.status === 'completed' ? 'COMPLETADO' : 'PENDIENTE'}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Details Card */}
          <div className="glass-panel rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary text-xl">receipt_long</span>
              <h2 className="font-headline-sm text-headline-sm">Detalles del Pedido</h2>
            </div>
            <div className="space-y-4">
              {orderItems && orderItems.length > 0 ? orderItems.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-surfaceContainerHigh rounded-xl">
                  <div className="w-16 h-20 rounded-lg overflow-hidden bg-surfaceContainer shrink-0">
                    <img alt={item.name} className="w-full h-full object-cover" src={item.img || defaultImage} onError={(e) => e.target.src = defaultImage} />
                  </div>
                  <div className="flex-1">
                    <p className="font-body-md font-bold text-onSurface">{item.name}</p>
                    <p className="text-sm text-onSurfaceVariant">{item.platform}</p>
                  </div>
                  <p className="font-body-md font-bold text-primary">{item.price}</p>
                </div>
              )) : (
                <p className="text-center text-onSurfaceVariant py-4">No hay items en el pedido</p>
              )}
            </div>
            <div className="mt-6 pt-6 border-t border-outline-variant/20 flex justify-between items-center">
              <span className="font-headline-sm text-onSurface">Total</span>
              <span className="font-headline-md text-primary">{order && order.total ? order.total : '$69.98'}</span>
            </div>
          </div>

          {/* Installation Guide */}
          <div className="glass-panel rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary text-xl">
                {order && order.installationType === 'local' ? 'store' : 'install_desktop'}
              </span>
              <h2 className="font-headline-sm text-headline-sm">
                {order && order.installationType === 'local' ? 'Instalación en Local' : 'Instalación por Cuenta Propia'}
              </h2>
            </div>
            
            {order && order.installationType === 'local' ? (
              <div className="space-y-4">
                <div className="bg-surfaceContainerHigh rounded-xl p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="material-symbols-outlined text-primary">location_on</span>
                    <div>
                      <p className="font-bold text-onSurface">Play GO Store</p>
                      <p className="text-sm text-onSurfaceVariant">Av. Corrientes 1234, Buenos Aires</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-onSurfaceVariant ml-9">
                    <p className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">schedule</span>
                      Lunes a Viernes: 10:00 - 20:00
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">schedule</span>
                      Sábados: 11:00 - 18:00
                    </p>
                  </div>
                </div>
                <div className="aspect-video bg-surfaceContainer rounded-xl overflow-hidden">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.123456789!2d-58.123456789!3d-34.123456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDA3JzI0LjQiUyA1OMKwMDcnMjQuNCJX!5e0!3m2!1ses!2sar!4v1234567890"
                    className="w-full h-full border-0"
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                </div>
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Play GO+Gaming+Store+Buenos+Aires"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-4 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors"
                >
                  <span className="material-symbols-outlined">directions</span>
                  Abrir en Google Maps
                </a>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-surfaceContainerHigh rounded-xl">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">receipt_long</span>
                  </div>
                  <div>
                    <p className="font-body-md font-bold text-onSurface mb-1">1. Realiza el pago</p>
                    <p className="text-sm text-onSurfaceVariant">Usa los datos de pago que se muestran a la derecha</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-surfaceContainerHigh rounded-xl">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">upload_file</span>
                  </div>
                  <div>
                    <p className="font-body-md font-bold text-onSurface mb-1">2. Comprobante enviado</p>
                    <p className="text-sm text-onSurfaceVariant">Ya adjuntaste tu comprobante al realizar el pedido</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-surfaceContainerHigh rounded-xl">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">key</span>
                  </div>
                  <div>
                    <p className="font-body-md font-bold text-onSurface mb-1">3. Recibe tus Keys</p>
                    <p className="text-sm text-onSurfaceVariant">En menos de 15 min recibirás tus códigos por email</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-surfaceContainerHigh rounded-xl">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">install_desktop</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-body-md font-bold text-onSurface mb-1">4. Activa en tu cuenta</p>
                    <p className="text-sm text-onSurfaceVariant mb-4">Selecciona tu plataforma para ver las guías de instalación</p>
                    
                    {/* Platform Resources */}
                    <div className="space-y-3">
                      {uniquePlatforms && uniquePlatforms.length > 0 && uniquePlatforms.map((platform) => {
                        const resources = platformResources[platform] || platformResources['Steam']
                        if (!resources || !resources.videos) return null
                        return (
                          <div key={platform} className="bg-surfaceContainer rounded-lg p-3 border border-outlineVariant/20">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="material-symbols-outlined text-primary">devices</span>
                              <span className="font-bold text-sm text-onSurface">{platform}</span>
                            </div>
                            
                            <div className="space-y-2">
                              {/* Download Guide */}
                              {resources.guide && (
                                <a
                                  href={resources.guide}
                                  download
                                  className="flex items-center gap-2 p-2 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors group"
                                >
                                  <span className="material-symbols-outlined text-primary text-lg">download</span>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-onSurface group-hover:text-primary">Descargar Guía PDF</p>
                                    <p className="text-xs text-onSurfaceVariant">Instrucciones paso a paso</p>
                                  </div>
                                </a>
                              )}
                              
                              {/* YouTube Videos */}
                              {resources.videos && resources.videos.length > 0 && (
                                <div className="space-y-1">
                                  <p className="text-xs text-onSurfaceVariant ml-1">Videos de instalación:</p>
                                  {resources.videos.map((video, idx) => (
                                    <a
                                      key={idx}
                                      href={video.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 p-2 bg-surfaceContainerHigh hover:bg-surfaceContainerHighest rounded-lg transition-colors group"
                                    >
                                      <span className="material-symbols-outlined text-[#FF0000] text-lg">play_circle</span>
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-onSurface group-hover:text-primary">{video.title}</p>
                                        <p className="text-xs text-onSurfaceVariant">YouTube</p>
                                      </div>
                                      <span className="material-symbols-outlined text-onSurfaceVariant text-sm">external_link</span>
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Info */}
          <div className="glass-panel rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary text-xl">account_balance_wallet</span>
              <h2 className="font-headline-sm text-headline-sm">Datos de Pago</h2>
            </div>
            <div className="space-y-3">
              {order?.paymentMethod ? (
                <div className="flex justify-between items-center p-3 bg-surfaceContainerHigh rounded-lg">
                  <span className="text-sm text-onSurfaceVariant">Método:</span>
                  <span className="text-sm text-onSurface capitalize">{order.paymentMethod.replace(/_/g, ' ')}</span>
                </div>
              ) : (
                <p className="text-sm text-onSurfaceVariant text-center py-2">
                  Los datos de pago se configurarán desde la base de datos.
                </p>
              )}
            </div>
          </div>

          {/* WhatsApp Contact */}
          {config && config.waNumber && (
            <a
              href={`https://wa.me/${config.waNumber}?text=${encodeURIComponent(`Hola! Quiero consultar sobre mi pedido ${order && order.orderCode ? order.orderCode : ''}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-[#25D366] text-white rounded-xl p-6 hover:bg-[#20bd5a] transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-3xl">chat</span>
                <div>
                  <p className="font-bold text-lg">Contactar por WhatsApp</p>
                  <p className="text-sm opacity-90">Soporte inmediato</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                <span className="material-symbols-outlined text-sm">send</span>
                <span className="text-sm font-bold">Iniciar Chat</span>
              </div>
            </a>
          )}

          {/* Actions */}
          <Link to="/" className="block glass-panel rounded-xl p-4 text-center hover:bg-surfaceContainerHigh transition-colors">
            <div className="flex items-center justify-center gap-2 font-bold">
              <span className="material-symbols-outlined">arrow_back</span>
              Volver a la Tienda
            </div>
          </Link>
        </div>
      </div>
    </main>
  )
  } catch (error) {
    console.error('Error en ConfirmationPage:', error)
    return (
      <main className="pt-10 pb-10 px-4 md:px-gutter max-w-5xl mx-auto">
        <div className="glass-panel rounded-xl p-6 text-center">
          <h1 className="font-display-md text-display-md mb-4 text-primary">Error</h1>
          <p className="text-onSurfaceVariant">Hubo un error al cargar la página de confirmación.</p>
        </div>
      </main>
    )
  }
}

export default ConfirmationPage
