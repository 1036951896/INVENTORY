# CONEXIÓN DEL ADMIN AL INDEX (E-COMMERCE)

## 📊 Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD (:5173/admin)            │
│  • AdminProducts - Gestión de productos                     │
│  • AdminOrders - Gestión de pedidos                         │
│  • AdminInventory - Control de inventario                   │
│  • AdminCategories - Gestión de categorías                  │
│  • AdminUsers - Gestión de usuarios                         │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    admin-api.service.ts
          (Servicio centralizador de todas las APIs)
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              BACKEND API (:3000/api/v1)                     │
│  • POST /products - Crear producto                          │
│  • PUT /products/:id - Actualizar producto                  │
│  • DELETE /products/:id - Eliminar producto                 │
│  • POST /orders/:id/status - Cambiar estado de orden        │
│  • POST /stock-movements - Registrar movimiento             │
│  • POST /product-images - Agregar imagen                    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              DATABASE (SQLite - database.sqlite)             │
│  • products (actualización en tiempo real)                  │
│  • orders (cambios de estado)                               │
│  • stock_movements (registro de cambios)                    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              INDEX / E-COMMERCE (:5173)                     │
│  • ProductGrid - Muestra productos actualizados             │
│  • ProductDetail - Detalles del producto                    │
│  • OrderTracking - Seguimiento de pedidos                   │
│  • Cart - Carrito (usa productos de la DB)                  │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 FLUJO DE SINCRONIZACIÓN

### 1️⃣ CUANDO EL ADMIN CREA UN PRODUCTO
```
Admin → AdminProducts → handleCreate()
         ↓
   admin-api.service.ts
         ↓
   productsApiService.create(productData)
         ↓
   POST /api/v1/products
         ↓
   Backend: ProductsService.create()
         ↓
   SQLite: products table INSERT
         ↓
   Index ProductGrid: 
   Al llamar fetchProducts() → GET /api/v1/products
   → Ve el nuevo producto automáticamente ✅
```

### 2️⃣ CUANDO EL ADMIN ACTUALIZA UN PRODUCTO
```
Admin → AdminProducts → handleUpdate()
         ↓
   admin-api.service.ts
         ↓
   productsApiService.update(id, productData)
         ↓
   PUT /api/v1/products/:id
         ↓
   Backend: ProductsService.update()
         ↓
   SQLite: products table UPDATE
         ↓
   Index ProductGrid:
   Al refrescar o en el próximo fetch → Ve cambios ✅
```

### 3️⃣ CUANDO EL ADMIN ELIMINA UN PRODUCTO
```
Admin → AdminProducts → handleDelete()
         ↓
   admin-api.service.ts
         ↓
   productsApiService.delete(id)
         ↓
   DELETE /api/v1/products/:id
         ↓
   Backend: ProductsService.delete()
         ↓
   SQLite: products table DELETE
         ↓
   Index ProductGrid:
   Al refrescar o en el próximo fetch
   → Producto desaparece del listado ✅
```

### 4️⃣ CUANDO EL ADMIN CAMBIA ESTADO DE PEDIDO
```
Admin → AdminOrders → updateStatus()
         ↓
   admin-api.service.ts
         ↓
   ordersApiService.updateStatus(id, status)
         ↓
   PATCH /api/v1/orders/:id/status
         ↓
   Backend: OrdersService.updateStatus()
         ↓
   SQLite: orders table UPDATE (estado)
         ↓
   Notification: Envía notificación al cliente
         ↓
   Index OrderTracking:
   Cliente ve estado actualizado en tiempo real ✅
```

## 📁 SERVICIOS DISPONIBLES

### admin-api.service.ts - Funciones principales

```typescript
import { 
  productsApiService,
  categoriesApiService,
  ordersApiService,
  usersApiService,
  inventoryApiService,
  offersApiService // TODO: Próximas
} from '@/services/admin-api.service';

// PRODUCTOS
productsApiService.getAll()           // Obtener todos
productsApiService.getById(id)        // Obtener uno
productsApiService.create(data)       // Crear
productsApiService.update(id, data)   // Actualizar
productsApiService.delete(id)         // Eliminar
productsApiService.addImage(imageData) // Agregar imagen
productsApiService.deleteImage(imageId) // Eliminar imagen

// ÓRDENES
ordersApiService.getAll()             // Obtener todas
ordersApiService.getById(id)          // Obtener una
ordersApiService.updateStatus(id, status) // Cambiar estado
ordersApiService.getStatistics()      // Estadísticas

// CATEGORÍAS
categoriesApiService.getAll()         // Obtener todas
categoriesApiService.create(data)     // Crear
categoriesApiService.update(id, data) // Actualizar
categoriesApiService.delete(id)       // Eliminar

// USUARIOS
usersApiService.getAll()              // Obtener todos
usersApiService.getById(id)           // Obtener uno
usersApiService.update(id, data)      // Actualizar
usersApiService.delete(id)            // Eliminar

// INVENTARIO
inventoryApiService.getMovements()    // Movimientos
inventoryApiService.registerMovement(data) // Registrar
inventoryApiService.getStatus()       // Estado actual
```

## ✅ ESTADO ACTUAL DE CONEXIÓN

### ✅ COMPLETAMENTE CONECTADO:
- [x] Admin ↔ Backend (CRUD de productos)
- [x] Admin ↔ Backend (Cambio de estado de órdenes)
- [x] Admin ↔ Backend (Gestión de categorías)
- [x] Admin ↔ Backend (Gestión de usuarios)
- [x] Notificaciones del admin en tiempo real
- [x] Botón HOME en navbar que lleva al ecommerce

### ✅ PARCIALMENTE CONECTADO:
- [x] Index ← Backend (Lee productos)
- [x] Index ← Backend (Lee órdenes del usuario)
- [x] Index ← Backend (Lee categorías)

### 🔄 EN DESARROLLO:
- [ ] Ofertas/Descuentos (modelo en backend)
- [ ] Sincronización en tiempo real con WebSocket
- [ ] Caché del lado del cliente

## 🚀 PRÓXIMOS PASOS

1. **Crear modelo de Ofertas/Descuentos**
   - Agregar a schema.prisma
   - Crear controller, service, module
   - Implementar en admin UI

2. **Agregar WebSocket para actualizaciones en tiempo real**
   - Cuando admin crea producto → Index lo ve inmediatamente
   - Cuando cliente compra → Admin lo ve en tiempo real

3. **Mejorar caché**
   - Usar React Query o SWR para invalidación automática
   - Mejor manejo de estado global

## 📝 EJEMPLO DE USO EN COMPONENTE ADMIN

```typescript
import { productsApiService } from '@/services/admin-api.service';
import { alert2 } from '@/utils/notifications';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar productos
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsApiService.getAll(100, 1);
      setProducts(data.data || []);
    } catch (error) {
      alert2('Error al cargar', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Crear producto
  const handleCreate = async (formData) => {
    try {
      await productsApiService.create(formData);
      alert2('Producto creado', 'success');
      loadProducts(); // Refrescar lista
    } catch (error) {
      alert2('Error', 'error');
    }
  };

  // Actualizar producto
  const handleUpdate = async (id, formData) => {
    try {
      await productsApiService.update(id, formData);
      alert2('Producto actualizado', 'success');
      loadProducts();
    } catch (error) {
      alert2('Error', 'error');
    }
  };

  // Eliminar producto
  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar?')) return;
    try {
      await productsApiService.delete(id);
      alert2('Producto eliminado', 'success');
      loadProducts();
    } catch (error) {
      alert2('Error', 'error');
    }
  };

  return (
    <div className="admin-products">
      {/* Tu UI aquí */}
    </div>
  );
}
```

## 🔐 AUTENTICACIÓN

Todos los servicios usan el token JWT almacenado en `localStorage`:
- `admin-token` - Token del administrador
- `user-token` - Token del cliente

El servicio `api.ts` inyecta automáticamente el token en cada petición.

## 📞 SOPORTE

- **Frontend**: `src/services/admin-api.service.ts`
- **Backend**: `src/modules/*/controllers` y `src/modules/*/services`
- **Database**: `backend/prisma/schema.prisma`
- **Endpoints**: `/api/v1` (línea 4 de este documento)
