# Instrucciones de Despliegue en Vercel (Versión Limitada)

## Cambios Realizados en el Código

1. **Variable de entorno agregada** en `.env.example`:
   - `VITE_DEPLOY_VERSION=full` (local) o `VITE_DEPLOY_VERSION=limited` (Vercel)

2. **ProductCard modificado** para ocultar botón COMPRAR cuando `VITE_DEPLOY_VERSION=limited`

3. **No se encontró sección "Comparar"** en el código (probablemente no existe)

---

## Pasos para Configurar Git Branches

### 1. Inicializar git (si no está inicializado)
```bash
cd c:\Users\david\Documents\gameCalatago\cybervault-react
git init
```

### 2. Crear y cambiar al branch `production`
```bash
git checkout -b production
```

### 3. Crear archivo `.env` para producción
```bash
# En el branch production, crea .env con:
VITE_SHEETDB_API_ID=ts2p47xonheq0
VITE_DEPLOY_VERSION=limited
```

### 4. Commit cambios en production
```bash
git add .
git commit -m "Configuración versión limitada para Vercel"
```

### 5. Volver al branch principal (local)
```bash
git checkout main
# o si no existe:
git checkout -b main
```

### 6. Asegurar que `.env` en main tenga versión completa
```bash
# En el branch main, .env debe tener:
VITE_SHEETDB_API_ID=ts2p47xonheq0
VITE_DEPLOY_VERSION=full
```

### 7. Commit cambios en main
```bash
git add .
git commit -m "Versión completa para desarrollo local"
```

---

## Pasos para Subir a GitHub

### 1. Crear repositorio en GitHub
- Ve a https://github.com/new
- Crea un repositorio vacío (sin README, .gitignore, etc.)
- Copia la URL del repositorio

### 2. Conectar local a GitHub
```bash
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
```

### 3. Subir branch main (local)
```bash
git checkout main
git push -u origin main
```

### 4. Subir branch production (Vercel)
```bash
git checkout production
git push -u origin production
```

---

## Configurar Variables de Entorno en Vercel

### 1. Crear proyecto en Vercel
- Ve a https://vercel.com/new
- Importa tu repositorio de GitHub
- En "Framework Preset" selecciona "Vite"
- En "Root Directory" deja vacío (o `cybervault-react` si está en subcarpeta)

### 2. Configurar variables de entorno
- En Vercel, ve a Settings → Environment Variables
- Agrega estas variables:
  ```
  VITE_SHEETDB_API_ID=ts2p47xonheq0
  VITE_DEPLOY_VERSION=limited
  ```

### 3. Configurar branch de producción
- En Vercel, ve a Settings → Git
- En "Production Branch" cambia a `production`
- En "Preview Branch Deployment" puedes dejar `main` o deshabilitarlo

### 4. Desplegar
- Vercel detectará automáticamente el branch `production`
- Hacerá deploy automático
- La URL será: `https://tu-proyecto.vercel.app`

---

## Resumen de Branches

- **main**: Versión completa (local)
  - `VITE_DEPLOY_VERSION=full`
  - Botón COMPRAR visible
  - Desarrollo local

- **production**: Versión limitada (Vercel)
  - `VITE_DEPLOY_VERSION=limited`
  - Botón COMPRAR oculto
  - Solo CONSULTAR y Admin
  - Desplegado en Vercel

---

## Comandos Útiles

### Cambiar entre versiones
```bash
# Para desarrollo local (versión completa)
git checkout main

# Para producción (versión limitada)
git checkout production
```

### Ver branch actual
```bash
git branch
```

### Ver cambios entre branches
```bash
git diff main production
```

### Fusionar cambios de main a production
```bash
git checkout production
git merge main
git push origin production
```
