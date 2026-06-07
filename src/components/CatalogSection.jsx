import FilterSidebar from './FilterSidebar'
import ProductGridHeader from './ProductGridHeader'
import Pagination from './Pagination'
import EmptyState from './EmptyState'
import ProductCard from './ProductCard'

const CatalogSection = ({
  filteredProducts,
  paginatedProducts,
  selectedPlatform,
  setSelectedPlatform,
  selectedCategory,
  setSelectedCategory,
  categories,
  config,
  setViewMode,
  currentPage,
  totalPages,
  setCurrentPage,
  products
}) => {
  const handleClearFilters = () => {
    setSelectedPlatform('all')
    setSelectedCategory('all')
  }

  return (
    <div className="max-w-container-max mx-auto px-gutter grid grid-cols-1 md:grid-cols-12 gap-8 mb-24">
      {/* Sidebar Filters */}
      <FilterSidebar
        selectedPlatform={selectedPlatform}
        setSelectedPlatform={setSelectedPlatform}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
      />

      {/* Product Grid */}
      <div className="md:col-span-9">
        <ProductGridHeader
          viewMode={config.viewMode}
          setViewMode={setViewMode}
        />

        <div className={
          config.viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
        }>
          {paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} viewMode={config.viewMode} />
          ))}
        </div>

        {/* Paginación */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />

        {/* Estado vacío */}
        {filteredProducts.length === 0 && (
          <EmptyState
            products={products}
            onClearFilters={handleClearFilters}
          />
        )}
      </div>
    </div>
  )
}

export default CatalogSection
