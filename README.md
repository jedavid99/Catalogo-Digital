# CyberVault Gaming - React con Vite

Proyecto React con Vite que replica el diseño y funcionalidad del sitio original CyberVault Gaming, una tienda de juegos digitales.

## 🚀 Instalación

1. **Navegar al directorio del proyecto:**
   ```bash
   cd cybervault-react
   ```

2. **Instalar las dependencias:**
   ```bash
   npm install
   ```

   Esto instalará:
   - React 18
   - React DOM
   - React Router DOM
   - Tailwind CSS
   - Vite
   - Autoprefixer
   - PostCSS

## 📦 Estructura del Proyecto

```
cybervault-react/
├── public/                 # Archivos estáticos
├── src/
│   ├── components/         # Componentes reutilizables
│   │   ├── Header.jsx     # Barra de navegación
│   │   ├── Footer.jsx     # Pie de página
│   │   ├── ProductCard.jsx # Tarjeta de producto
│   │   └── AdminModal.jsx # Modal de administración
│   ├── contexts/          # Contextos de React
│   │   └── AppContext.jsx # Estado global de la aplicación
│   ├── pages/             # Páginas de la aplicación
│   │   ├── StorePage.jsx          # Página principal (tienda)
│   │   ├── CartPage.jsx           # Página del carrito
│   │   ├── CheckoutPage.jsx       # Página de checkout
│   │   ├── ConfirmationPage.jsx   # Página de confirmación
│   │   └── AdminInventoryPage.jsx # Página de inventario admin
│   ├── styles/            # Estilos CSS
│   │   └── index.css      # Estilos globales y Tailwind
│   ├── hooks/             # Custom hooks (si es necesario)
│   ├── App.jsx            # Componente principal
│   ├── main.jsx           # Punto de entrada
│   └── index.css          # Estilos base
├── index.html             # HTML principal
├── package.json           # Dependencias del proyecto
├── tailwind.config.js     # Configuración de Tailwind CSS
├── vite.config.js         # Configuración de Vite
└── postcss.config.js      # Configuración de PostCSS
```

## 🎨 Características

### Páginas Implementadas

1. **StorePage (`/`)** - Tienda principal con:
   - Hero section con imagen de fondo
   - Catálogo de productos con filtros (plataforma, categoría)
   - Vista de grid/lista
   - Búsqueda de productos
   - Panel de administración (modal)

2. **CartPage (`/cart`)** - Carrito de compras con:
   - Lista de productos en el carrito
   - Resumen del pedido
   - Stepper de progreso
   - Opciones de pago

3. **CheckoutPage (`/checkout`)** - Proceso de pago con:
   - Formulario de información del cliente
   - Selección de método de pago
   - Resumen del pedido
   - Stepper de progreso

4. **ConfirmationPage (`/confirmation`)** - Confirmación de pedido con:
   - Mensaje de éxito
   - Detalles del pedido
   - Pasos a seguir
   - Opciones de pago (transferencia, WhatsApp)

5. **AdminInventoryPage (`/admin/inventory`)** - Panel de administración con:
   - Tabla de inventario
   - Estadísticas de ventas
   - Filtros por plataforma
   - Paginación

### Componentes Compartidos

- **Header**: Barra de navegación con logo, menú, búsqueda y carrito
- **Footer**: Pie de página con información de contacto y métodos de pago
- **ProductCard**: Tarjeta de producto con vista grid y lista
- **AdminModal**: Modal para autenticación y gestión de productos

### Estado Global

El contexto `AppContext` maneja:
- Productos (CRUD completo)
- Carrito de compras
- Configuración (número de WhatsApp, modo de vista)
- Estado de autenticación admin
- Persistencia en localStorage

## 🏃 Ejecución

### Modo Desarrollo

```bash
npm run dev
```

El servidor de desarrollo se iniciará en `http://localhost:5173`

### Modo Producción

1. **Construir el proyecto:**
   ```bash
   npm run build
   ```

2. **Previsualizar la build:**
   ```bash
   npm run preview
   ```

## 🎯 Estilos

El proyecto utiliza **Tailwind CSS** con una configuración personalizada que incluye:

- Colores personalizados del diseño original (primary, surface, tertiary, etc.)
- Espaciado personalizado (gutter, container-max)
- Fuentes personalizadas (Inter, Sora)
- Utilidades personalizadas (glass-panel, neon-glow, etc.)

### Clases CSS Personalizadas

- `.glass-panel`: Efecto de vidrio esmerilado
- `.glass-card`: Variante de glass-panel
- `.neon-glow-hover`: Efecto de brillo neon al hover
- `.neon-glow-primary`: Brillo en color primario
- `.step-active`: Indicador de paso activo en steppers
- `.material-symbols-outlined`: Configuración de iconos Material Symbols

## 🔐 Credenciales de Admin

- **Usuario:** `admin`
- **Contraseña:** `admin123`

## 📱 Navegación

El proyecto utiliza `react-router-dom` para la navegación:

- `/` - Tienda principal
- `/cart` - Carrito de compras
- `/checkout` - Checkout
- `/confirmation` - Confirmación de pedido
- `/admin/inventory` - Panel de administración (requiere autenticación)

## 💾 Persistencia de Datos

El proyecto soporta dos modos de persistencia de datos:

### Modo Local (localStorage) - Por defecto
- `cv_products`: Lista de productos
- `cv_config`: Configuración de la aplicación
- `cv_cart`: Carrito de compras
- `cv_orders`: Pedidos
- `cv_categories`: Categorías

### Modo SheetDB (Google Sheets) - Recomendado para producción

Para usar SheetDB como base de datos:

1. **Crear una cuenta en SheetDB:**
   - Ve a https://sheetdb.io/
   - Regístrate y crea una cuenta gratuita

2. **Crear un Google Sheet:**
   - Crea un nuevo Google Sheet
   - Crea las siguientes hojas (tabs):
     - `products`: Columnas: id, name, platform, price, img, category
     - `orders`: Columnas: id, orderCode, status, items, customerInfo, installationType, paymentMethod, total, createdAt, updatedAt
     - `config`: Columnas: id, waNumber
     - `categories`: Columnas: id, name

3. **Conectar SheetDB al Google Sheet:**
   - En SheetDB, selecciona "Connect Google Sheet"
   - Autoriza SheetDB a acceder a tu Google Sheet
   - Copia tu API ID

4. **Configurar variables de entorno:**
   - Crea un archivo `.env` en la raíz del proyecto (basado en `.env.example`)
   - Agrega tu API ID:
     ```
     VITE_SHEETDB_API_ID=tu_api_id_aqui
     ```

5. **Reiniciar el servidor:**
   ```bash
   npm run dev
   ```

**Ventajas de SheetDB:**
- Acceso remoto desde cualquier lugar
- Edición directa en Google Sheets
- Backup automático por Google
- Colaboración en tiempo real
- Sincronización automática

**Fallback automático:**
Si SheetDB no está configurado o hay errores de red, la aplicación usará localStorage automáticamente sin interrumpir el funcionamiento.

## 🎨 Diseño Original

El diseño replica fielmente el HTML original con:
- Tema oscuro (dark mode)
- Paleta de colores cyberpunk/neon
- Efectos de glassmorphism
- Animaciones y transiciones suaves
- Diseño responsive

## 🛠️ Tecnologías Utilizadas

- **React 18.3.1** - Framework UI
- **Vite 5.2.8** - Build tool y dev server
- **React Router DOM 6.22.0** - Enrutamiento
- **Tailwind CSS 3.4.3** - Framework CSS
- **PostCSS + Autoprefixer** - Procesamiento CSS
- **Material Symbols Outlined** - Iconos

## 📝 Notas

- Las advertencias de CSS sobre `@tailwind` y `@apply` son normales antes de instalar las dependencias con `npm install`
- El proyecto mantiene la misma apariencia visual que el HTML original
- Todos los estilos del HTML original han sido migrados a Tailwind CSS
- La funcionalidad JavaScript original ha sido convertida a React hooks y contexto

## 🤝 Contribución

Este proyecto es una conversión directa de HTML/CSS/JS a React con Vite, manteniendo el diseño y funcionalidad original.
