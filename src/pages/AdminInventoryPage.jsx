import { Link } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'

const AdminInventoryPage = () => {
  const { products } = useApp()
  const defaultImage = "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=600&auto=format&fit=crop"

  return (
    <div className="ml-64 pt-20 p-8 min-h-screen">
      <div className="max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-8">
          <div>
            <h2 className="font-display-lg text-headline-md text-onSurface mb-1">Catálogo de Inventario</h2>
            <p className="text-onSurfaceVariant font-body-sm">Gestión de activos digitales y claves de protocolo.</p>
          </div>
          <Link
            to="/admin"
            className="bg-primary text-on-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined">add</span>
            Nuevo Producto
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-panel p-4 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">inventory</span>
            </div>
            <div>
              <p className="text-label-caps text-onSurfaceVariant">Total SKU</p>
              <p className="text-headline-sm font-bold">{products.length}</p>
            </div>
          </div>
          <div className="glass-panel p-4 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-tertiary/10 rounded-xl flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined">key</span>
            </div>
            <div>
              <p className="text-label-caps text-on-surface-variant">Plataformas</p>
              <p className="text-headline-sm font-bold">
                {new Set(products.map((p) => p.platform).filter(Boolean)).size}
              </p>
            </div>
          </div>
          <div className="glass-panel p-4 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-error/10 rounded-xl flex items-center justify-center text-error">
              <span className="material-symbols-outlined">category</span>
            </div>
            <div>
              <p className="text-label-caps text-on-surface-variant">Categorías</p>
              <p className="text-headline-sm font-bold">
                {new Set(products.map((p) => p.category).filter(Boolean)).size}
              </p>
            </div>
          </div>
          <div className="glass-panel p-4 rounded-2xl flex items-center gap-4 border-l-4 border-l-primary">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">sell</span>
            </div>
            <div>
              <p className="text-label-caps text-on-surface-variant">Con precio</p>
              <p className="text-headline-sm font-bold">
                {products.filter((p) => p.price && p.price.toLowerCase() !== 'consultar').length}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surfaceContainer/50 border-b border-outlineVariant/30">
                <th className="px-6 py-4 text-label-caps text-onSurfaceVariant">Título / Juego</th>
                <th className="px-6 py-4 text-label-caps text-onSurfaceVariant">Plataforma</th>
                <th className="px-6 py-4 text-label-caps text-onSurfaceVariant">Categoría</th>
                <th className="px-6 py-4 text-label-caps text-onSurfaceVariant">Precio</th>
                <th className="px-6 py-4 text-label-caps text-onSurfaceVariant text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {products.length > 0 ? products.map((item) => (
                <tr key={item.id} className="hover:bg-primary/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-16 rounded overflow-hidden shadow-lg flex-shrink-0 bg-surfaceContainer">
                        <img className="w-full h-full object-cover" src={item.img || defaultImage} alt={item.name} onError={(e) => { e.target.src = defaultImage }} />
                      </div>
                      <div>
                        <p className="font-bold text-onSurface">{item.name}</p>
                        <p className="text-[10px] text-onSurfaceVariant">ID: {item.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/30">
                      {item.platform || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-onSurfaceVariant text-sm">
                    {item.category || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-onSurface">{item.price || '—'}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to="/admin"
                      className="p-2 rounded-lg hover:bg-surfaceContainerHigh text-onSurfaceVariant transition-colors inline-flex"
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </Link>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-onSurfaceVariant">
                    <span className="material-symbols-outlined text-5xl mb-3 block opacity-50">inventory_2</span>
                    No hay productos en el inventario. Agrega productos desde el panel de administración.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {products.length > 0 && (
            <div className="bg-surfaceContainerLow px-6 py-4 flex items-center justify-between border-t border-outlineVariant/30">
              <p className="text-body-sm text-onSurfaceVariant">
                Mostrando <span className="text-onSurface font-bold">{products.length}</span> producto{products.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminInventoryPage
