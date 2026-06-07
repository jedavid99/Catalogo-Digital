const EmptyState = ({ products, onClearFilters }) => {
  return (
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
          onClick={onClearFilters}
          className="bg-primary text-on-primary px-6 py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(190,198,224,0.4)] transition-all duration-300"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  )
}

export default EmptyState
