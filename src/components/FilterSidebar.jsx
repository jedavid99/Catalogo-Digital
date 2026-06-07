const FilterSidebar = ({ 
  selectedPlatform, 
  setSelectedPlatform, 
  selectedCategory, 
  setSelectedCategory, 
  categories 
}) => {
  const platforms = ['all', 'PC', 'PS4', 'PS3', 'PS5', 'Licencias']

  return (
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
            {platforms.map((platform) => (
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
  )
}

export default FilterSidebar
