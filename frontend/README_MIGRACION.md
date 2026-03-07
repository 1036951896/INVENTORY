# Frontend - StoreHub E-Commerce (React)

## 🎨 Diseño Original Migrado

Este frontend React replica **exactamente** el diseño HTML/CSS/JS original del usuario:

- ✅ Header azul con gradiente (#2f5f6b → #274e59)
- ✅ Logo StoreHub con SVG original
- ✅ Sistema de búsqueda responsive
- ✅ Hero section con oferta 40%
- ✅ Grid de productos con diseño "Tech Minimalista Premium"
- ✅ Tarjetas de producto con aspect-ratio 1:1
- ✅ Estilos de ecommerce-figma.css y header-limpio.css

## 🚀 Estado Actual

### ✅ Completado

- Header con búsqueda, carrito, usuario y seguimiento
- Hero section promocional
- Grid de productos con datos de prueba (mockProducts)
- Sistema de notificaciones (alert2 migrado)
- Context API para carrito
- Servicios API (auth, products)
- TypeScript types

### ⏳ Pendiente

- Login y Register pages
- Carrito lateral (panel deslizante)
- Panel Admin completo
- Detalle de productos
- Checkout y pedidos
- WhatsApp API

## 🖥️ Servidor de Desarrollo

El frontend está corriendo en: **http://localhost:5174/**

```bash
cd frontend
npm run dev
```

## 🔧 Configuración

### Datos de Prueba (Modo Actual)

El frontend usa `mockProducts` para mostrar 8 productos con imágenes reales.

En `src/components/ProductGrid.tsx`:

```typescript
const USE_MOCK_DATA = true; // Cambiar a false cuando backend esté listo
```

### Conectar al Backend Real

1. **Opción A: PostgreSQL Local**
   - Instalar PostgreSQL
   - Usuario: `postgres`
   - Contraseña: `Sa3116579677.`
   - Base de datos: `inventory_db`

2. **Opción B: Docker**

   ```bash
   docker compose up -d db
   ```

3. **Cambiar a datos reales:**
   En `ProductGrid.tsx` línea 11:
   ```typescript
   const USE_MOCK_DATA = false;
   ```

## 📁 Estructura

```
frontend/
├── public/
│   ├── css/                 # CSS originales copiados
│   │   ├── global.css
│   │   ├── ecommerce-figma.css
│   │   └── header-limpio.css
│   ├── images/
│   │   └── productos/       # 52 imágenes de productos
│   └── logo-storehub.svg    # Logo original
├── src/
│   ├── components/
│   │   ├── Header.tsx       # Header con diseño original
│   │   ├── Hero.tsx         # Hero section
│   │   └── ProductGrid.tsx  # Grid de productos
│   ├── context/
│   │   └── CartContext.tsx  # Context API para carrito
│   ├── pages/
│   │   └── Home.tsx         # Página principal
│   ├── services/
│   │   ├── api.ts           # Axios client con JWT
│   │   ├── auth.service.ts  # Login/Logout
│   │   └── products.service.ts
│   ├── types/
│   │   └── index.ts         # TypeScript interfaces
│   ├── utils/
│   │   └── notifications.ts # alert2() migrado
│   ├── data/
│   │   └── mockProducts.ts  # Datos de prueba
│   └── App.tsx
└── package.json
```

## 🎯 Próximos Pasos Recomendados

1. **Verificar que el diseño se vea correcto:**
   - Abrir http://localhost:5174/
   - Comparar con el HTML original

2. **Instalar PostgreSQL o Docker:**
   - Para conectar al backend real

3. **Continuar migrando páginas:**
   - Login.tsx
   - Register.tsx
   - CartPanel.tsx
   - AdminDashboard.tsx

## 🐛 Debugging

### Si los estilos no se aplican:

1. Verificar que existan los archivos en `frontend/public/css/`
2. Revisar el navegador que cargue los CSS desde `/css/`

### Si las imágenes no cargan:

1. Verificar que existan en `frontend/public/images/productos/`
2. Revisar rutas en `mockProducts.ts`

### Si hay errores de TypeScript:

```bash
npm run build  # Compilar para ver errores
```

## 📝 Notas

- **Diseño:** Replica exactamente el HTML original
- **CSS:** Usa los archivos CSS originales del usuario
- **Imágenes:** 52 imágenes copiadas desde `public/images/productos/`
- **Datos:** Mock data mientras se configura PostgreSQL

---

**Autor:** GitHub Copilot  
**Fecha:** 6 de marzo de 2026  
**Versión:** 1.0.0 - Migración inicial completada
