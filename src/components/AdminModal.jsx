import { useState } from 'react'
import { useApp } from '../contexts/AppContext'

const AdminModal = () => {
  const { adminModalOpen, setAdminModalOpen, config, login, logout, products, addProduct, updateProduct, deleteProduct, updateWaNumber, orders, updateOrderStatus } = useApp()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showDashboard, setShowDashboard] = useState(config.isAdmin)
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({ name: '', platform: 'PC', price: '', img: '' })
  const [activeTab, setActiveTab] = useState('products') // 'products' or 'orders'
  const [selectedProof, setSelectedProof] = useState(null) // Para ver comprobante
  const [assignPriceModal, setAssignPriceModal] = useState(false) // Modal para asignar precio
  const [assigningProduct, setAssigningProduct] = useState(null) // Producto al que se le asignará precio
  const [newPrice, setNewPrice] = useState('') // Nuevo precio a asignar

  const handleLogin = (e) => {
    e.preventDefault()
    if (login(username, password)) {
      setShowDashboard(true)
      setUsername('')
      setPassword('')
    } else {
      alert('Credenciales incorrectas')
    }
  }

  const handleLogout = () => {
    logout()
    setShowDashboard(false)
    setAdminModalOpen(false)
  }

  const handleProductSubmit = (e) => {
    e.preventDefault()
    if (editingProduct) {
      updateProduct(editingProduct.id, formData)
    } else {
      addProduct(formData)
    }
    setShowProductForm(false)
    setEditingProduct(null)
    setFormData({ name: '', platform: 'PC', price: '', img: '' })
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setFormData({ name: product.name, platform: product.platform, price: product.price, img: product.img })
    setShowProductForm(true)
  }

  const handleDeleteProduct = (id) => {
    if (confirm('¿Eliminar este producto?')) {
      deleteProduct(id)
    }
  }

  const handleSaveWaConfig = () => {
    const waInput = document.getElementById('waNumberConfig')
    updateWaNumber(waInput.value)
    alert('Configuración guardada')
  }

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    if (confirm(`¿Cambiar estado del pedido a ${newStatus}?`)) {
      updateOrderStatus(orderId, newStatus)
      alert('Estado del pedido actualizado')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-tertiary'
      case 'confirmed': return 'text-neonGreen'
      case 'completed': return 'text-primary'
      case 'cancelled': return 'text-error'
      default: return 'text-onSurfaceVariant'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return '⏳ Pendiente'
      case 'confirmed': return '✓ Confirmado'
      case 'completed': return '✓ Completado'
      case 'cancelled': return '✗ Cancelado'
      default: return status
    }
  }

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
    alert('Precio asignado correctamente')
  }

  if (!adminModalOpen) return null

  return (
    <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
      {!showDashboard ? (
        <div className="glass-panel p-8 rounded-2xl w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-headline-md text-headline-md text-primary">Admin Access</h2>
            <button 
            className="text-onSurfaceVariant hover:text-white" onClick={() => setAdminModalOpen(false)}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-body-sm mb-2 text-onSurfaceVariant">Usuario</label>
              <input
                className="w-full bg-surfaceContainer border border-outlineVariant/30 rounded-lg p-3 text-white"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-body-sm mb-2 text-onSurfaceVariant">Contraseña</label>
              <input
                className="w-full bg-surfaceContainer border border-outlineVariant/30 rounded-lg p-3 text-white"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="w-full bg-primary text-on-primary py-3 rounded-lg font-bold mt-4" type="submit">
              Entrar
            </button>
          </form>
        </div>
      ) : (
        <div className="glass-panel p-8 rounded-2xl w-full max-w-6xl h-[85vh] flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <h2 className="font-headline-md text-headline-md text-primary">Panel de Control</h2>
              <span className="bg-neonGreen/10 text-neonGreen px-3 py-1 rounded text-[10px] font-bold">LOGGED IN</span>
            </div>
            <div className="flex gap-4">
              <button className="text-error hover:bg-error/10 px-4 py-2 rounded-lg" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-outlineVariant/20">
            <button
              className={`px-4 py-2 font-bold transition-colors ${activeTab === 'products' ? 'text-primary border-b-2 border-primary' : 'text-onSurfaceVariant hover:text-onSurface'}`}
              onClick={() => setActiveTab('products')}
            >
              📦 Productos
            </button>
            <button
              className={`px-4 py-2 font-bold transition-colors ${activeTab === 'orders' ? 'text-primary border-b-2 border-primary' : 'text-onSurfaceVariant hover:text-onSurface'}`}
              onClick={() => setActiveTab('orders')}
            >
              📋 Pedidos
            </button>
          </div>

          {activeTab === 'products' ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-surfaceContainer p-4 rounded-xl border border-outlineVariant/20">
                    <label className="font-label-caps text-onSurfaceVariant block mb-2">WhatsApp Config</label>
                    <div className="flex gap-2">
                      <input
                        className="flex-1 bg-background border border-outlineVariant/30 rounded p-2 text-body-sm"
                        id="waNumberConfig"
                        defaultValue={config.waNumber}
                        placeholder="54911..."
                        type="text"
                      />
                      <button className="bg-primary text-onPrimary px-3 rounded" onClick={handleSaveWaConfig}>
                        <span className="material-symbols-outlined">save</span>
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  className="bg-neonGreen/20 text-neonGreen border border-neonGreen/30 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-neonGreen/30 transition-all"
                  onClick={() => {
                    setShowProductForm(true)
                    setEditingProduct(null)
                    setFormData({ name: '', platform: 'PC', price: '', img: '' })
                  }}
                >
                  <span className="material-symbols-outlined">add</span> Nuevo Producto
                </button>
              </div>
              <div className="flex-1 overflow-auto rounded-xl border border-outlineVariant/20 bg-surfaceContainer/50">
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-surfaceContainer text-label-caps text-onSurfaceVariant">
                    <tr>
                      <th className="p-4">Producto</th>
                      <th className="p-4">Plataforma</th>
                      <th className="p-4">Precio</th>
                      <th className="p-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-outlineVariant/10 hover:bg-white/5 transition-colors">
                        <td className="p-4 text-body-sm font-bold">{product.name}</td>
                        <td className="p-4 text-body-sm text-onSurfaceVariant">{product.platform}</td>
                        <td className="p-4 text-body-sm text-neonGreen">{product.price}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {product.price.toLowerCase() === 'consultar' && (
                              <button
                                onClick={() => handleAssignPrice(product)}
                                className="p-2 bg-tertiary text-background hover:bg-tertiary/90 rounded"
                                title="Asignar precio"
                              >
                                <span className="material-symbols-outlined text-sm">attach_money</span>
                              </button>
                            )}
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="p-2 text-primary hover:bg-primary/10 rounded"
                            >
                              <span className="material-symbols-outlined">edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 text-error hover:bg-error/10 rounded"
                            >
                              <span className="material-symbols-outlined">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              <div className="flex-1 overflow-auto rounded-xl border border-outlineVariant/20 bg-surfaceContainer/50">
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-surfaceContainer text-label-caps text-onSurfaceVariant">
                    <tr>
                      <th className="p-4">Código</th>
                      <th className="p-4">Cliente</th>
                      <th className="p-4">Productos</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Estado</th>
                      <th className="p-4">Instalación</th>
                      <th className="p-4">Comprobante</th>
                      <th className="p-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="p-8 text-center text-onSurfaceVariant">
                          No hay pedidos registrados
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order.id} className="border-b border-outlineVariant/10 hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            <span className="font-mono text-sm font-bold text-primary">{order.orderCode}</span>
                          </td>
                          <td className="p-4">
                            <div className="text-sm">
                              <p className="font-bold text-onSurface">{order.customerInfo.name}</p>
                              <p className="text-onSurfaceVariant text-xs">{order.customerInfo.email}</p>
                              <p className="text-onSurfaceVariant text-xs">+{order.customerInfo.whatsapp}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm max-w-xs">
                              {order.items.map((item, idx) => (
                                <p key={idx} className="text-onSurfaceVariant truncate">{item.name}</p>
                              ))}
                            </div>
                          </td>
                          <td className="p-4 text-body-sm font-bold text-neonGreen">{order.total}</td>
                          <td className="p-4">
                            <span className={`font-bold text-sm ${getStatusColor(order.status)}`}>
                              {getStatusLabel(order.status)}
                            </span>
                          </td>
                          <td className="p-4 text-body-sm text-onSurfaceVariant">
                            {order.installationType === 'self' ? 'Cuenta Propia' : 'En Local'}
                          </td>
                          <td className="p-4">
                            {order.customerInfo.paymentProof ? (
                              <button
                                onClick={() => setSelectedProof(order.customerInfo.paymentProof)}
                                className="text-primary hover:text-primary/80 text-sm flex items-center gap-1"
                              >
                                <span className="material-symbols-outlined text-lg">visibility</span>
                                Ver
                              </button>
                            ) : (
                              <span className="text-onSurfaceVariant text-xs">No enviado</span>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              {order.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleUpdateOrderStatus(order.id, 'confirmed')}
                                    className="p-2 text-neonGreen hover:bg-neonGreen/10 rounded"
                                    title="Confirmar pedido"
                                  >
                                    <span className="material-symbols-outlined">check</span>
                                  </button>
                                  <button
                                    onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                                    className="p-2 text-error hover:bg-error/10 rounded"
                                    title="Cancelar pedido"
                                  >
                                    <span className="material-symbols-outlined">close</span>
                                  </button>
                                </>
                              )}
                              {order.status === 'confirmed' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                                  className="p-2 text-primary hover:bg-primary/10 rounded"
                                  title="Marcar como completado"
                                >
                                  <span className="material-symbols-outlined">done_all</span>
                                </button>
                              )}
                              <a
                                href={`https://wa.me/${config.waNumber}?text=${encodeURIComponent(`Hola! Consulta sobre pedido ${order.orderCode}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-primary hover:bg-primary/10 rounded"
                                title="Contactar por WhatsApp"
                              >
                                <span className="material-symbols-outlined">chat</span>
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      {/* Payment Proof Modal */}
      {selectedProof && (
        <div className="fixed inset-0 z-[120] bg-background/90 flex items-center justify-center p-4" onClick={() => setSelectedProof(null)}>
          <div className="glass-panel p-4 rounded-2xl max-w-4xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline-sm text-headline-sm text-primary">Comprobante de Pago</h3>
              <button onClick={() => setSelectedProof(null)} className="text-onSurfaceVariant hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <img src={selectedProof} alt="Comprobante" className="w-full rounded-lg" />
          </div>
        </div>
      )}

      {showProductForm && (
        <div className="fixed inset-0 z-[110] bg-background/90 flex items-center justify-center p-4">
          <div className="glass-panel p-8 rounded-2xl w-full max-w-lg">
            <h2 className="font-headline-md text-headline-md mb-6 text-primary">
              {editingProduct ? 'Editar Producto' : 'Añadir Producto'}
            </h2>
            <form className="space-y-4" onSubmit={handleProductSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-body-sm mb-1">Nombre</label>
                  <input
                    className="w-full bg-surfaceContainer border border-outlineVariant/30 rounded p-2"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-body-sm mb-1">Plataforma</label>
                  <select
                    className="w-full bg-surfaceContainer border border-outlineVariant/30 rounded p-2"
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  >
                    <option>PC</option>
                    <option>PlayStation</option>
                    <option>Xbox</option>
                    <option>Nintendo</option>
                    <option>Steam</option>
                    <option>Gift Cards</option>
                  </select>
                </div>
                <div>
                  <label className="block text-body-sm mb-1">Precio</label>
                  <input
                    className="w-full bg-surfaceContainer border border-outlineVariant/30 rounded p-2"
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-body-sm mb-1">URL Imagen</label>
                  <input
                    className="w-full bg-surfaceContainer border border-outlineVariant/30 rounded p-2"
                    type="text"
                    value={formData.img}
                    onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                    placeholder="ID de Unsplash o URL completa"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  className="flex-1 border border-outlineVariant text-onSurface py-2 rounded"
                  onClick={() => {
                    setShowProductForm(false)
                    setEditingProduct(null)
                    setFormData({ name: '', platform: 'PC', price: '', img: '' })
                  }}
                >
                  Cancelar
                </button>
                <button type="submit" className="flex-1 bg-primary text-on-primary py-2 rounded font-bold">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {assignPriceModal && assigningProduct && (
        <div className="fixed inset-0 z-[110] bg-background/90 flex items-center justify-center p-4">
          <div className="glass-panel p-8 rounded-2xl w-full max-w-md">
            <h2 className="font-headline-md text-headline-md mb-6 text-primary">Asignar Precio</h2>
            <div className="mb-4 p-4 bg-surfaceContainer rounded-lg">
              <p className="text-sm text-onSurfaceVariant">Producto:</p>
              <p className="font-bold text-onSurface">{assigningProduct.name}</p>
              <p className="text-sm text-onSurfaceVariant mt-2">Plataforma:</p>
              <p className="text-onSurface">{assigningProduct.platform}</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-body-sm mb-1">Nuevo Precio</label>
                <input
                  className="w-full bg-surfaceContainer border border-outlineVariant/30 rounded p-2"
                  type="text"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="$12.500"
                  required
                />
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  className="flex-1 border border-outlineVariant text-onSurface py-2 rounded"
                  onClick={() => {
                    setAssignPriceModal(false)
                    setAssigningProduct(null)
                    setNewPrice('')
                  }}
                >
                  Cancelar
                </button>
                <button
                  className="flex-1 bg-tertiary text-background py-2 rounded font-bold"
                  onClick={handleSaveAssignedPrice}
                >
                  Asignar Precio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminModal
