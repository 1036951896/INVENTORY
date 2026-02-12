-- ============================================================================
-- SCHEMA SQL - CARRITO DE COMPRAS
-- Generadas: 11 de Febrero de 2026
-- ============================================================================

-- ============================================================================
-- TABLA: carts (Carrito de Compras)
-- ============================================================================
CREATE TABLE carts (
    id VARCHAR(255) PRIMARY KEY,
    "usuarioId" VARCHAR(255) NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_carts_usuario ON carts("usuarioId");

-- ============================================================================
-- TABLA: cart_items (Items del Carrito)
-- ============================================================================
CREATE TABLE cart_items (
    id VARCHAR(255) PRIMARY KEY,
    cantidad INTEGER NOT NULL,
    "precioUnitario" INTEGER NOT NULL COMMENT 'Precio al momento de agregar al carrito',
    "carritoId" VARCHAR(255) NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    "productoId" VARCHAR(255) NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("carritoId", "productoId")
);

CREATE INDEX idx_cart_items_carrito ON cart_items("carritoId");
CREATE INDEX idx_cart_items_producto ON cart_items("productoId");

-- ============================================================================
-- TRIGGER: Crear carrito automáticamente al crear usuario (OPCIONAL)
-- ============================================================================
-- Nota: Esta es una característica opcional que puedes agregar
-- para crear automáticamente un carrito cuando se registra un usuario

/*
CREATE OR REPLACE FUNCTION crear_carrito_usuario()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO carts (id, "usuarioId", "createdAt", "updatedAt")
    VALUES (gen_random_uuid()::text, NEW.id, NOW(), NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_crear_carrito_usuario
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION crear_carrito_usuario();
*/

-- ============================================================================
-- EJEMPLOS DE DATOS
-- ============================================================================

-- Crear carrito de ejemplo
INSERT INTO carts (id, "usuarioId", "createdAt", "updatedAt")
VALUES ('cart-001', 'user-1', NOW(), NOW());

-- Agregar items al carrito
INSERT INTO cart_items (id, cantidad, "precioUnitario", "carritoId", "productoId", "createdAt", "updatedAt")
VALUES 
  ('ci-1', 2, 2250000, 'cart-001', 'prod-1', NOW(), NOW()),
  ('ci-2', 1, 89900, 'cart-001', 'prod-2', NOW(), NOW());

-- Total: (2 × 2,250,000) + (1 × 89,900) = 4,589,900 centavos = $45,899

-- ============================================================================
-- VISTA: Carrito con totales (OPCIONAL)
-- ============================================================================
/*
CREATE OR REPLACE VIEW v_carrito_totales AS
SELECT 
    c.id,
    c."usuarioId",
    c."createdAt",
    c."updatedAt",
    COUNT(ci.id)::INTEGER AS cantidad_items,
    COALESCE(SUM(ci.cantidad * ci."precioUnitario"), 0)::INTEGER AS total,
    array_agg(
        json_build_object(
            'id', ci.id,
            'cantidad', ci.cantidad,
            'precioUnitario', ci."precioUnitario",
            'subtotal', ci.cantidad * ci."precioUnitario",
            'producto', json_build_object(
                'id', p.id,
                'nombre', p.nombre,
                'precio', p.precio,
                'stock', p.stock
            )
        )
    ) AS items
FROM carts c
LEFT JOIN cart_items ci ON c.id = ci."carritoId"
LEFT JOIN products p ON ci."productoId" = p.id
GROUP BY c.id;
*/

-- ============================================================================
-- NOTAS DE AUDITORÍA
-- ============================================================================

/*
CAMBIOS PRINCIPALES:

1. CARTS (Nueva)
   - Un carrito por usuario (relación UNIQUE 1:1)
   - Se crea automáticamente cuando usuario accede a carrito
   - No se elimina cuando se crea una orden (puede reutilizarse)

2. CART_ITEMS (Nueva)
   - Guarda cantidad y precio unitario
   - Referencia a producto (para obtener datos actuales)
   - Relación compuesta (carritoId, productoId) única
   - Permite detectar cambios de precio

BENEFICIOS:

✅ Persistencia - Carrito permanece entre sesiones
✅ Sincronización - Mismo carrito en todos los dispositivos
✅ Recuperación - Carritos abandonados pueden recuperarse
✅ Análisis - Comportamiento de compra registrado
✅ Flexibilidad - Precios históricos guardados
✅ Seguridad - Validación de stock en tiempo real

OPERACIONES COMUNES:

-- Obtener carrito con totales
SELECT 
    c.id,
    COUNT(ci.id) as cantidad_items,
    SUM(ci.cantidad * ci."precioUnitario") as total
FROM carts c
LEFT JOIN cart_items ci ON c.id = ci."carritoId"
WHERE c."usuarioId" = 'user-123'
GROUP BY c.id;

-- Obtener items del carrito
SELECT 
    ci.id,
    ci.cantidad,
    p.nombre,
    p.precio,
    ci."precioUnitario",
    (ci.cantidad * ci."precioUnitario") as subtotal
FROM cart_items ci
JOIN carts c ON ci."carritoId" = c.id
JOIN products p ON ci."productoId" = p.id
WHERE c."usuarioId" = 'user-123'
ORDER BY ci."createdAt" DESC;

-- Eliminar carrito y sus items (cascada)
DELETE FROM carts WHERE "usuarioId" = 'user-123';
*/
