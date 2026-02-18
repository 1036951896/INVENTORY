# 📚 GUÍA DE PRISMA - RELACIONES Y LLAVES FORÁNEAS

**Última Actualización:** 18 Febrero 2026  
**Versión:** 1.0  
**Para:** Desarrolladores Backend

---

## 📑 Tabla de Contenidos

1. [¿Qué es Prisma?](#qué-es-prisma)
2. [Llaves Foráneas en Prisma](#llaves-foráneas-en-prisma)
3. [Relaciones en Tu Código](#relaciones-en-tu-código)
4. [Cómo Definen las Relaciones](#cómo-definen-las-relaciones)
5. [Ejemplos Prácticos](#ejemplos-prácticos)
6. [Operaciones Comunes](#operaciones-comunes)
7. [Cascada y Restricciones](#cascada-y-restricciones)
8. [Tips y Mejores Prácticas](#tips-y-mejores-prácticas)

---

## ¿Qué es Prisma?

### Definición Simple

**Prisma es un ORM (Object-Relational Mapping)** que:
- ✅ Convierte filas de BD en objetos JavaScript/TypeScript
- ✅ Maneja automáticamente relaciones entre tablas
- ✅ Genera queries SQL automaticamente
- ✅ Proporciona type-safety total
- ✅ Reemplaza SQL sin perder control

### Alternativas (para comparar)
```
❌ SQL Puro:      SELECT * FROM users WHERE id = '123'; (sin type-safety)
❌ Knex/QueryBuilder: db('users').where('id', '123') (mejor pero tedioso)
✅ Prisma:        await prisma.user.findUnique({ where: { id: '123' } })
✅ Sequelize/TypeORM: También valid, pero Prisma es más moderno
```

---

## Llaves Foráneas en Prisma

### ¿Qué es una Llave Foránea?

Una **llave foránea** es un campo que referencia el ID de otro registro en otra tabla.

**Ejemplo simple:**
```
Tabla USUARIOS          Tabla ÓRDENES
┌─────────────────┐    ┌──────────────────┐
│ id: "user-1"    │    │ id: "order-1"    │
│ nombre: "Juan"  │←───│ usuarioId: "user-1"  │──┐ LLAVE FORÁNEA
└─────────────────┘    │ total: 50000     │
                        └──────────────────┘
```

### En Prisma se define así:

```typescript
model User {
  id String @id
  nombre String
  
  // Relación (sin llave en BD, solo en Prisma)
  ordenes Order[]      // Un usuario TIENE múltiples órdenes
}

model Order {
  id String @id
  
  // Llave foránea (esto SÍ existe en la BD como columna)
  usuarioId String
  usuario User @relation(fields: [usuarioId], references: [id])
  
  // Relación (sin llave)
  items OrderItem[]    // Una orden TIENE múltiples items
}
```

---

## Relaciones en Tu Código

### Mostrar Todas las Relaciones

Tu `schema.prisma` tiene estas relaciones:

```
┌─────────────────────────────────────────────────┐
│                    USUARIO                      │
├─────────────────────────────────────────────────┤
│  id, nombre, email, password, rol               │
└──────────────┬──────────────────────────────────┘
               │
        ┌──────┴──────┬────────────┬──────────────┐
        ↓             ↓            ↓              ↓
    ┌────────┐  ┌─────────┐  ┌──────┐  ┌──────────┐
    │ ÓRDENES│  │DIRECCIO-│  │CARRITO│  │MOVIMIEN.│
    │        │  │NES      │  │       │  │STOCK    │
    └────────┘  └─────────┘  └──────┘  └──────────┘
        │
        └─→ ITEMS ORDEN → PRODUCTOS


PRODUCTO ←─── CATEGORÍA
    │
    ├─→ IMÁGENES
    ├─→ MOVIMIENTOS STOCK
    └─→ ITEMS ORDEN
         └─→ ÓRDENES

CARRITO
    │
    └─→ ITEMS CARRITO → PRODUCTOS
```

---

## Cómo Definen las Relaciones

### Tipo 1: Uno a Muchos (1:N)

**Un Usuario → Muchas Órdenes**

```prisma
model User {
  id String @id
  
  // Relación: UN usuario TIENE MUCHAS órdenes
  ordenes Order[]     // Array de órdenes
}

model Order {
  id String @id
  
  // Llave foránea: referencia a User
  usuarioId String   
  usuario User @relation(fields: [usuarioId], references: [id])
}
```

**En la BD:**
```sql
CREATE TABLE users (
  id VARCHAR PRIMARY KEY,
  nombre VARCHAR
);

CREATE TABLE orders (
  id VARCHAR PRIMARY KEY,
  usuarioId VARCHAR,
  FOREIGN KEY (usuarioId) REFERENCES users(id)
  -- ↑ Esta es la llave foránea
);
```

### Tipo 2: Uno a Uno (1:1)

**Un Usuario → Un Carrito**

```prisma
model User {
  id String @id
  carrito Cart?    // Máximo 1 carrito (opcional con ?)
}

model Cart {
  id String @id
  usuarioId String @unique  // @unique = uno a uno
  usuario User @relation(fields: [usuarioId], references: [id])
}
```

### Tipo 3: Muchos a Muchos (N:N)

**Muchos Productos ← → Muchas Órdenes (a través de OrderItem)**

```prisma
model Product {
  id String @id
  
  // A través de OrderItem llegamos a Order
  orderItems OrderItem[]
}

model Order {
  id String @id
  
  // A través de OrderItem llegamos a Product
  items OrderItem[]
}

// Tabla de unión (junction table)
model OrderItem {
  ordenId String
  orden Order @relation(fields: [ordenId], references: [id])
  
  productoId String
  producto Product @relation(fields: [productoId], references: [id])
}
```

---

## Ejemplos Prácticos

### 1️⃣ Crear una Orden con Items

```typescript
// backend/src/modules/orders/orders.service.ts

async crearOrden(usuarioId: string, items: CrearOrdoranDto) {
  // Crear orden Y sus items en UNA transacción
  const orden = await this.prisma.order.create({
    data: {
      numero: `PED-${Date.now()}`,
      usuarioId: usuarioId,              // ← Llave foránea
      total: items.total,
      
      // Crear items conectados
      items: {
        create: items.items.map(item => ({
          productoId: item.productoId,    // ← Llave foránea
          cantidad: item.cantidad,
          precioUnitario: item.precio,
          subtotal: item.cantidad * item.precio
        }))
      }
    },
    
    // Traer relaciones
    include: {
      usuario: true,                      // Traer datos del usuario
      items: {                            // Traer todos los items
        include: {
          producto: true                  // Traer datos del producto
        }
      }
    }
  });
  
  return orden;
}
```

**Resultado:**
```typescript
{
  id: "order-123",
  numero: "PED-1708251630000",
  usuarioId: "user-1",              // Llave foránea
  total: 150000,
  
  // Relaciones traidas (no son llaves foráneas, son objetos completos)
  usuario: {
    id: "user-1",
    nombre: "Juan",
    email: "juan@email.com"
  },
  items: [
    {
      id: "item-1",
      ordenId: "order-123",         // Llave foránea
      productoId: "prod-1",         // Llave foránea
      cantidad: 2,
      precioUnitario: 75000,
      
      // Producto traido
      producto: {
        id: "prod-1",
        nombre: "Laptop",
        precio: 75000
      }
    }
  ]
}
```

### 2️⃣ Obtener Usuario con Sus Órdenes

```typescript
// Obtener usuario con TODO lo relacionado
const usuario = await this.prisma.user.findUnique({
  where: { id: "user-1" },
  include: {
    ordenes: {
      // Traer órdenes con sus items y productos
      include: {
        items: {
          include: {
            producto: true
          }
        },
        direccion: true
      }
    },
    direcciones: true,
    carrito: {
      include: {
        items: {
          include: {
            producto: true
          }
        }
      }
    }
  }
});
```

### 3️⃣ Crear Producto con Categoría

```typescript
// Crear producto que pertenece a una categoría
const producto = await this.prisma.product.create({
  data: {
    nombre: "Laptop HP",
    descripcion: "Laptop de 15 pulgadas",
    precio: 2500000,
    stock: 10,
    
    // Conectar a categoría existente (llave foránea)
    categoriaId: "cat-1"  // ← Llave foránea directa
    // O usar:
    // categoria: { connect: { id: "cat-1" } }
  },
  include: {
    categoria: true      // Traer datos de la categoría
  }
});
```

### 4️⃣ Buscar Órdenes de un Usuario

```typescript
const ordenes = await this.prisma.order.findMany({
  where: {
    usuarioId: "user-1"  // Filtrar por llave foránea
  },
  include: {
    items: {
      include: {
        producto: {
          include: {
            categoria: true
          }
        }
      }
    }
  }
});
```

---

## Operaciones Comunes

### CREATE (Crear con relaciones)

```typescript
// Crear orden con items
await prisma.order.create({
  data: {
    numero: "PED-123",
    usuarioId: "user-1",           // Llave foránea
    items: {
      create: [
        { productoId: "prod-1", cantidad: 2 },
        { productoId: "prod-2", cantidad: 1 }
      ]
    }
  }
});
```

### READ (Leer con relaciones)

```typescript
// Leer con relaciones incluidas
await prisma.order.findUnique({
  where: { id: "order-1" },
  include: {
    usuario: true,
    items: { include: { producto: true } }
  }
});

// Leer solo con llaves foráneas
await prisma.order.findUnique({
  where: { id: "order-1" }
  // Sin include: trae usuarioId pero no usuario completo
});
```

### UPDATE (Actualizar relaciones)

```typescript
// Cambiar usuario de una orden (cambiar llave foránea)
await prisma.order.update({
  where: { id: "order-1" },
  data: {
    usuarioId: "user-2"   // ← Nueva llave foránea
  }
});

// Agregar items a orden existente
await prisma.order.update({
  where: { id: "order-1" },
  data: {
    items: {
      create: [
        { productoId: "prod-3", cantidad: 1 }
      ]
    }
  }
});
```

### DELETE (Eliminar con relaciones)

```typescript
// Eliminar orden (ver onDelete policies)
await prisma.order.delete({
  where: { id: "order-1" }
  // Según onDelete: CASCADE → elimina items automáticamente
  // Según onDelete: RESTRICT → error si tiene items
});
```

---

## Cascada y Restricciones

### onDelete: Cascade

**Elimina automáticamente registros relacionados**

```prisma
model Order {
  id String @id
  usuarioId String
  usuario User @relation(
    fields: [usuarioId], 
    references: [id],
    onDelete: Cascade  // ← Si usuario se elimina, orden TAMBIÉN
  )
}
```

**En tu código:** Si eliminas un usuario, sus órdenes se eliminan automáticamente.

### onDelete: Restrict

**Impide eliminar si hay registros relacionados**

```prisma
model OrderItem {
  productoId String
  producto Product @relation(
    fields: [productoId],
    references: [id],
    onDelete: Restrict  // ← No puedes eliminar producto si está en orden
  )
}
```

**En tu código:** Si intentas eliminar un producto que está en una orden, gets error.

### onDelete: SetNull

**Pone NULL la llave foránea**

```prisma
model Order {
  direccionId String?
  direccion Address? @relation(
    fields: [direccionId],
    references: [id],
    onDelete: SetNull  // ← Si dirección se elimina, queda NULL
  )
}
```

**En tu código:** Si eliminas dirección, la orden sigue existiendo pero sin dirección.

---

## Tu Schema.prisma - Resumen

### Resumen de Políticas en Tu Código

```
User
├─ ordenes: Order[]
│  └─ onDelete: Cascade (si eliminas usuario, eliminan sus órdenes)
├─ direcciones: Address[]
│  └─ onDelete: Cascade (si eliminas usuario, eliminan sus direcciones)
├─ carrito: Cart?
│  └─ onDelete: Cascade (si eliminas usuario, elimina su carrito)
└─ movimientosStock: StockMovement[]
   └─ onDelete: SetNull (si eliminas usuario, pone NULL)

Product
├─ categoria: Category (onDelete: Cascade)
├─ imagenes: ProductImage[]
│  └─ onDelete: Cascade
├─ orderItems: OrderItem[]
│  └─ onDelete: Restrict (no puedes eliminar si está en órdenes)
└─ movimientosStock: StockMovement[]
   └─ onDelete: Restrict (no puedes eliminar si hay movimientos)

Order
├─ usuario: User (onDelete: Cascade)
├─ direccion: Address? (onDelete: SetNull)
└─ items: OrderItem[] (onDelete: Cascade)

OrderItem
├─ orden: Order (onDelete: Cascade)
└─ producto: Product (onDelete: Restrict)
```

### Implicaciones Prácticas

```typescript
// ✅ Esto funciona - elimina usuario y sus órdenes automáticamente
await prisma.user.delete({ where: { id: "user-1" } });

// ❌ Esto falla - no puedes eliminar producto si está en órdenes
await prisma.product.delete({ where: { id: "prod-1" } }); 
// Error: Foreign key constraint failed

// ✅ Primero elimina órdenes, luego producto
await prisma.orderItem.deleteMany({ where: { productoId: "prod-1" } });
await prisma.product.delete({ where: { id: "prod-1" } });

// ✅ Esto funciona - dirección se pone NULL
await prisma.address.delete({ where: { id: "addr-1" } });
```

---

## Tips y Mejores Prácticas

### ✅ BUENOS PATRONES

```typescript
// 1. Siempre especifica qué incluir
const orden = await prisma.order.findUnique({
  where: { id },
  include: {
    usuario: true,
    items: { include: { producto: true } }
  }
});

// 2. Usa transacciones para múltiples cambios
await prisma.$transaction(async (tx) => {
  const orden = await tx.order.create({ data: {...} });
  await tx.stockMovement.create({ ... });
});

// 3. Valida llaves foráneas antes de crear
const usuarioExiste = await prisma.user.findUnique({ where: { id } });
if (!usuarioExiste) throw new Error('Usuario no existe');

// 4. Usa índices en campos buscados
@@index([usuarioId])  // para findMany({ where: { usuarioId } })
```

### ❌ MALOS PATRONES

```typescript
// 1. Traer TODO sin necesidad (performance)
❌ await prisma.order.findUnique({
  where: { id },
  include: {
    usuario: { include: { ... } },
    items: { include: { ... } },
    // ... traer todo
  }
});

✅ await prisma.order.findUnique({
  where: { id },
  include: {
    usuario: { select: { id, nombre, email } },  // Solo lo necesario
    items: { include: { producto: true } }
  }
});

// 2. N+1 queries (problema de performance)
❌ const ordenes = await prisma.order.findMany();
   for (const orden of ordenes) {
     const usuario = await prisma.user.findUnique({  // En cada iteración
       where: { id: orden.usuarioId }
     });
   }

✅ const ordenes = await prisma.order.findMany({
  include: { usuario: true }  // Una sola query con join
});

// 3. No validar relaciones
❌ await prisma.order.create({
  data: {
    usuarioId: "user-no-existe"  // ¿Existe?
  }
});

✅ const usuario = await prisma.user.findUnique({ ... });
   if (!usuario) throw new Error('Usuario no existe');
   await prisma.order.create({ ... });
```

---

## Migraciones - Cómo se Aplican Cambios

### Cuando cambias el Schema

```bash
# 1. Editas schema.prisma
# 2. Creas migrations
npm run prisma:migrate:dev

# Esto:
# ✅ Genera SQL para cambios
# ✅ Lo ejecuta en la BD
# ✅ Guarda en /migrations/

# 3. Se regenera Prisma Client automáticamente
```

---

## Resumen Rápido

| Concepto | Prisma | BD |
|----------|--------|-----|
| **Llave Foránea** | `usuarioId String` + `@relation` | Columna FK |
| **Relación 1:N** | `usuario.ordenes[]` | JOIN en queries |
| **Include** | Traer objetos relacionados | Hace JOINS |
| **Select** | Elegir campos específicos | SELECT limitado |
| **Cascade** | Elimina automáticamente | DELETE con FK |
| **Restrict** | Impide eliminar | CHECK/FOREIGN KEY |
| **SetNull** | FK queda NULL | UPDATE a NULL |

---

## Comandos Útiles

```bash
# Ver schema gráficamente
npm run prisma:studio

# Crear migración
npm run prisma:migrate:dev

# Resetear BD (⚠️ elimina datos)
npm run db:reset

# Generar Prisma Client
npm run prisma:generate

# Seed (poblar datos iniciales)
npm run prisma:seed
```

---

## Conclusión

**Prisma simplifica mucho las relaciones:**
- ✅ No escribes SQL complejo
- ✅ Type-safe (TypeScript)
- ✅ Automático con `include` y `select`
- ✅ Maneja cascadas y restricciones
- ✅ Performance optimizado

**Tu schema tiene relaciones claras y bien diseñadas.** Úsalas siempre con `include` para traer los datos relacionados.

---

**¿Preguntas específicas sobre Prisma en tu código? Déjame saber.** 🚀

