import { useApp } from '../contexts/AppContext'

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const { consultWhatsApp, addToCart } = useApp()
  const isLimitedVersion = import.meta.env.VITE_DEPLOY_VERSION === 'limited'

  const defaultImage = "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=600&auto=format&fit=crop"

  if (viewMode === 'list') {
    return (
      <div className="relative group">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
        
        <div className="relative glass-panel rounded-xl overflow-hidden transition-all duration-300 flex items-center gap-6 p-4 border border-white/5 hover:border-cyan-500/30">
          {/* Image container with cyberpunk frame */}
          <div className="relative w-40 h-28 flex-shrink-0 overflow-hidden rounded-lg bg-surface-container">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500/50" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500/50" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500/50" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500/50" />
            
            <img
              src={product.img || defaultImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
              onError={(e) => e.target.src = defaultImage}
            />
            
            {/* Scanline overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 text-[10px] font-bold px-3 py-1 rounded border border-cyan-500/30 tracking-wider font-display">
                {product.platform.toUpperCase()}
              </span>
              <span className="text-body-sm text-gray-400 tracking-wide">{product.category}</span>
            </div>
            <h3 className="font-display text-lg text-white mb-1 line-clamp-1 group-hover:text-cyan-400 transition-colors">{product.name}</h3>
            <p className="text-neonGreen font-bold text-xl tracking-wider">{product.price}</p>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-col gap-2 pr-2">
            <button
              onClick={() => consultWhatsApp(product.name)}
              className="bg-gradient-to-r from-green-600/80 to-green-700/80 text-white px-5 py-2 rounded-lg font-bold flex items-center gap-2 hover:from-green-500 hover:to-green-600 active:scale-95 transition-all border border-green-500/30 shadow-lg shadow-green-500/20"
            >
              <span className="material-symbols-outlined text-sm">chat</span> CONSULTAR
            </button>
            {!isLimitedVersion && (
              <button
                onClick={() => addToCart(product)}
                className="bg-gradient-to-r from-cyan-600/80 to-blue-600/80 text-white px-5 py-2 rounded-lg font-bold flex items-center gap-2 hover:from-cyan-500 hover:to-blue-500 active:scale-95 transition-all border border-cyan-500/30 shadow-lg shadow-cyan-500/20"
              >
                <span className="material-symbols-outlined text-sm">shopping_cart</span> COMPRAR
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative group perspective-1000">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
      
      <div className="relative glass-panel rounded-2xl overflow-hidden transition-all duration-500 flex flex-col border border-white/5 hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(0,243,255,0.15)] hover:-translate-y-2">
        {/* Image container with cyberpunk frame */}
        <div className="relative h-56 overflow-hidden bg-surface-container">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-500/50 z-10" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-500/50 z-10" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-500/50 z-10" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-500/50 z-10" />
          
          {/* Platform badge */}
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-gradient-to-r from-cyan-500/90 to-purple-500/90 backdrop-blur text-white text-[10px] font-bold px-3 py-1.5 rounded border border-cyan-400/50 tracking-wider font-display shadow-lg shadow-cyan-500/30">
              {product.platform.toUpperCase()}
            </span>
          </div>
          
          {/* Image */}
          <img
            src={product.img || defaultImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
            onError={(e) => e.target.src = defaultImage}
          />
          
          {/* Scanline overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity animate-scanline" />
          
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        {/* Content */}
        <div className="p-5 flex-1 flex flex-col relative">
          {/* Decorative line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-500 tracking-wider font-display">{product.category}</span>
          </div>
          
          <h3 className="font-display text-lg text-white mb-3 line-clamp-2 group-hover:text-cyan-400 transition-colors tracking-wide">
            {product.name}
          </h3>
          
          <div className="mt-auto space-y-3">
            <p className="text-neonGreen font-bold text-2xl tracking-wider font-display">{product.price}</p>
            
            <div className="flex gap-2">
              <button
                onClick={() => consultWhatsApp(product.name)}
                className="flex-1 bg-gradient-to-r from-green-600/80 to-green-700/80 text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:from-green-500 hover:to-green-600 active:scale-95 transition-all border border-green-500/30 shadow-lg shadow-green-500/20 text-sm tracking-wider"
              >
                <span className="material-symbols-outlined text-sm">chat</span> CONSULTAR
              </button>
              {!isLimitedVersion && (
                <button
                  onClick={() => addToCart(product)}
                  className="flex-1 bg-gradient-to-r from-cyan-600/80 to-blue-600/80 text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:from-cyan-500 hover:to-blue-500 active:scale-95 transition-all border border-cyan-500/30 shadow-lg shadow-cyan-500/20 text-sm tracking-wider"
                >
                  <span className="material-symbols-outlined text-sm">shopping_cart</span> COMPRAR
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
