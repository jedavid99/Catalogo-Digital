const ProductGridHeader = ({ viewMode, setViewMode }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <h2 className="font-headline-md text-on-surface">Catálogo de Juegos</h2>
      
      <div className="flex items-center gap-1.5 bg-surface-container-high p-1.5 rounded-xl border border-outline-variant/30">
        <button
          className={`
            p-2.5 rounded-lg transition-all duration-200
            ${viewMode === 'grid' 
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
            ${viewMode === 'list' 
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
  )
}

export default ProductGridHeader
