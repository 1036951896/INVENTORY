-- ============================================================
-- MODELO ENTIDAD-RELACIÓN - PROYECTO INVENTARIO
-- ============================================================

-- ENUM: Rol de Usuario
-- Values: ADMIN, CLIENTE
CREATE TYPE user_role AS ENUM ('ADMIN', 'CLIENTE');

-- ENUM: Estado de Orden
-- Values: PENDIENTE, EN_PREPARACION, ENTREGADO, CANCELADO
CREATE TYPE order_status AS ENUM ('PENDIENTE', 'EN_PREPARACION', 'ENTREGADO', 'CANCELADO');

-- ============================================================
-- TABLA: USERS (Usuarios del sistema)
-- ============================================================
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    rol user_role DEFAULT 'CLIENTE',
    activo BOOLEAN DEFAULT true,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- ============================================================
-- TABLA: CATEGORIES (Categorías de productos)
-- ============================================================
CREATE TABLE categories (
    id VARCHAR(255) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL UNIQUE,
    descripcion TEXT,
    icono VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLA: PRODUCTS (Productos del inventario)
-- ============================================================
CREATE TABLE products (
    id VARCHAR(255) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio INTEGER NOT NULL, -- Precio en centavos de COP
    stock INTEGER DEFAULT 0,
    imagen VARCHAR(255),
    activo BOOLEAN DEFAULT true,
    categoriaId VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoriaId) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE INDEX idx_products_categoriaId ON products(categoriaId);
CREATE INDEX idx_products_nombre ON products(nombre);

-- ============================================================
-- TABLA: ORDERS (Órdenes/Pedidos)
-- ============================================================
CREATE TABLE orders (
    id VARCHAR(255) PRIMARY KEY,
    numero VARCHAR(255) NOT NULL UNIQUE, -- Ej: PED-1234567890
    total INTEGER NOT NULL, -- Total en centavos de COP
    estado order_status DEFAULT 'PENDIENTE',
    usuarioId VARCHAR(255) NOT NULL,
    entregaEn TIMESTAMP,
    notasEntrega TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuarioId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_orders_usuarioId ON orders(usuarioId);
CREATE INDEX idx_orders_numero ON orders(numero);

-- ============================================================
-- TABLA: ORDER_ITEMS (Items dentro de una orden)
-- ============================================================
CREATE TABLE order_items (
    id VARCHAR(255) PRIMARY KEY,
    cantidad INTEGER NOT NULL,
    precioUnitario INTEGER NOT NULL, -- Precio al momento de la orden (centavos)
    subtotal INTEGER NOT NULL, -- cantidad × precioUnitario
    ordenId VARCHAR(255) NOT NULL,
    productoId VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ordenId) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (productoId) REFERENCES products(id) ON DELETE RESTRICT,
    UNIQUE(ordenId, productoId)
);

CREATE INDEX idx_order_items_ordenId ON order_items(ordenId);
CREATE INDEX idx_order_items_productoId ON order_items(productoId);

-- ============================================================
-- RELACIONES
-- ============================================================
-- USER (1) ----> (N) ORDER
-- CATEGORY (1) ----> (N) PRODUCT
-- ORDER (1) ----> (N) ORDER_ITEM
-- PRODUCT (1) ----> (N) ORDER_ITEM
