import axios from 'axios'
import { parseHeroFeaturedIds, str } from '../utils/productHelpers'

const API_BASE = import.meta.env.VITE_SHEETDB_API_URL || 'https://sheetdb.io/api/v1'
const API_ID = import.meta.env.VITE_SHEETDB_API_ID
/** Nombre de la pestaña de productos (vacío = hoja principal de Google Sheets) */
const PRODUCTS_SHEET = (import.meta.env.VITE_SHEETDB_PRODUCTS_SHEET || '').trim()

/**
 * Pestañas extra que SÍ existen en tu Google Sheet (separadas por coma).
 * Vacío = no se llama a /orders, /config ni /categories (evita 404 en consola).
 * Ejemplo cuando las crees: orders,config,categories
 */
const EXTRA_SHEETS = new Set(
  (import.meta.env.VITE_SHEETDB_EXTRA_SHEETS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
)

const hasExtraSheet = (name) => EXTRA_SHEETS.has(name.toLowerCase())

if (!API_ID) {
  console.warn('VITE_SHEETDB_API_ID no está configurado. Usando localStorage como fallback.')
}

const api = axios.create({
  baseURL: `${API_BASE}/${API_ID}`,
  headers: {
    'Content-Type': 'application/json',
  },
})

const cache = {
  products: null,
  orders: null,
  config: null,
  categories: null,
  timestamp: null,
  CACHE_DURATION: 5 * 60 * 1000,
}

const isCacheValid = () =>
  cache.timestamp && Date.now() - cache.timestamp < cache.CACHE_DURATION

export const invalidateCache = () => {
  cache.products = null
  cache.orders = null
  cache.config = null
  cache.categories = null
  cache.timestamp = null
}

/** GET sin lanzar error en 404 (evita ruido en consola del navegador) */
const getSheet = async (path) => {
  const response = await api.get(path, {
    validateStatus: (status) => status === 200 || status === 404,
  })
  if (response.status === 404) return null
  return response.data
}

/** Solo hoja principal o pestaña de productos — nunca mezcla con otras pestañas */
const fetchProductsRaw = async () => {
  if (PRODUCTS_SHEET) {
    const named = await getSheet(`/${PRODUCTS_SHEET}`)
    if (named != null) return named
  }
  const main = await getSheet('')
  if (main != null) return main
  if (hasExtraSheet('products')) {
    const productsTab = await getSheet('/products')
    if (productsTab != null) return productsTab
  }
  return []
}

/** Pestaña extra configurada en .env; si no está listada, no hace petición HTTP */
const fetchOptionalSheet = async (sheetName) => {
  if (!hasExtraSheet(sheetName)) return null
  return getSheet(`/${sheetName}`)
}

const normalizeProduct = (row, index = 0) => {
  const rawId = row.id ?? row.ID ?? index + 1
  const id = Number(rawId)
  return {
    id: Number.isFinite(id) && id > 0 ? id : rawId,
    name: String(row.name ?? row.Name ?? '').trim(),
    platform: String(row.platform ?? row.Platform ?? '').trim(),
    price: String(row.price ?? row.Price ?? '').trim(),
    img: String(row.img ?? row.Img ?? row.image ?? '').trim(),
    category: String(row.category ?? row.Category ?? '').trim(),
  }
}

const normalizeProducts = (data) => {
  if (!Array.isArray(data)) return []
  return data.map((row, i) => normalizeProduct(row, i)).filter((p) => p.name)
}

const parseJsonField = (value, fallback = {}) => {
  if (value == null) return fallback
  if (typeof value === 'object') return value
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

const normalizeOrder = (row) => {
  const customerInfo = parseJsonField(row.customerInfo, {})
  const items = parseJsonField(row.items, [])
  return {
    id: row.id != null ? Number(row.id) || row.id : Date.now(),
    orderCode: str(row.orderCode ?? row.id ?? ''),
    status: str(row.status || 'pending'),
    items: Array.isArray(items) ? items : [],
    customerInfo: {
      name: str(customerInfo.name),
      email: str(customerInfo.email),
      whatsapp: str(customerInfo.whatsapp),
    },
    installationType: row.installationType,
    paymentMethod: row.paymentMethod,
    total: str(row.total),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}

const normalizeOrders = (data) => {
  if (!Array.isArray(data)) return []
  return data
    .filter((row) => row.orderCode || row.customerInfo || row.status)
    .map(normalizeOrder)
}

const normalizeCategories = (data) => {
  if (!Array.isArray(data)) return []
  return data
    .map((c) => (typeof c === 'string' ? c : c?.name))
    .filter(Boolean)
}

// Productos
export const getProducts = async (useCache = true) => {
  if (!API_ID) return []

  try {
    if (useCache && isCacheValid() && cache.products) {
      return cache.products
    }

    const data = await fetchProductsRaw()
    cache.products = normalizeProducts(data)
    cache.timestamp = Date.now()
    return cache.products
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

export const addProduct = async (product) => {
  if (!API_ID) return null

  try {
    const path = PRODUCTS_SHEET ? `/${PRODUCTS_SHEET}` : ''
    const response = await api.post(path, product)
    invalidateCache()
    return response.data
  } catch (error) {
    console.error('Error adding product:', error)
    throw error
  }
}

const productSheetPath = () => (PRODUCTS_SHEET ? `/${PRODUCTS_SHEET}` : '')

export const updateProduct = async (id, product) => {
  if (!API_ID) return null

  try {
    const base = productSheetPath()
    const paths = [`${base}/id/${id}`, `/products/id/${id}`, `/id/${id}`]
    for (const path of paths) {
      try {
        const response = await api.put(path, product)
        invalidateCache()
        return response.data
      } catch (error) {
        if (error.response?.status !== 404) throw error
      }
    }
    throw new Error('No se encontró el producto en SheetDB')
  } catch (error) {
    console.error('Error updating product:', error)
    throw error
  }
}

export const deleteProduct = async (id) => {
  if (!API_ID) return null

  try {
    const base = productSheetPath()
    const paths = [`${base}/id/${id}`, `/products/id/${id}`, `/id/${id}`]
    for (const path of paths) {
      try {
        const response = await api.delete(path)
        invalidateCache()
        return response.data
      } catch (error) {
        if (error.response?.status !== 404) throw error
      }
    }
    throw new Error('No se encontró el producto en SheetDB')
  } catch (error) {
    console.error('Error deleting product:', error)
    throw error
  }
}

export const importProducts = async (products) => {
  if (!API_ID) return null

  try {
    const path = PRODUCTS_SHEET ? `/${PRODUCTS_SHEET}` : ''
    const response = await api.post(path, products)
    invalidateCache()
    return response.data
  } catch (error) {
    console.error('Error importing products:', error)
    throw error
  }
}

// Pedidos
export const getOrders = async (useCache = true) => {
  if (!API_ID) return []

  try {
    if (useCache && isCacheValid() && cache.orders) {
      return cache.orders
    }

    const data = await fetchOptionalSheet('orders')
    cache.orders = data ? normalizeOrders(data) : []
    cache.timestamp = Date.now()
    return cache.orders
  } catch (error) {
    console.error('Error fetching orders:', error)
    return []
  }
}

export const addOrder = async (order) => {
  if (!API_ID) return null

  try {
    // Serializar y reducir datos para evitar error 413 (Content Too Large)
    const minimalOrder = {
      id: order.id,
      orderCode: order.orderCode,
      status: order.status,
      items: JSON.stringify(order.items),
      customerInfo: JSON.stringify({
        name: order.customerInfo.name,
        email: order.customerInfo.email,
        phone: order.customerInfo.phone
      }),
      installationType: order.installationType,
      paymentMethod: order.paymentMethod,
      total: order.total,
      createdAt: order.createdAt
    }
    const response = await api.post('/orders', minimalOrder)
    invalidateCache()
    return response.data
  } catch (error) {
    console.error('Error adding order:', error)
    throw error
  }
}

export const updateOrder = async (id, order) => {
  if (!API_ID) return null

  try {
    // Serializar datos complejos para evitar error 413 (Content Too Large)
    const serializedOrder = {
      ...order,
      items: JSON.stringify(order.items),
      customerInfo: JSON.stringify(order.customerInfo)
    }
    const response = await api.put(`/orders/id/${id}`, serializedOrder)
    invalidateCache()
    return response.data
  } catch (error) {
    console.error('Error updating order:', error)
    throw error
  }
}

// Configuración
export const getConfig = async (useCache = true) => {
  if (!API_ID) return { waNumber: '', heroFeaturedIds: [] }

  try {
    if (useCache && isCacheValid() && cache.config) {
      return cache.config
    }

    const data = await fetchOptionalSheet('config')
    const row = Array.isArray(data) ? data[0] : data
    cache.config = row
      ? {
          waNumber: row.waNumber != null ? str(row.waNumber) : '',
          heroFeaturedIds: parseHeroFeaturedIds(row.heroFeaturedIds ?? row.heroProductIds),
        }
      : { waNumber: '', heroFeaturedIds: [] }
    cache.timestamp = Date.now()
    return cache.config
  } catch (error) {
    console.error('Error fetching config:', error)
    return { waNumber: '', heroFeaturedIds: [] }
  }
}

export const updateConfig = async (config) => {
  if (!API_ID) return null

  const payload = {
    waNumber: config.waNumber ?? '',
    heroFeaturedIds: Array.isArray(config.heroFeaturedIds)
      ? config.heroFeaturedIds.join(',')
      : str(config.heroFeaturedIds ?? ''),
  }

  try {
    const response = await api.put('/config/id/1', payload)
    invalidateCache()
    return response.data
  } catch (error) {
    console.error('Error updating config:', error)
    throw error
  }
}

// Categorías
export const getCategories = async (useCache = true) => {
  if (!API_ID) return []

  try {
    if (useCache && isCacheValid() && cache.categories) {
      return cache.categories
    }

    const data = await fetchOptionalSheet('categories')
    cache.categories = data ? normalizeCategories(data) : []
    cache.timestamp = Date.now()
    return cache.categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export const addCategory = async (category) => {
  if (!API_ID || !hasExtraSheet('categories')) return null

  try {
    const response = await api.post('/categories', { name: category })
    invalidateCache()
    return response.data
  } catch (error) {
    console.error('Error adding category:', error)
    throw error
  }
}

export const deleteCategory = async (category) => {
  if (!API_ID || !hasExtraSheet('categories')) return null

  try {
    const response = await api.delete(
      `/categories/name/${encodeURIComponent(category)}`
    )
    invalidateCache()
    return response.data
  } catch (error) {
    console.error('Error deleting category:', error)
    throw error
  }
}

export const hasCategoriesSheet = () => hasExtraSheet('categories')

export const isConfigured = () => Boolean(API_ID)

export default api
