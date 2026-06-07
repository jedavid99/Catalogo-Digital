import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { getFeaturedProducts, productMatchesPlatform } from '../utils/productHelpers'
import HeroSection from '../components/HeroSection'
import CatalogSection from '../components/CatalogSection'

const HERO_DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1920&auto=format&fit=crop'

const StorePage = () => {
  const { products, config, categories, setViewMode, consultWhatsApp } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 9

  // Helper function to generate emotional taglines based on game name
  

  const featuredGames = getFeaturedProducts(products, config.heroFeaturedIds).map((p) => ({
      name: p.name,
      platform: p.platform,
      description: p.category ? `Categoría: ${p.category}` : '',
      tagline: 'Más de 100 horas de juego abierto',
      price: p.price,
      originalPrice: null,
      rating: p.rating || 4.8,
      reviewCount: p.reviewCount || 2500,
      isBestseller: p.isBestseller || false,
      isExclusive: p.isExclusive || false,
      image: p.img || HERO_DEFAULT_IMAGE,
    }))


  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlatform = productMatchesPlatform(product.platform, selectedPlatform)
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesPlatform && matchesCategory
  })

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedPlatform, selectedCategory])

  // Calcular productos paginados
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const paginatedProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)

  return (
    <>
      <HeroSection 
        featuredGames={featuredGames}
        consultWhatsApp={consultWhatsApp}
        config={config}
      />

      <CatalogSection
        filteredProducts={filteredProducts}
        paginatedProducts={paginatedProducts}
        selectedPlatform={selectedPlatform}
        setSelectedPlatform={setSelectedPlatform}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        config={config}
        setViewMode={setViewMode}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        products={products}
      />
    </>
  )
}

export default StorePage