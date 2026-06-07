import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { getFeaturedProducts, productMatchesPlatform } from '../utils/productHelpers'
import ProductCard from '../components/ProductCard'

const HERO_DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1920&auto=format&fit=crop'

const StorePage = () => {
  const { products, config, categories, setViewMode, consultWhatsApp } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentSlide, setCurrentSlide] = useState(0)

  const featuredGames = getFeaturedProducts(products, config.heroFeaturedIds).map((p) => ({
      name: p.name,
      platform: p.platform,
      description: p.category ? `Categoría: ${p.category}` : '',
      price: p.price,
      originalPrice: null,
      image: p.img || HERO_DEFAULT_IMAGE,
    }))

  useEffect(() => {
    setCurrentSlide(0)
  }, [featuredGames.length])

  useEffect(() => {
    if (featuredGames.length === 0) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredGames.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [featuredGames.length])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlatform = productMatchesPlatform(product.platform, selectedPlatform)
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesPlatform && matchesCategory
  })

  return (
    <>
      {featuredGames.length > 0 && (
      <section className="relative h-[550px] md:h-[650px] w-full overflow-hidden mb-12 group">
        {/* Slides */}
        {featuredGames.map((game, index) => (
          <div
            key={index}
            className={`
              absolute inset-0 transition-all duration-[1.5s] ease-in-out
              ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}
            `}
          >
            {/* Imagen de fondo */}
            <img
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s]"
              src={game.image}
              alt={game.name}
              style={{
                transform: index === currentSlide ? 'scale(1)' : 'scale(1.1)',
              }}
            />
            
            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/70 to-surface/30"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-surface/90 via-surface/50 to-transparent"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(0,0,0,0.7)_100%)]"></div>
          </div>
        ))}

        {/* Contenido del Slide Actual */}
        <div className="relative z-20 h-full max-w-container-max mx-auto px-gutter flex items-end pb-16 md:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end w-full">
            {/* Información del juego */}
            <div className="space-y-4 md:space-y-6">
              {/* Badge de plataforma (NUEVO) */}
              <div className="flex items-center gap-2 animate-fade-in-up">
                <span className="material-symbols-outlined text-primary text-xl">stadia_controller</span>
                <span className="inline-flex items-center gap-2 bg-surface-container-high/80 backdrop-blur-sm text-on-surface border border-outline-variant/50 px-3 py-1.5 rounded-full text-sm font-medium">
                  {featuredGames[currentSlide].platform}
                </span>
              </div>

              {/* Nombre del juego */}
              <h1 className="font-display-lg text-[40px] md:text-[56px] lg:text-[64px] text-white leading-[1.1] tracking-tight animate-fade-in-up">
                {featuredGames[currentSlide].name}
              </h1>

              {/* Descripción */}
              <p className="font-body-lg text-on-surface-variant/80 max-w-xl leading-relaxed text-base md:text-lg animate-fade-in-up">
                {featuredGames[currentSlide].description}
              </p>

              {/* Precios y botón */}
              <div className="flex flex-wrap items-center gap-4 pt-2 animate-fade-in-up">
                {/* Precio actual */}
                <div className="flex items-baseline gap-2">
                  <span className="text-[32px] md:text-[40px] font-bold text-white leading-none">
                    {featuredGames[currentSlide].price}
                  </span>
                  {featuredGames[currentSlide].originalPrice && (
                    <span className="text-lg md:text-xl text-on-surface-variant/60 line-through">
                      {featuredGames[currentSlide].originalPrice}
                    </span>
                  )}
                </div>

                {config.waNumber && (
                <button
                  type="button"
                  onClick={() => consultWhatsApp(featuredGames[currentSlide].name)}
                  className="group inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-3.5 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(37,211,102,0.4)]"
                >
                  <svg 
                    className="w-6 h-6 group-hover:scale-110 transition-transform" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Consultar por WhatsApp
                </button>
                )}
              </div>
            </div>

            {/* Espacio para mantener layout */}
            <div className="hidden lg:block"></div>
          </div>
        </div>

        {/* Indicadores de slide (dots) */}
        <div className="absolute bottom-8 right-8 z-30 flex gap-2">
          {featuredGames.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`
                w-3 h-3 rounded-full transition-all duration-300
                ${index === currentSlide 
                  ? 'bg-primary scale-125 shadow-[0_0_10px_rgba(190,198,224,0.6)]' 
                  : 'bg-white/30 hover:bg-white/60'
                }
              `}
              aria-label={`Ver ${featuredGames[index].name}`}
            />
          ))}
        </div>

        {/* Barra de progreso */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-30">
          <div 
            className="h-full bg-gradient-to-r from-primary to-neonBlue transition-all duration-[6s] linear"
            style={{ width: `${((currentSlide + 1) / featuredGames.length) * 100}%` }}
          ></div>
        </div>
      </section>
      )}

      {/* Catálogo */}
      <div className="max-w-container-max mx-auto px-gutter grid grid-cols-1 md:grid-cols-12 gap-8 mb-24">
        {/* Sidebar Filters - sin cambios */}
        <aside className="md:col-span-3">
          <div className="glass-panel p-6 rounded-xl sticky top-8 space-y-8">
            <h3 className="font-headline-sm text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">filter_list</span> 
              Filtros
            </h3>
            
            {/* Plataforma */}
            <div>
              <label className="font-label-caps text-on-surface-variant block mb-4">PLATAFORMA</label>
              <div className="space-y-1">
                {['all', 'PC', 'PS4', 'Xbox', 'Nintendo', 'Steam', 'Gift Cards'].map((platform) => (
                  <label 
                    key={platform} 
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200
                      ${selectedPlatform === platform 
                        ? 'bg-primary/10 border border-primary/20' 
                        : 'hover:bg-white/5 border border-transparent'
                      }
                    `}
                  >
                    <input
                      className="sr-only"
                      type="radio"
                      name="platform"
                      value={platform}
                      checked={selectedPlatform === platform}
                      onChange={(e) => setSelectedPlatform(e.target.value)}
                    />
                    <div className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                      transition-all duration-200
                      ${selectedPlatform === platform 
                        ? 'border-primary bg-primary' 
                        : 'border-outline-variant'
                      }
                    `}>
                      {selectedPlatform === platform && (
                        <div className="w-2 h-2 rounded-full bg-on-primary"></div>
                      )}
                    </div>
                    <span className={`
                      text-body-md transition-colors
                      ${selectedPlatform === platform 
                        ? 'text-primary font-medium' 
                        : 'text-on-surface'
                      }
                    `}>
                      {platform === 'all' ? 'Todas las plataformas' : platform}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Separador */}
            <div className="border-t border-outline-variant/20"></div>

            {/* Categoría */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-label-caps text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">category</span>
                CATEGORÍA
              </label>
              <div className="relative">
                <select
                  className="
                    w-full appearance-none
                    bg-surface-container-high
                    border border-outline-variant
                    rounded-xl px-4 py-3.5 pr-12
                    text-body-md text-on-surface
                    transition-all duration-300
                    focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                    hover:border-outline
                    cursor-pointer
                  "
                  style={{ colorScheme: 'dark' }}
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">Todas las categorías</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="absolute right-0 top-0 h-full w-12 flex items-center justify-center pointer-events-none">
                  <span className="material-symbols-outlined text-on-surface-variant transition-transform duration-300">
                    unfold_more
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid - sin cambios */}
        <div className="md:col-span-9">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h2 className="font-headline-md text-on-surface">Catálogo de Juegos</h2>
            
            <div className="flex items-center gap-1.5 bg-surface-container-high p-1.5 rounded-xl border border-outline-variant/30">
              <button
                className={`
                  p-2.5 rounded-lg transition-all duration-200
                  ${config.viewMode === 'grid' 
                    ? 'bg-onPrimaryFixed text-on-primary shadow-lg shadow-primary/20' 
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }
                `}
                onClick={() => setViewMode('grid')}
              >
                <span className="material-symbols-outlined">grid_view</span>
              </button>
              <button
                className={`
                  p-2.5 rounded-lg transition-all duration-200
                  ${config.viewMode === 'list' 
                    ? 'bg-onPrimaryFixed text-on-primary shadow-lg shadow-primary/20' 
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }
                `}
                onClick={() => setViewMode('list')}
              >
                <span className="material-symbols-outlined">view_list</span>
              </button>
            </div>
          </div>

          <div className={
            config.viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-4'
          }>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} viewMode={config.viewMode} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-6xl text-outline-variant mb-4 block">
                {products.length === 0 ? 'inventory_2' : 'search_off'}
              </span>
              <h3 className="font-headline-sm text-on-surface mb-2">
                {products.length === 0 ? 'Catálogo vacío' : 'Sin resultados'}
              </h3>
              <p className="text-on-surface-variant mb-6">
                {products.length === 0
                  ? 'Aún no hay juegos cargados. Agrega productos desde el panel de administración o conecta tu base de datos.'
                  : 'No se encontraron productos que coincidan con los filtros.'}
              </p>
              {products.length > 0 && (
                <button
                  onClick={() => {
                    setSelectedPlatform('all')
                    setSelectedCategory('all')
                  }}
                  className="bg-primary text-on-primary px-6 py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(190,198,224,0.4)] transition-all duration-300"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default StorePage