import { Link } from 'react-router-dom'

const TermsPage = () => {
  return (
    <main className="pt-32 pb-24 px-gutter max-w-container-max mx-auto">
      <div className="glass-panel p-8 rounded-2xl">
        <h1 className="font-headline-md text-headline-md text-primary mb-8">Términos y Condiciones</h1>
        
        <div className="space-y-6 text-onSurface">
          <section>
            <h2 className="font-headline-sm text-headline-sm text-primary mb-4">1. Aceptación de los Términos</h2>
            <p className="text-body-md text-body-md text-onSurfaceVariant leading-relaxed">
              Al acceder y utilizar CyberVault, aceptas estar sujeto a estos términos y condiciones. Si no estás de acuerdo con estos términos, por favor no utilices este servicio.
            </p>
          </section>

          <section>
            <h2 className="font-headline-sm text-headline-sm text-primary mb-4">2. Descripción del Servicio</h2>
            <p className="text-body-md text-body-md text-onSurfaceVariant leading-relaxed">
              CyberVault es una tienda digital que ofrece productos digitales incluyendo juegos, licencias de software, tarjetas de regalo y monedas de juegos. Todos los productos son entregados en formato digital a través de códigos, claves o instrucciones de instalación.
            </p>
          </section>

          <section>
            <h2 className="font-headline-sm text-headline-sm text-primary mb-4">3. Compras y Pagos</h2>
            <div className="space-y-3 text-body-md text-body-md text-onSurfaceVariant leading-relaxed">
              <p>• Todos los precios están expresados en la moneda especificada en el momento de la compra.</p>
              <p>• Aceptamos pagos mediante Mercado Pago, transferencias bancarias y criptomonedas.</p>
              <p>• Los productos con precio "Consultar" requieren contacto previo con el administrador para obtener el precio final.</p>
              <p>• Una vez realizado el pago, recibirás un correo de confirmación con los detalles de tu pedido.</p>
            </div>
          </section>

          <section>
            <h2 className="font-headline-sm text-headline-sm text-primary mb-4">4. Entrega de Productos</h2>
            <div className="space-y-3 text-body-md text-body-md text-onSurfaceVariant leading-relaxed">
              <p>• Los productos digitales se entregan automáticamente después de confirmar el pago.</p>
              <p>• El tiempo de entrega es de hasta 15 minutos después de la confirmación del pago.</p>
              <p>• Para instalación local, el tiempo puede variar según la disponibilidad.</p>
              <p>• Es responsabilidad del cliente proporcionar la información de contacto correcta para la entrega.</p>
            </div>
          </section>

          <section>
            <h2 className="font-headline-sm text-headline-sm text-primary mb-4">5. Reembolsos y Devoluciones</h2>
            <div className="space-y-3 text-body-md text-body-md text-onSurfaceVariant leading-relaxed">
              <p>• Por la naturaleza de los productos digitales, generalmente no aceptamos reembolsos una vez entregado el código o clave.</p>
              <p>• Excepciones pueden aplicarse si el código es defectuoso o no funciona correctamente.</p>
              <p>• Los casos de reembolso serán evaluados individualmente por nuestro equipo de soporte.</p>
            </div>
          </section>

          <section>
            <h2 className="font-headline-sm text-headline-sm text-primary mb-4">6. Responsabilidad del Usuario</h2>
            <div className="space-y-3 text-body-md text-body-md text-onSurfaceVariant leading-relaxed">
              <p>• El usuario es responsable de mantener la confidencialidad de su cuenta y contraseña.</p>
              <p>• El usuario se compromete a utilizar los productos adquiridos de manera legal y conforme a los términos de servicio de cada plataforma.</p>
              <p>• CyberVault no se hace responsable por el uso indebido de los productos adquiridos.</p>
            </div>
          </section>

          <section>
            <h2 className="font-headline-sm text-headline-sm text-primary mb-4">7. Propiedad Intelectual</h2>
            <p className="text-body-md text-body-md text-onSurfaceVariant leading-relaxed">
              Todos los productos digitales son propiedad de sus respectivos desarrolladores y editores. CyberVault actúa como distribuidor autorizado y no reclama propiedad sobre los productos que vende.
            </p>
          </section>

          <section>
            <h2 className="font-headline-sm text-headline-sm text-primary mb-4">8. Modificaciones de los Términos</h2>
            <p className="text-body-md text-body-md text-onSurfaceVariant leading-relaxed">
              CyberVault se reserva el derecho de modificar estos términos y condiciones en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio web.
            </p>
          </section>

          <section>
            <h2 className="font-headline-sm text-headline-sm text-primary mb-4">9. Contacto</h2>
            <p className="text-body-md text-body-md text-onSurfaceVariant leading-relaxed mb-4">
              Para cualquier pregunta o consulta sobre estos términos y condiciones, por favor contáctanos a través de:
            </p>
            <div className="space-y-2 text-body-md text-body-md text-onSurfaceVariant">
              <p>• WhatsApp: Número disponible en el sitio</p>
              <p>• Email: [Tu email de contacto]</p>
            </div>
          </section>

          <section className="mt-8 pt-6 border-t border-outlineVariant/30">
            <p className="text-sm text-onSurfaceVariant">
              Última actualización: Junio 2026
            </p>
          </section>
        </div>

        <div className="mt-8">
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
            Volver a la Tienda
          </Link>
        </div>
      </div>
    </main>
  )
}

export default TermsPage
