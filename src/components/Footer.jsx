const Footer = () => {
  return (
    <footer className="bg-surface-container-lowest w-full py-12 border-t border-outline-variant/10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-gutter max-w-container-max mx-auto">
        <div className="space-y-4">
          <h2 className="font-headline-sm text-headline-sm text-onSurface">Play GO</h2>
          <p className="text-body-sm text-onSurfaceVariant">
            Tu destino premium para activos digitales y experiencias de juego de última generación.
          </p>
          
        </div>
        <div>
          <h4 className="font-label-caps text-primary mb-4">MÉTODOS DE PAGO</h4>
          <ul className="space-y-2 text-body-sm text-onSurfaceVariant">
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-xs">payments</span> Mercado Pago
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-xs">account_balance</span> Transferencia Bancaria
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-xs">currency_bitcoin</span> Criptomonedas (Próximamente)
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-label-caps text-primary mb-4">CONTACTO</h4>
          <ul className="space-y-2 text-body-sm text-onSurfaceVariant">
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-xs">mail</span> soporte@Play GO.com
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-xs">chat</span> WhatsApp: +54 9 11 51747883
            </li>
          </ul>
          <p className="mt-6 text-[10px] opacity-50">© 2024 Play GO. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
