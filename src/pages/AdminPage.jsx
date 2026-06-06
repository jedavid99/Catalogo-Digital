import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import {
  HERO_MAX,
  str,
  isConsultPrice,
  productMatchesPlatform,
  parseHeroFeaturedIds,
} from '../utils/productHelpers'

const AdminPage = () => {
  const navigate = useNavigate()
  const {
    config,
    login,
    logout,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateWaNumber,
    orders,
    updateOrderStatus,
    categories,
    addCategory,
    deleteCategory,
    importProducts,
    loadFromDatabase,
    loading,
    error,
    toggleHeroProduct,
    setHeroFeaturedIds,
  } = useApp()
  const [syncing, setSyncing] = useState(false)
  
  // Estados de autenticación y UI
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showDashboard, setShowDashboard] = useState(config.isAdmin)
  const [activeTab, setActiveTab] = useState('products') // 'products', 'orders', 'config', 'categories'
  
  // Estados de productos
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({ name: '', platform: 'PC', price: '', img: '', category: '' })
  const [productSearch, setProductSearch] = useState('')
  const [productPlatformFilter, setProductPlatformFilter] = useState('all')
  const [productCategoryFilter, setProductCategoryFilter] = useState('all')
  
  // Estados de categorías
  const [newCategory, setNewCategory] = useState('')
  
  // Estados de importación masiva
  const [showImportModal, setShowImportModal] = useState(false)
  const [importData, setImportData] = useState('')
  const [importFormat, setImportFormat] = useState('json') // 'json' or 'csv'
  
  // Estados de pedidos
  const [orderSearch, setOrderSearch] = useState('')
  const [orderStatusFilter, setOrderStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null) // Para ver detalles
  const [selectedProof, setSelectedProof] = useState(null)
  
  // Estados de modales
  const [assignPriceModal, setAssignPriceModal] = useState(false)
  const [assigningProduct, setAssigningProduct] = useState(null)
  const [newPrice, setNewPrice] = useState('')
  
  // Notificaciones
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })
  
  // Estadísticas rápidas
  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    confirmedOrders: orders.filter(o => o.status === 'confirmed').length,
    totalRevenue: orders.reduce((sum, o) => sum + (parseFloat(o.total?.replace(/[^0-9.-]/g, '')) || 0), 0)
  }
  
  // Auto-cerrar toast
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])
  
  // Helper para notificaciones
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
  }
  
  // Login/Logout
  const handleLogin = (e) => {
    e.preventDefault()
    if (login(username, password)) {
      setShowDashboard(true)
      setUsername('')
      setPassword('')
      showToast('Sesión iniciada correctamente')
    } else {
      showToast('Credenciales incorrectas', 'error')
    }
  }
  
  const handleLogout = () => {
    logout()
    setShowDashboard(false)
    navigate('/')
    showToast('Sesión cerrada')
  }
  
  // Productos
  const handleProductSubmit = (e) => {
    e.preventDefault()
    if (editingProduct) {
      updateProduct(editingProduct.id, formData)
      showToast('Producto actualizado')
    } else {
      addProduct(formData)
      showToast('Producto añadido')
    }
    setShowProductForm(false)
    setEditingProduct(null)
    setFormData({ name: '', platform: 'PC', price: '', img: '', category: categories[0] || '' })
  }
  
  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setFormData({ 
      name: product.name, 
      platform: product.platform, 
      price: product.price, 
      img: product.img || '',
      category: product.category || categories[0] || ''
    })
    setShowProductForm(true)
  }
  
  const handleDeleteProduct = (id) => {
    if (window.confirm('¿Eliminar este producto permanentemente?')) {
      deleteProduct(id)
      showToast('Producto eliminado')
    }
  }
  
  const heroSelectedIds = parseHeroFeaturedIds(config.heroFeaturedIds)

  const productPlatforms = [
    ...new Set(products.map((p) => str(p.platform)).filter(Boolean)),
  ]

  const filteredProducts = products.filter((p) => {
    const name = str(p.name)
    const matchesSearch = name.toLowerCase().includes(productSearch.toLowerCase())
    const matchesPlatform = productMatchesPlatform(p.platform, productPlatformFilter)
    const matchesCategory =
      productCategoryFilter === 'all' || str(p.category) === productCategoryFilter
    return matchesSearch && matchesPlatform && matchesCategory
  })
  
  // Handlers de categorías
  const handleAddCategory = (e) => {
    e.preventDefault()
    if (newCategory.trim()) {
      addCategory(newCategory.trim())
      setNewCategory('')
      showToast('Categoría añadida')
    }
  }
  
  const handleDeleteCategory = async (category) => {
    const msg =
      `¿Eliminar categoría "${category}"?\n\nSe quitará de todos los productos en Google Sheets.`
    if (!window.confirm(msg)) return

    const updated = await deleteCategory(category)
    showToast(
      updated > 0
        ? `Categoría eliminada (${updated} producto${updated !== 1 ? 's' : ''} actualizado${updated !== 1 ? 's' : ''})`
        : 'Categoría eliminada'
    )
  }
  
  // Handler de importación masiva
  const handleImportProducts = async (e) => {
    e.preventDefault()
    try {
      let productsToImport = []
      
      if (importFormat === 'json') {
        productsToImport = JSON.parse(importData)
      } else if (importFormat === 'csv') {
        const lines = importData.trim().split('\n')
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim())
          const product = {}
          headers.forEach((header, index) => {
            product[header] = values[index]
          })
          productsToImport.push(product)
        }
      }
      
      if (Array.isArray(productsToImport) && productsToImport.length > 0) {
        const count = await importProducts(productsToImport)
        setShowImportModal(false)
        setImportData('')
        showToast(`${count} productos importados correctamente`)
      } else {
        showToast('Formato inválido o no hay productos', 'error')
      }
    } catch (error) {
      console.error('Error al importar productos:', error)
      showToast('Error al importar productos. Verifica el formato.', 'error')
    }
  }
  
  // Pedidos
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    if (window.confirm(`¿Cambiar estado del pedido a ${newStatus === 'confirmed' ? 'Confirmado' : newStatus === 'completed' ? 'Completado' : 'Cancelado'}?`)) {
      updateOrderStatus(orderId, newStatus)
      showToast(`Pedido ${newStatus === 'confirmed' ? 'confirmado' : newStatus === 'completed' ? 'completado' : 'cancelado'}`)
    }
  }
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'confirmed': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }
  
  const getStatusLabel = (status) => {
    const labels = { pending: 'Pendiente', confirmed: 'Confirmado', completed: 'Completado', cancelled: 'Cancelado' }
    return labels[status] || status
  }
  
  const filteredOrders = orders.filter((o) => {
    const info = o.customerInfo ?? {}
    const search = orderSearch.toLowerCase()
    const matchesSearch =
      !search ||
      str(o.orderCode).toLowerCase().includes(search) ||
      str(info.name).toLowerCase().includes(search) ||
      str(info.email).toLowerCase().includes(search)
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter
    return matchesSearch && matchesStatus
  })
  
  // Configuración
  const handleSaveWaConfig = () => {
    const waInput = document.getElementById('waNumberConfig')
    updateWaNumber(waInput.value)
    showToast('Número de WhatsApp actualizado')
  }
  
  // Asignar precio a producto "Consultar"
  const handleAssignPrice = (product) => {
    setAssigningProduct(product)
    setNewPrice('')
    setAssignPriceModal(true)
  }
  
  const handleSaveAssignedPrice = () => {
    if (!newPrice || !assigningProduct) return
    updateProduct(assigningProduct.id, { ...assigningProduct, price: newPrice })
    setAssignPriceModal(false)
    setAssigningProduct(null)
    setNewPrice('')
    showToast(`Precio asignado: ${newPrice}`)
  }
  
  // Vista del panel (login o dashboard)
  if (!showDashboard) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-24 bg-gradient-to-br from-surface via-surface to-surface/90 cyber-grid relative overflow-hidden">
        {/* Scanline effect */}
        <div className="absolute inset-0 pointer-events-none animate-scanline opacity-5 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent" />
        
        <div className="w-full max-w-md animate-slide-in-up relative z-10">
          <div className="glass-panel rounded-2xl p-8 shadow-2xl border border-outline-variant/30 neon-border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-headline-md text-headline-md text-primary animate-glitch">Admin Access</h2>
              <button onClick={() => navigate('/')} className="text-onSurfaceVariant hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-body-sm font-medium mb-1 text-onSurfaceVariant tracking-wider">USUARIO</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-white placeholder:text-onSurfaceVariant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all neon-border-purple"
                  placeholder="admin"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-body-sm font-medium mb-1 text-onSurfaceVariant tracking-wider">CONTRASEÑA</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-white placeholder:text-onSurfaceVariant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all neon-border-purple"
                />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r bg-primary hover:bg-primary/80 text-on-primary font-bold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-primary/20 animate-pulse-glow tracking-wider">
                INGRESAR AL PANEL
              </button>
            </form>
          </div>
        </div>
      </main>
    )
  }
  
  // Dashboard
  return (
    <main className="pt-24 pb-16 px-4 max-w-7xl mx-auto cyber-grid relative min-h-screen">
      {/* Scanline effect */}
      <div className="fixed inset-0 pointer-events-none animate-scanline opacity-3 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />
      
      {/* Toast Notifications */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-in-up">
          <div className={`px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-md border neon-border ${
            toast.type === 'error' ? 'bg-red-500/20 border-red-500/30 text-red-200' : 'bg-neonGreen/20 border-neonGreen/30 text-neonGreen'
          }`}>
            <span className="material-symbols-outlined">{toast.type === 'error' ? 'error' : 'check_circle'}</span>
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}
      
      {/* Header del Dashboard */}
      <div className="glass-panel rounded-2xl p-6 mb-8 border border-outline-variant/20 neon-border relative z-10 animate-slide-in-up">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-display-lg text-display-lg text-primary animate-glitch tracking-wider">PANEL DE CONTROL</h1>
            <p className="text-onSurfaceVariant mt-1 tracking-wide">GESTIONA PRODUCTOS, PEDIDOS Y CONFIGURACIÓN</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-error/10 text-error hover:bg-error/20 transition-all neon-border-purple animate-pulse-glow">
            <span className="material-symbols-outlined">logout</span>
            CERRAR SESIÓN
          </button>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
          <div className="bg-surface-container/50 rounded-xl p-3 border border-outline-variant/20 hover:border-primary/50 transition-all group">
            <p className="text-xs text-onSurfaceVariant tracking-wider">PRODUCTOS</p>
            <p className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform">{stats.totalProducts}</p>
          </div>
          <div className="bg-surface-container/50 rounded-xl p-3 border border-outline-variant/20 hover:border-primary/50 transition-all group">
            <p className="text-xs text-onSurfaceVariant tracking-wider">PEDIDOS TOTALES</p>
            <p className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform">{stats.totalOrders}</p>
          </div>
          <div className="bg-surface-container/50 rounded-xl p-3 border border-outline-variant/20 hover:border-yellow-400/50 transition-all group">
            <p className="text-xs text-onSurfaceVariant tracking-wider">PENDIENTES</p>
            <p className="text-2xl font-bold text-yellow-400 group-hover:scale-110 transition-transform">{stats.pendingOrders}</p>
          </div>
          <div className="bg-surface-container/50 rounded-xl p-3 border border-outline-variant/20 hover:border-green-400/50 transition-all group">
            <p className="text-xs text-onSurfaceVariant tracking-wider">CONFIRMADOS</p>
            <p className="text-2xl font-bold text-green-400 group-hover:scale-110 transition-transform">{stats.confirmedOrders}</p>
          </div>
          <div className="bg-surface-container/50 rounded-xl p-3 border border-outline-variant/20 hover:border-neonGreen/50 transition-all group">
            <p className="text-xs text-onSurfaceVariant tracking-wider">INGRESOS (APROX)</p>
            <p className="text-2xl font-bold text-neonGreen group-hover:scale-110 transition-transform">${stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-outline-variant/20 flex-wrap relative z-10">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-5 py-2.5 font-bold rounded-t-xl transition-all tracking-wider ${activeTab === 'products' ? 'text-primary border-b-2 border-primary bg-primary/5 neon-border' : 'text-onSurfaceVariant hover:text-onSurface hover:bg-white/5'}`}
        >
          📦 PRODUCTOS
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-5 py-2.5 font-bold rounded-t-xl transition-all tracking-wider ${activeTab === 'orders' ? 'text-primary border-b-2 border-primary bg-primary/5 neon-border' : 'text-onSurfaceVariant hover:text-onSurface hover:bg-white/5'}`}
        >
          📋 PEDIDOS
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-5 py-2.5 font-bold rounded-t-xl transition-all tracking-wider ${activeTab === 'categories' ? 'text-primary border-b-2 border-primary bg-primary/5 neon-border' : 'text-onSurfaceVariant hover:text-onSurface hover:bg-white/5'}`}
        >
          🏷️ CATEGORÍAS
        </button>
        <button
          onClick={() => setActiveTab('config')}
          className={`px-5 py-2.5 font-bold rounded-t-xl transition-all tracking-wider ${activeTab === 'config' ? 'text-primary border-b-2 border-primary bg-primary/5 neon-border' : 'text-onSurfaceVariant hover:text-onSurface hover:bg-white/5'}`}
        >
          ⚙️ CONFIGURACIÓN
        </button>
      </div>
      
      {/* Panel de Productos */}
      {activeTab === 'products' && (
        <div className="space-y-6 relative z-10">
          {/* Barra de herramientas */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-onSurfaceVariant text-base">search</span>
                <input
                  type="text"
                  placeholder="BUSCAR PRODUCTO..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-full bg-surface-container border border-outline-variant/30 text-sm hover:border-primary/50 transition-all tracking-wider text-white"
                />
              </div>
              <select
                value={productPlatformFilter}
                onChange={(e) => setProductPlatformFilter(e.target.value)}
                className="px-4 py-2 rounded-full bg-surface-container border border-outline-variant/30 text-sm hover:border-primary/50 transition-all tracking-wider text-white"
              >
                <option value="all">TODAS LAS PLATAFORMAS</option>
                {productPlatforms.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))}
              </select>
              <select
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
                className="px-4 py-2 rounded-full bg-surface-container border border-outline-variant/30 text-sm hover:border-primary/50 transition-all tracking-wider text-white"
              >
                <option value="all">TODAS LAS CATEGORÍAS</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowImportModal(true)}
                className="bg-primary/20 text-primary border border-primary/30 px-5 py-2 rounded-full flex items-center gap-2 hover:bg-primary/30 transition-all font-medium neon-border animate-pulse-glow tracking-wider"
              >
                <span className="material-symbols-outlined">upload</span> IMPORTAR
              </button>
              <button
                onClick={() => {
                  setShowProductForm(true)
                  setEditingProduct(null)
                  setFormData({ name: '', platform: 'PC', price: '', img: '', category: categories[0] || '' })
                }}
                className="bg-neonGreen/20 text-neonGreen border border-neonGreen/30 px-5 py-2 rounded-full flex items-center gap-2 hover:bg-neonGreen/30 transition-all font-medium neon-border tracking-wider"
              >
                <span className="material-symbols-outlined">add</span> NUEVO PRODUCTO
              </button>
            </div>
          </div>
          
          {loading && products.length === 0 && (
            <div className="glass-panel rounded-2xl p-8 text-center text-onSurfaceVariant flex items-center justify-center gap-3">
              <span className="material-symbols-outlined animate-spin text-primary">sync</span>
              Cargando productos desde Google Sheets…
            </div>
          )}

          {error && products.length === 0 && !loading && (
            <div className="glass-panel rounded-2xl p-6 text-center border border-error/30 text-error space-y-3">
              <p>{error}</p>
              <button
                type="button"
                onClick={() => loadFromDatabase()}
                className="px-4 py-2 rounded-xl bg-error/20 hover:bg-error/30 font-medium"
              >
                Reintentar conexión
              </button>
            </div>
          )}

          {/* Tabla de productos (responsive) */}
          <div className="glass-panel rounded-2xl overflow-hidden border border-outline-variant/20 neon-border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-container/80">
                  <tr className="text-left text-label-caps text-onSurfaceVariant border-b border-outline-variant/20 tracking-wider">
                    <th className="p-4">PRODUCTO</th>
                    <th className="p-4">PLATAFORMA</th>
                    <th className="p-4">CATEGORÍA</th>
                    <th className="p-4">PRECIO</th>
                    <th className="p-4">ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-onSurfaceVariant">
                        {products.length === 0
                          ? 'No hay productos. Agrega filas en Google Sheets o crea uno con «Nuevo producto».'
                          : 'No se encontraron productos con estos filtros.'}
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={String(product.id)} className="border-b border-outline-variant/10 hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {product.img && <img src={product.img} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-surface-container" />}
                            <span className="font-medium">{product.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-onSurfaceVariant">{product.platform}</td>
                        <td className="p-4">
                          <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{product.category || 'Sin categoría'}</span>
                        </td>
                        <td className="p-4">
                          <span className={`font-bold ${isConsultPrice(product.price) ? 'text-yellow-400' : 'text-neonGreen'}`}>
                            {str(product.price) || '—'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {isConsultPrice(product.price) && (
                              <button onClick={() => handleAssignPrice(product)} className="p-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition" title="Asignar precio">
                                <span className="material-symbols-outlined text-sm">attach_money</span>
                              </button>
                            )}
                            <button onClick={() => handleEditProduct(product)} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition">
                              <span className="material-symbols-outlined">edit</span>
                            </button>
                            <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-error hover:bg-error/10 rounded-lg transition">
                              <span className="material-symbols-outlined">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {/* Panel de Pedidos */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative w-full sm:w-80">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-onSurfaceVariant">search</span>
              <input
                type="text"
                placeholder="Buscar por código, nombre o email..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-full bg-surface-container border border-outline-variant/30 text-sm"
              />
            </div>
            <select
              value={orderStatusFilter}
              onChange={(e) => setOrderStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-full bg-surface-container border border-outline-variant/30 text-sm"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="confirmed">Confirmados</option>
              <option value="completed">Completados</option>
              <option value="cancelled">Cancelados</option>
            </select>
          </div>
          
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="glass-panel rounded-2xl p-12 text-center text-onSurfaceVariant">No hay pedidos que coincidan</div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="glass-panel rounded-2xl p-5 border border-outline-variant/20 hover:border-primary/30 transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-mono text-primary font-bold text-lg">{order.orderCode}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                      <p className="text-onSurface font-medium">{order.customerInfo?.name || '—'}</p>
                      <p className="text-sm text-onSurfaceVariant">
                        {order.customerInfo?.email || '—'} | +{order.customerInfo?.whatsapp || '—'}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-neonGreen">{order.total}</p>
                        <p className="text-xs text-onSurfaceVariant">{order.installationType === 'self' ? 'Cuenta Propia' : 'Instalación Local'}</p>
                      </div>
                      <div className="flex gap-2">
                        {order.status === 'pending' && (
                          <>
                            <button onClick={() => handleUpdateOrderStatus(order.id, 'confirmed')} className="p-2 bg-green-500/20 text-green-400 rounded-xl hover:bg-green-500/30 transition" title="Confirmar">
                              <span className="material-symbols-outlined">check</span>
                            </button>
                            <button onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')} className="p-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition" title="Cancelar">
                              <span className="material-symbols-outlined">close</span>
                            </button>
                          </>
                        )}
                        {order.status === 'confirmed' && (
                          <button onClick={() => handleUpdateOrderStatus(order.id, 'completed')} className="p-2 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 transition" title="Completar">
                            <span className="material-symbols-outlined">done_all</span>
                          </button>
                        )}
                        <button onClick={() => setSelectedOrder(order)} className="p-2 bg-primary/20 text-primary rounded-xl hover:bg-primary/30 transition" title="Ver detalles">
                          <span className="material-symbols-outlined">visibility</span>
                        </button>
                        <a href={`https://wa.me/${config.waNumber}?text=${encodeURIComponent(`Hola! Consulta sobre pedido ${order.orderCode}`)}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-[#25D366]/20 text-[#25D366] rounded-xl hover:bg-[#25D366]/30 transition">
                          <span className="material-symbols-outlined">chat</span>
                        </a>
                      </div>
                    </div>
                  </div>
                  {order.customerInfo?.paymentProof && (
                    <div className="mt-3 pt-3 border-t border-outline-variant/20">
                      <button onClick={() => setSelectedProof(order.customerInfo.paymentProof)} className="text-sm text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">receipt</span> Ver comprobante de pago
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
      
      {/* Panel de Categorías */}
      {activeTab === 'categories' && (
        <div className="space-y-6 relative z-10">
          <div className="glass-panel rounded-2xl p-6 border border-outline-variant/20 neon-border animate-slide-in-up">
            <h3 className="font-headline-sm text-headline-sm text-primary mb-4 tracking-wider">AGREGAR NUEVA CATEGORÍA</h3>
            <form onSubmit={handleAddCategory} className="flex gap-3">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="NOMBRE DE LA CATEGORÍA..."
                className="flex-1 bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2 neon-border-purple tracking-wider text-white placeholder:text-onSurfaceVariant/50"
              />
              <button type="submit" className="bg-neonGreen/20 text-neonGreen border border-neonGreen/30 px-5 py-2 rounded-xl font-medium hover:bg-neonGreen/30 transition-all neon-border animate-pulse-glow tracking-wider">
                <span className="material-symbols-outlined">add</span> AGREGAR
              </button>
            </form>
          </div>
          
          <div className="glass-panel rounded-2xl p-6 border border-outline-variant/20 neon-border animate-slide-in-up">
            <h3 className="font-headline-sm text-headline-sm text-primary mb-4 tracking-wider">CATEGORÍAS EXISTENTES ({categories.length})</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {categories.map((category) => (
                <div key={category} className="bg-surface-container/50 rounded-xl p-4 border border-outline-variant/20 flex items-center justify-between group hover:border-primary/30 transition-all hover:scale-105">
                  <span className="font-medium tracking-wide">{category}</span>
                  <button
                    onClick={() => handleDeleteCategory(category)}
                    className="p-2 text-error hover:bg-error/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Eliminar categoría"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Panel de Configuración */}
      {activeTab === 'config' && (
        <div className="glass-panel rounded-2xl p-6 max-w-2xl space-y-6 border border-outline-variant/20 neon-border relative z-10 animate-slide-in-up">
          <h3 className="font-headline-sm text-headline-sm text-primary tracking-wider">CONFIGURACIÓN GENERAL</h3>
          <div>
            <label className="block text-label-caps text-onSurfaceVariant mb-2 tracking-wider">NÚMERO DE WHATSAPP (CON CÓDIGO PAÍS)</label>
            <div className="flex gap-3">
              <input id="waNumberConfig" type="text" defaultValue={config.waNumber} className="flex-1 bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2 neon-border-purple tracking-wider text-white placeholder:text-onSurfaceVariant/50" placeholder="5491123456789" />
              <button onClick={handleSaveWaConfig} className="bg-primary text-on-primary px-5 rounded-xl font-medium hover:bg-primary/90 transition neon-border animate-pulse-glow tracking-wider">GUARDAR</button>
            </div>
            <p className="text-xs text-onSurfaceVariant mt-2 tracking-wide">Ejemplo: 5491123456789 (sin +)</p>
          </div>
          <div className="pt-4 border-t border-outline-variant/20 space-y-4">
            <h4 className="font-bold text-onSurface mb-2 tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">slideshow</span>
              HERO ANIMADO (MÁX. {HERO_MAX} JUEGOS)
            </h4>
            <p className="text-sm text-onSurfaceVariant">
              Elige hasta {HERO_MAX} productos para el carrusel de la página principal. El orden de selección define el orden del slider.
            </p>
            <p className="text-xs text-primary font-medium">
              Seleccionados: {heroSelectedIds.length}/{HERO_MAX}
            </p>
            {products.length === 0 ? (
              <p className="text-sm text-onSurfaceVariant italic">Carga productos primero para poder elegir el hero.</p>
            ) : (
              <ul className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {products.map((product) => {
                  const pid = str(product.id)
                  const selected = heroSelectedIds.includes(pid)
                  const disabled = !selected && heroSelectedIds.length >= HERO_MAX
                  return (
                    <li key={pid}>
                      <label
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          selected
                            ? 'border-primary bg-primary/10'
                            : disabled
                              ? 'border-outline-variant/20 opacity-50 cursor-not-allowed'
                              : 'border-outline-variant/30 hover:border-primary/40'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          disabled={disabled}
                          onChange={() => toggleHeroProduct(product.id)}
                          className="w-4 h-4 accent-primary"
                        />
                        {product.img && (
                          <img src={product.img} alt="" className="w-10 h-10 rounded-lg object-cover bg-surface-container" />
                        )}
                        <span className="flex-1 text-sm font-medium truncate">{product.name}</span>
                        {selected && (
                          <span className="text-xs text-primary font-bold">
                            #{heroSelectedIds.indexOf(pid) + 1}
                          </span>
                        )}
                      </label>
                    </li>
                  )
                })}
              </ul>
            )}
            {heroSelectedIds.length > 0 && (
              <button
                type="button"
                onClick={() => setHeroFeaturedIds([])}
                className="text-sm text-onSurfaceVariant hover:text-error transition-colors"
              >
                Quitar todos del hero
              </button>
            )}
          </div>

          <div className="pt-4 border-t border-outline-variant/20 space-y-4">
            <h4 className="font-bold text-onSurface mb-2 tracking-wider">GOOGLE SHEETS (SHEETDB)</h4>
            <p className="text-sm text-onSurfaceVariant tracking-wide">
              Los productos se leen de tu hoja de Google conectada en SheetDB. Columnas: id, name, platform, price, img, category.
            </p>
            <button
              type="button"
              disabled={syncing || loading}
              onClick={async () => {
                setSyncing(true)
                await loadFromDatabase()
                setSyncing(false)
                showToast('Datos sincronizados desde Google Sheets', 'success')
              }}
              className="flex items-center gap-2 bg-primary/20 text-primary border border-primary/40 px-5 py-2.5 rounded-xl font-medium hover:bg-primary/30 transition disabled:opacity-50"
            >
              <span className={`material-symbols-outlined ${syncing || loading ? 'animate-spin' : ''}`}>sync</span>
              {syncing || loading ? 'Sincronizando…' : 'Sincronizar ahora'}
            </button>
            <p className="text-xs text-onSurfaceVariant">
              Productos cargados: <strong className="text-onSurface">{products.length}</strong>
            </p>
          </div>
          <div className="pt-4 border-t border-outline-variant/20">
            <h4 className="font-bold text-onSurface mb-2 tracking-wider">INFORMACIÓN DEL SISTEMA</h4>
            <p className="text-sm text-onSurfaceVariant tracking-wide">Versión de la tienda: 2.0.0 | Modo administrador activo</p>
          </div>
        </div>
      )}
      
      {/* Modal de formulario de producto */}
      {showProductForm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface glass-panel rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-scale-in neon-border">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-headline-md text-headline-md text-primary tracking-wider">{editingProduct ? 'EDITAR PRODUCTO' : 'NUEVO PRODUCTO'}</h2>
              <button onClick={() => setShowProductForm(false)} className="text-onSurfaceVariant hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium tracking-wider">NOMBRE</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2 mt-1 neon-border-purple tracking-wider text-white placeholder:text-onSurfaceVariant/50" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium tracking-wider">PLATAFORMA</label>
                  <select value={formData.platform} onChange={(e) => setFormData({ ...formData, platform: e.target.value })} className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2 mt-1 hover:border-primary/50 transition-all tracking-wider text-white">
                    <option>PC</option>
                    <option>PlayStation</option>
                    <option>Xbox</option>
                    <option>Nintendo</option>
                    <option>Steam</option>
                    <option>Gift Cards</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium tracking-wider">PRECIO</label>
                  <input type="text" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2 mt-1 neon-border-purple tracking-wider text-white placeholder:text-onSurfaceVariant/50" required />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium tracking-wider">CATEGORÍA</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2 mt-1 hover:border-primary/50 transition-all tracking-wider text-white">
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium tracking-wider">URL DE IMAGEN</label>
                <input type="text" value={formData.img} onChange={(e) => setFormData({ ...formData, img: e.target.value })} className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2 mt-1 neon-border-purple tracking-wider text-white placeholder:text-onSurfaceVariant/50" placeholder="https://..." />
                {formData.img && <img src={formData.img} alt="Preview" className="mt-2 w-20 h-20 rounded-lg object-cover border border-outline-variant/30 neon-border" />}
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowProductForm(false)} className="flex-1 border border-outline-variant text-onSurface py-2 rounded-xl tracking-wider">CANCELAR</button>
                <button type="submit" className="flex-1 bg-primary text-on-primary py-2 rounded-xl font-bold neon-border animate-pulse-glow tracking-wider">GUARDAR</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Modal de asignar precio */}
      {assignPriceModal && assigningProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface glass-panel rounded-2xl w-full max-w-md p-6 neon-border">
            <h3 className="font-headline-sm text-primary mb-4 tracking-wider">ASIGNAR PRECIO</h3>
            <div className="mb-4 p-3 bg-surface-container rounded-xl">
              <p className="text-sm text-onSurfaceVariant">Producto:</p>
              <p className="font-bold">{assigningProduct.name}</p>
              <p className="text-sm text-onSurfaceVariant mt-1">Plataforma: {assigningProduct.platform}</p>
            </div>
            <input type="text" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="$12.500" className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2 mb-4 neon-border-purple tracking-wider text-white placeholder:text-onSurfaceVariant/50" autoFocus />
            <div className="flex gap-3">
              <button onClick={() => setAssignPriceModal(false)} className="flex-1 border border-outline-variant py-2 rounded-xl tracking-wider">CANCELAR</button>
              <button onClick={handleSaveAssignedPrice} className="flex-1 bg-tertiary text-background py-2 rounded-xl font-bold tracking-wider">ASIGNAR</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de detalles de pedido */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-surface glass-panel rounded-2xl w-full max-w-2xl p-6 max-h-[85vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline-sm text-primary">Detalle del Pedido</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-onSurfaceVariant hover:text-white"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-onSurfaceVariant">Código:</span> <span className="font-mono font-bold">{selectedOrder.orderCode}</span></div>
                <div><span className="text-onSurfaceVariant">Estado:</span> <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(selectedOrder.status)}`}>{getStatusLabel(selectedOrder.status)}</span></div>
                <div><span className="text-onSurfaceVariant">Cliente:</span> {selectedOrder.customerInfo.name}</div>
                <div><span className="text-onSurfaceVariant">WhatsApp:</span> +{selectedOrder.customerInfo.whatsapp}</div>
                <div><span className="text-onSurfaceVariant">Email:</span> {selectedOrder.customerInfo.email}</div>
                <div><span className="text-onSurfaceVariant">Instalación:</span> {selectedOrder.installationType === 'self' ? 'Cuenta Propia' : 'En Local'}</div>
              </div>
              <div>
                <h4 className="font-bold mb-2">Productos</h4>
                <ul className="space-y-1">
                  {selectedOrder.items.map((item, i) => <li key={i} className="text-sm">🎮 {item.name} {item.price && `- ${item.price}`}</li>)}
                </ul>
              </div>
              <div className="border-t border-outline-variant/20 pt-3 flex justify-between items-center">
                <span className="font-bold">Total</span>
                <span className="text-2xl font-bold text-neonGreen">{selectedOrder.total}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de comprobante */}
      {selectedProof && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setSelectedProof(null)}>
          <div className="max-w-4xl max-h-[90vh] overflow-auto rounded-2xl" onClick={(e) => e.stopPropagation()}>
            <img src={selectedProof} alt="Comprobante" className="w-full rounded-2xl shadow-2xl" />
            <button onClick={() => setSelectedProof(null)} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full hover:bg-black/70">✕</button>
          </div>
        </div>
      )}
      
      {/* Modal de importación masiva */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface glass-panel rounded-2xl w-full max-w-2xl p-6 shadow-2xl max-h-[85vh] overflow-auto neon-border animate-scale-in">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-headline-md text-headline-md text-primary tracking-wider">IMPORTAR PRODUCTOS MASIVAMENTE</h2>
              <button onClick={() => setShowImportModal(false)} className="text-onSurfaceVariant hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block tracking-wider">FORMATO</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="json"
                      checked={importFormat === 'json'}
                      onChange={(e) => setImportFormat(e.target.value)}
                      className="accent-primary"
                    />
                    <span>JSON</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="csv"
                      checked={importFormat === 'csv'}
                      onChange={(e) => setImportFormat(e.target.value)}
                      className="accent-primary"
                    />
                    <span>CSV</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block tracking-wider">DATOS</label>
                <textarea
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder={importFormat === 'json' 
                    ? '[\n  {"name": "Juego 1", "platform": "PC", "price": "$10.000", "img": "url...", "category": "Action"},\n  {"name": "Juego 2", "platform": "PlayStation", "price": "$15.000", "img": "url...", "category": "RPG"}\n]'
                    : 'name,platform,price,img,category\n"Juego 1","PC","$10.000","url...","Action"\n"Juego 2","PlayStation","$15.000","url...","RPG"'
                  }
                  className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 h-64 font-mono text-sm resize-none neon-border-purple tracking-wider text-white placeholder:text-onSurfaceVariant/50"
                  required
                />
              </div>
              
              <div className="bg-surface-container/50 rounded-xl p-4 text-sm text-onSurfaceVariant">
                <p className="font-bold mb-2 tracking-wider">FORMATO JSON ESPERADO:</p>
                {/* <pre className="text-xs overflow-auto">
https://notch.insights.supply/cb?token=a8496813-4637-4d19-981f-535331fe7743&RID=6a20e946-aabe-a9aa-8ee0-ac25bd565ad8</pre> */}
                <p className="font-bold mt-4 mb-2 tracking-wider">FORMATO CSV ESPERADO:</p>
                <pre className="text-xs overflow-auto">name,platform,price,img,category
"Juego 1","PC","$10.000","https://url...","Action"</pre>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowImportModal(false)
                    setImportData('')
                  }}
                  className="flex-1 border border-outline-variant text-onSurface py-2 rounded-xl tracking-wider"
                >
                  CANCELAR
                </button>
                <button
                  onClick={handleImportProducts}
                  className="flex-1 bg-primary text-on-primary py-2 rounded-xl font-bold neon-border animate-pulse-glow tracking-wider"
                >
                  IMPORTAR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default AdminPage