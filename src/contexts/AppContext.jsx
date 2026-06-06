import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import * as sheetdb from '../api/sheetdb'
import {
  parseHeroFeaturedIds,
  HERO_MAX,
  str,
  deriveCategoriesFromProducts,
  mergeCategoryLists,
} from '../utils/productHelpers'

const AppContext = createContext()

const CACHE_VERSION = '2'
const SHEETDB_AUTO_LOAD = import.meta.env.VITE_SHEETDB_AUTO_LOAD === 'true'

/** Limpia caché de catálogo una vez (productos de muestra en localStorage) */
const purgeLegacyCatalogCache = () => {
  if (localStorage.getItem('cv_cache_version') === CACHE_VERSION) return
  ;['cv_products', 'cv_orders', 'cv_categories', 'cv_cart'].forEach((key) =>
    localStorage.removeItem(key)
  )
  localStorage.setItem('cv_cache_version', CACHE_VERSION)
}

purgeLegacyCatalogCache()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  // Loading states
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [products, setProducts] = useState([])

  // Estado de configuración
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('cv_config')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        return {
          waNumber: parsed.waNumber ?? '',
          isAdmin: Boolean(parsed.isAdmin),
          viewMode: parsed.viewMode ?? 'grid',
          heroFeaturedIds: parseHeroFeaturedIds(parsed.heroFeaturedIds),
          customCategories: Array.isArray(parsed.customCategories)
            ? parsed.customCategories.map((c) => str(c))
            : [],
        }
      } catch {
        /* usar valores por defecto */
      }
    }
    return {
      waNumber: '',
      isAdmin: false,
      viewMode: 'grid',
      heroFeaturedIds: [],
      customCategories: [],
    }
  })

  const [cart, setCart] = useState([])
  const [orders, setOrders] = useState([])
  const [categories, setCategories] = useState([])

  const loadFromDatabase = useCallback(async () => {
    setLoading(true)
    setError(null)
    sheetdb.invalidateCache()

    try {
      const productsData = await sheetdb.getProducts()
      const loadedProducts = Array.isArray(productsData) ? productsData : []

      const [ordersData, configData, categoriesData] = await Promise.all([
        sheetdb.getOrders(),
        sheetdb.getConfig(),
        sheetdb.getCategories(),
      ])

      const loadedCategories = Array.isArray(categoriesData) ? categoriesData : []

      setProducts(loadedProducts)
      setOrders(Array.isArray(ordersData) ? ordersData : [])
      setConfig((prev) => {
        const next = {
          ...prev,
          ...(configData?.waNumber ? { waNumber: configData.waNumber } : {}),
          ...(configData?.heroFeaturedIds?.length
            ? { heroFeaturedIds: parseHeroFeaturedIds(configData.heroFeaturedIds) }
            : {}),
        }
        setCategories(
          loadedCategories.length > 0
            ? loadedCategories
            : mergeCategoryLists(
                deriveCategoriesFromProducts(loadedProducts),
                next.customCategories
              )
        )
        return next
      })

      if (loadedProducts.length === 0) {
        setError(
          'Google Sheets conectado, pero no hay productos. Agrega filas con columnas: id, name, platform, price, img, category.'
        )
      }
    } catch (err) {
      console.error('Error loading data from database:', err)
      setProducts([])
      setError(
        'No se pudo cargar productos desde Google Sheets. Revisa VITE_SHEETDB_API_ID y las columnas en la hoja.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const savedConfig = localStorage.getItem('cv_config')
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig)
        if (parsed.waNumber === '5491112345678') {
          parsed.waNumber = ''
          localStorage.setItem('cv_config', JSON.stringify(parsed))
          setConfig((prev) => ({ ...prev, waNumber: '' }))
        }
      } catch {
        /* ignorar config corrupta */
      }
    }

    if (SHEETDB_AUTO_LOAD) {
      loadFromDatabase()
    } else {
      setProducts([])
      setOrders([])
      setCategories([])
      setLoading(false)
    }
  }, [loadFromDatabase])

  // Guardar en localStorage cuando cambian los productos
  useEffect(() => {
    localStorage.setItem('cv_products', JSON.stringify(products))
  }, [products])

  // Guardar en localStorage cuando cambia la configuración
  useEffect(() => {
    localStorage.setItem('cv_config', JSON.stringify(config))
  }, [config])

  // Guardar en localStorage cuando cambia el carrito
  useEffect(() => {
    localStorage.setItem('cv_cart', JSON.stringify(cart))
  }, [cart])

  // Guardar en localStorage cuando cambian los pedidos
  useEffect(() => {
    try {
      localStorage.setItem('cv_orders', JSON.stringify(orders))
    } catch (error) {
      console.error('Error al guardar pedidos en localStorage:', error)
      // Si hay error de cuota, limpiar pedidos antiguos
      if (error.name === 'QuotaExceededError') {
        console.warn('LocalStorage lleno, limpiando pedidos antiguos...')
        // Mantener solo los últimos 10 pedidos (incluyendo el más reciente)
        const recentOrders = orders.slice(-10)
        try {
          localStorage.setItem('cv_orders', JSON.stringify(recentOrders))
          // Solo actualizar el estado si logramos guardar
          setOrders(recentOrders)
        } catch (e) {
          console.error('No se pudo guardar ni con pedidos reducidos:', e)
          // Si aún falla, intentar con menos pedidos
          const fewerOrders = orders.slice(-5)
          try {
            localStorage.setItem('cv_orders', JSON.stringify(fewerOrders))
            setOrders(fewerOrders)
          } catch (e2) {
            console.error('No se pudo guardar ni con 5 pedidos:', e2)
          }
        }
      }
    }
  }, [orders])

  // Guardar en localStorage cuando cambian las categorías
  useEffect(() => {
    localStorage.setItem('cv_categories', JSON.stringify(categories))
  }, [categories])

  // Funciones para productos
  const addProduct = async (product) => {
    const newProduct = { ...product, id: Date.now() }
    setProducts([...products, newProduct])
    
    // Intentar guardar en SheetDB
    try {
      await sheetdb.addProduct(newProduct)
    } catch (err) {
      console.error('Error saving product to SheetDB:', err)
    }
  }

  const updateProduct = async (id, updatedProduct) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updatedProduct } : p))
    // También actualizar el precio en el carrito si el producto está allí
    setCart(cart.map(item => item.id === id ? { ...item, ...updatedProduct } : item))
    
    // Intentar actualizar en SheetDB
    try {
      await sheetdb.updateProduct(id, updatedProduct)
    } catch (err) {
      console.error('Error updating product in SheetDB:', err)
    }
  }

  const deleteProduct = async (id) => {
    setProducts(products.filter(p => p.id !== id))
    
    // Intentar eliminar de SheetDB
    try {
      await sheetdb.deleteProduct(id)
    } catch (err) {
      console.error('Error deleting product from SheetDB:', err)
    }
  }

  // Función para importar productos masivamente
  const importProducts = async (productsData) => {
    const newProducts = productsData.map((product, index) => ({
      ...product,
      id: Date.now() + index
    }))
    setProducts([...products, ...newProducts])
    
    // Intentar importar a SheetDB
    try {
      await sheetdb.importProducts(newProducts)
    } catch (err) {
      console.error('Error importing products to SheetDB:', err)
    }
    
    return newProducts.length
  }

  // Funciones para categorías
  const addCategory = async (category) => {
    const name = str(category).trim()
    if (!name || categories.includes(name)) return

    const customCategories = mergeCategoryLists(config.customCategories, [name])
    setConfig({ ...config, customCategories })
    setCategories(mergeCategoryLists(categories, [name]))

    try {
      await sheetdb.addCategory(name)
    } catch (err) {
      console.warn('Categoría guardada localmente (sin pestaña categories en Sheets):', err.message)
    }
  }

  const deleteCategory = async (category) => {
    const name = str(category).trim()
    const match = (value) => str(value).toLowerCase() === name.toLowerCase()
    const affected = products.filter((p) => match(p.category))

    const updatedProducts = products.map((p) =>
      match(p.category) ? { ...p, category: '' } : p
    )
    setProducts(updatedProducts)
    setCart(cart.map((item) => (match(item.category) ? { ...item, category: '' } : item)))

    for (const product of affected) {
      try {
        await sheetdb.updateProduct(product.id, { category: '' })
      } catch (err) {
        console.error('Error updating product category in SheetDB:', err)
      }
    }

    const customCategories = (config.customCategories || []).filter((c) => !match(c))
    setConfig({ ...config, customCategories })
    setCategories(
      mergeCategoryLists(deriveCategoriesFromProducts(updatedProducts), customCategories)
    )

    try {
      await sheetdb.deleteCategory(name)
    } catch {
      /* Sin pestaña categories: basta con limpiar columna category en productos */
    }

    return affected.length
  }

  // Funciones para el carrito
  const addToCart = (product) => {
    setCart([...cart, { ...product, cartId: Date.now() }])
  }

  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId))
  }

  const updateCartQuantity = (cartId, quantity) => {
    setCart(cart.map(item => item.cartId === cartId ? { ...item, quantity } : item))
  }

  const clearCart = () => {
    setCart([])
  }

  // Función para WhatsApp
  const consultWhatsApp = (itemName) => {
    const msg = encodeURIComponent(`Hola! Me interesa comprar: ${itemName}. Me podrías dar más información?`)
    window.open(`https://wa.me/${config.waNumber}?text=${msg}`, '_blank')
  }

  // Funciones de admin
  const login = (username, password) => {
    if (username === 'admin' && password === 'admin123') {
      setConfig({ ...config, isAdmin: true })
      return true
    }
    return false
  }

  const logout = () => {
    setConfig({ ...config, isAdmin: false })
  }

  const persistConfig = async (nextConfig) => {
    setConfig(nextConfig)
    try {
      await sheetdb.updateConfig({
        waNumber: nextConfig.waNumber,
        heroFeaturedIds: nextConfig.heroFeaturedIds ?? [],
      })
    } catch (err) {
      console.error('Error updating config in SheetDB:', err)
    }
  }

  const updateWaNumber = async (number) => {
    await persistConfig({ ...config, waNumber: number })
  }

  const setHeroFeaturedIds = async (ids) => {
    const heroFeaturedIds = parseHeroFeaturedIds(ids)
    await persistConfig({ ...config, heroFeaturedIds })
  }

  const toggleHeroProduct = async (productId) => {
    const id = String(productId)
    const current = parseHeroFeaturedIds(config.heroFeaturedIds)
    if (current.includes(id)) {
      await setHeroFeaturedIds(current.filter((x) => x !== id))
      return
    }
    if (current.length >= HERO_MAX) return
    await setHeroFeaturedIds([...current, id])
  }

  const setViewMode = (mode) => {
    setConfig({ ...config, viewMode: mode })
  }

  // Función para generar código de pedido único
  const generateOrderCode = () => {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `CV-${timestamp}-${random}`
  }

  // Función para crear pedido
  const createOrder = async (orderData) => {
    const newOrder = {
      id: Date.now(),
      orderCode: generateOrderCode(),
      status: 'pending', // pending, confirmed, completed, cancelled
      items: orderData.items,
      customerInfo: orderData.customerInfo,
      installationType: orderData.installationType, // 'self' or 'local'
      paymentMethod: orderData.paymentMethod,
      total: orderData.total,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    console.log('Creando pedido:', newOrder)
    setOrders([...orders, newOrder])
    clearCart()
    
    // Guardar en localStorage (SheetDB no maneja bien pedidos complejos)
    try {
      localStorage.setItem('cv_orders', JSON.stringify([...orders, newOrder]))
    } catch (error) {
      console.error('Error saving order to localStorage:', error)
    }
    
    // Intentar guardar en SheetDB (opcional, puede fallar)
    try {
      await sheetdb.addOrder(newOrder)
    } catch (err) {
      console.error('Error saving order to SheetDB (using localStorage instead):', err)
    }
    
    return newOrder
  }

  // Función para actualizar estado de pedido (admin)
  const updateOrderStatus = async (orderId, status) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status, updatedAt: new Date().toISOString() }
        : order
    ))
    
    // Guardar en localStorage
    try {
      localStorage.setItem('cv_orders', JSON.stringify(orders.map(order => 
        order.id === orderId 
          ? { ...order, status, updatedAt: new Date().toISOString() }
          : order
      )))
    } catch (error) {
      console.error('Error saving order status to localStorage:', error)
    }
    
    // Intentar actualizar en SheetDB (opcional)
    try {
      const order = orders.find(o => o.id === orderId)
      if (order) {
        await sheetdb.updateOrder(orderId, { ...order, status, updatedAt: new Date().toISOString() })
      }
    } catch (err) {
      console.error('Error updating order in SheetDB (using localStorage instead):', err)
    }
  }

  // Función para obtener pedido por código
  const getOrderByCode = (orderCode) => {
    return orders.find(order => order.orderCode === orderCode)
  }

  const value = {
    products,
    config,
    cart,
    orders,
    categories,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    importProducts,
    addCategory,
    deleteCategory,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    consultWhatsApp,
    login,
    logout,
    updateWaNumber,
    setHeroFeaturedIds,
    toggleHeroProduct,
    setViewMode,
    createOrder,
    updateOrderStatus,
    getOrderByCode,
    loadFromDatabase,
    sheetdbEnabled: SHEETDB_AUTO_LOAD,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
