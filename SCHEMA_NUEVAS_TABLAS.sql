-- ============================================================================
-- NUEVAS TABLAS - ESTRUCTURA SQL
-- Generadas: 11 de Febrero de 2026
-- ============================================================================

-- ============================================================================
-- TABLA: addresses (Direcciones de Entrega)
-- ============================================================================
CREATE TABLE addresses (
    id VARCHAR(255) PRIMARY KEY,
    calle VARCHAR(255) NOT NULL,
    numero VARCHAR(50) NOT NULL,
    apartamento VARCHAR(100),
    ciudad VARCHAR(100) NOT NULL,
    departamento VARCHAR(100) NOT NULL,
    "codigoPostal" VARCHAR(20),
    pais VARCHAR(100) DEFAULT 'Colombia',
    "detallesAdicionales" TEXT,
    "esPrincipal" BOOLEAN DEFAULT FALSE,
    "usuarioId" VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT idx_addresses_usuario UNIQUE ("usuarioId", id) ON DELETE CASCADE
);

CREATE INDEX idx_addresses_usuario ON addresses("usuarioId");

-- ============================================================================
-- TABLA: product_images (Imágenes de Productos)
-- ============================================================================
CREATE TABLE product_images (
    id VARCHAR(255) PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    orden INTEGER DEFAULT 0,
    principal BOOLEAN DEFAULT FALSE,
    "productoId" VARCHAR(255) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT idx_product_images_producto UNIQUE ("productoId", id)
);

CREATE INDEX idx_product_images_producto ON product_images("productoId");

-- ============================================================================
-- TABLA: stock_movements (Movimientos de Inventario)
-- ============================================================================
CREATE TABLE stock_movements (
    id VARCHAR(255) PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('ENTRADA', 'SALIDA', 'DEVOLUCIÓN', 'AJUSTE')),
    cantidad INTEGER NOT NULL,
    razon VARCHAR(255) NOT NULL,
    referencia VARCHAR(255),
    "productoId" VARCHAR(255) NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    "usuarioId" VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT idx_stock_movement_producto UNIQUE ("productoId", id)
);

CREATE INDEX idx_stock_movements_producto ON stock_movements("productoId");
CREATE INDEX idx_stock_movements_usuario ON stock_movements("usuarioId");

-- ============================================================================
-- MODIFICACIÓN: TABLA orders (Agregar dirección)
-- ============================================================================
ALTER TABLE orders 
ADD COLUMN "direccionId" VARCHAR(255) NOT NULL REFERENCES addresses(id) ON DELETE RESTRICT;

ALTER TABLE orders 
ADD CONSTRAINT idx_orders_direccion UNIQUE ("direccionId", id);

CREATE INDEX idx_orders_direccion ON orders("direccionId");

-- ============================================================================
-- MODIFICACIÓN: TABLA products (Eliminar imagen simple)
-- ============================================================================
-- Nota: La migración de Prisma eliminará la columna 'imagen'
-- ALTER TABLE products DROP COLUMN imagen;
-- Las imágenes ahora se almacenan en la tabla product_images

-- ============================================================================
-- NOTAS DE AUDITORÍA
-- ============================================================================

/*
CAMBIOS PRINCIPALES:

1. ADDRESSES (Nueva)
   - Permite múltiples direcciones por usuario
   - Una dirección principal seleccionable
   - Separación de datos de usuarios

2. PRODUCT_IMAGES (Nueva)
   - Soporta galerías de múltiples imágenes
   - Una imagen principal destacada
   - Ordenamiento personalizable

3. STOCK_MOVEMENTS (Nueva)
   - Auditoría completa de movimientos
   - Tipos: ENTRADA, SALIDA, DEVOLUCIÓN, AJUSTE
   - Referencia a órdenes para trazabilidad

4. ORDERS (Modificada)
   - Agregado campo direccionId (FK a addresses)
   - Las órdenes usan direcciones seleccionables
   - Mejora UX del cliente

5. PRODUCTS (Modificada)
   - Se eliminó campo 'imagen' (campo simple)
   - Ahora usa relación 1:N a product_images
   - Soporta múltiples imágenes

BENEFICIOS:

✅ Profesionalismo - Auditoría de inventario
✅ Escalabilidad - Múltiples direcciones por cliente
✅ UX Mejorada - Galerías de imágenes
✅ Trazabilidad - Historial completo de movimientos
✅ Integridad - Relaciones bien definidas
*/

-- ============================================================================
-- EJEMPLOS DE DATOS
-- ============================================================================

-- Crear dirección de ejemplo
INSERT INTO addresses (id, calle, numero, ciudad, departamento, "usuarioId", "esPrincipal", "createdAt", "updatedAt")
VALUES ('addr-1', 'Calle Principal', '123', 'Bogotá', 'Cundinamarca', 'user-1', true, NOW(), NOW());

-- Crear movimiento de stock de ejemplo
INSERT INTO stock_movements (id, tipo, cantidad, razon, "productoId", "usuarioId", "createdAt")
VALUES 
  ('mov-1', 'ENTRADA', 100, 'Reposición inicial', 'prod-1', 'admin-1', NOW()),
  ('mov-2', 'SALIDA', 5, 'Venta - Pedido PED-1234567890', 'prod-1', NULL, NOW());

-- Agregar imagen a producto
INSERT INTO product_images (id, url, orden, principal, "productoId", "createdAt")
VALUES 
  ('img-1', 'https://cdn.example.com/product-1-main.jpg', 0, true, 'prod-1', NOW()),
  ('img-2', 'https://cdn.example.com/product-1-alt1.jpg', 1, false, 'prod-1', NOW()),
  ('img-3', 'https://cdn.example.com/product-1-alt2.jpg', 2, false, 'prod-1', NOW());
