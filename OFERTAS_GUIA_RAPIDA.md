# 🎉 Sistema de Ofertas - Guía Rápida de Uso

## ¿Qué se implementó?

### 1. **Página de Ofertas** (`ofertas.html`)
Una página dedicada donde los clientes ven productos con descuento.

**Características:**
- Banner rojo promocional
- Productos con badges de descuento (-30%, -20%, etc.)
- Precios: original (tachado) y final (en rojo)
- Filtros por categoría
- Búsqueda integrada
- Carrito integrado
- Totalmente responsivo

### 2. **Panel Admin - Sección Ofertas**
Los administradores pueden crear, editar y eliminar ofertas.

**Características:**
- Tabla con todas las ofertas activas
- Botón "+ Nueva Oferta"
- Modal para crear/editar
- Preview automático de precios
- Validaciones integradas

### 3. **Sistema de Sincronización**
Los cambios en el admin se reflejan en tiempo real en la página de ofertas.

---

## Como Usar

### Para el Cliente (Página de Ofertas)

**Acceso:**
```
Homepage → Botón "Ver ofertas" → ofertas.html
```

**Qué ver:**
- Todos los productos marcados como oferta
- Descuento en porcentaje (esquina superior derecha)
- Precio original ~~tachado~~
- Precio final en rojo (con descuento aplicado)
- Carrito integrado

### Para el Admin (Gestión de Ofertas)

**Acceso:**
```
Admin Panel → Menú lateral "🎉 Ofertas"
```

**Para crear una oferta:**
1. Haz clic en "+ Nueva Oferta"
2. Selecciona un producto del dropdown
3. Ingresa el descuento (ej: 20 para -20%)
4. Sistema calcula automáticamente el precio final
5. Haz clic en "Guardar Oferta"

**Para editar una oferta:**
1. En la tabla de ofertas, haz clic en "Editar"
2. Modifica el descuento
3. Haz clic en "Guardar"

**Para eliminar:**
1. Haz clic en "Eliminar"
2. Confirma la eliminación

---

## Ejemplo Práctico

### Crear una oferta de 30% en "PAPA CAFÉ x 2.5"

**Paso 1: En Admin**
```
Panel Admin → 🎉 Ofertas → + Nueva Oferta
```

**Paso 2: Completar formulario**
```
Producto:   PAPA CAFÉ X 2.5 FARM FRITES - $22,500
Descuento:  30
            ↓ Sistema calcula automáticamente ↓
Precio Original: $22,500
Precio Final:    $15,750
```

**Paso 3: Guardar**
```
Botón "Guardar Oferta"
→ Oferta guardada
→ Aparece en tabla de ofertas
```

**Paso 4: Ver como cliente**
```
En ofertas.html:
- Producto aparece con badges "-30%"
- Precio $22,500 tachado
- Precio $15,750 en rojo (destacado)
- Puede agregar al carrito por $15,750
```

---

## Estructura de Datos

### Ofertas (localStorage key: "ofertas")
```javascript
[
  {
    id: "oferta_1707340400000",      // ID único
    productoId: "1",                  // ID del producto
    descuento: 30,                    // Porcentaje (1-100)
    fechaCreacion: "2026-02-09...",  // Timestamp
    activa: true                      // Estado
  },
  // ... más ofertas
]
```

---

## Archivos Creados/Modificados

| Archivo | Cambio |
|---------|--------|
| `public/html/ofertas.html` | ✅ CREADO - Página de ofertas |
| `public/js/ofertas.js` | ✅ CREADO - Lógica frontend |
| `public/html/index.html` | 🔄 ACTUALIZADO - Botón funcional |
| `public/html/admin.html` | 🔄 ACTUALIZADO - Sección ofertas |
| `public/js/admin.js` | 🔄 ACTUALIZADO - Gestión ofertas |

---

## Funciones Útiles (JavaScript)

```javascript
// Carrgar todas las ofertas
const ofertas = cargarOfertasAdmin();

// Agregar oferta (desde admin)
agregarOferta(productoId, descuentoPorcentaje);

// Eliminar oferta
eliminarOferta(productoId);

// Verificar si un producto tiene oferta
if (tieneOferta('5')) {
  console.log('¡Este producto tiene oferta!');
}

// Obtener porcentaje de descuento
const descuento = obtenerDescuentoOferta('5');
console.log('Descuento: -' + descuento + '%');

// Contar ofertas activas
const total = contarOfertas();
console.log('Total de ofertas: ' + total);
```

---

## Validaciones

✅ **Admin:**
- Descuento entre 1% y 100%
- No permite ofertas duplicadas (un producto = una oferta)
- Validación de campos requeridos
- Preview de precios antes de guardar

✅ **Frontend:**
- Carga de ofertas desde localStorage
- Sincronización automática entre pestañas
- Cálculo correcto de precios finales
- Filtros dinámicos

---

## Testing Rápido

### En Admin
```javascript
// Abre DevTools (F12) → Console
localStorage.setItem('ofertas', JSON.stringify([
  {
    id: 'test1',
    productoId: '1',
    descuento: 20,
    fechaCreacion: new Date().toISOString(),
    activa: true
  }
]));
```

### En Ofertas
```javascript
// En consola
console.log(ofertas);           // Ver ofertas cargadas
console.log(tieneOferta('1'));  // true si existe
console.log(obtenerDescuentoOferta('1')); // 20
```

---

## Características Destacadas

🎯 **Sincronización en Tiempo Real**
- Cambios en admin = Cambios inmediatos en ofertas.html

🎯 **Diseño Profesional**
- Colores: Rojo (#d4183d) para destacar ofertas
- Badges con descuentos
- Precios originales vs finales bien diferenciados

🎯 **Integración Completa**
- Se integra con carrito existente
- Usa las mismas categorías del sistema
- Compatible con búsqueda existente

🎯 **Sin Backend Requerido**
- Usa localStorage para persistencia
- Funciona offline
- Datos sincronizados entre pestañas

---

## Troubleshooting

**"No veo ofertas"**
```
→ Verifica que creaste una en admin
→ Actualiza la página (Ctrl+F5)
→ Abre console y ejecuta: console.log(cargarOfertasAdmin())
```

**"El precio no se actualiza"**
```
→ Verifica que ingresaste un descuento válido (1-100)
→ Actualiza la página
→ Limpia caché del navegador
```

**"No puedo crear oferta"**
```
→ Verifica que el producto existe
→ Verifica que el descuento es numérico
→ Comprueba que el producto no ya tiene oferta
```

---

## Próximas Mejoras (Futuro)

- [ ] Ofertas con fecha de vencimiento
- [ ] Múltiples descuentos por producto
- [ ] Reportes de ofertas más usadas
- [ ] Notificaciones de nueva oferta a clientes
- [ ] Cupones de descuento adicionales
- [ ] Historial de cambios en ofertas

---

## Status

✅ **COMPLETAMENTE FUNCIONAL Y LISTO PARA USAR**

```
✓ Página de ofertas funciona
✓ Admin puede crear ofertas
✓ Admin puede editar ofertas
✓ Admin puede eliminar ofertas
✓ Sincronización en tiempo real
✓ Precios se calculan correctamente
✓ Carrito integrado
✓ Responsive en móvil
```

---

## Links

- 📄 Documento técnico: [SISTEMA_OFERTAS_COMPLETADO.md](SISTEMA_OFERTAS_COMPLETADO.md)
- 🌐 Página ofertas: [http://localhost:8000/html/ofertas.html](http://localhost:8000/html/ofertas.html)
- 🔧 Admin panel: [http://localhost:8000/html/admin.html](http://localhost:8000/html/admin.html)
- 🏠 Homepage: [http://localhost:8000/html/index.html](http://localhost:8000/html/index.html)

---

**¡Listo para usar! 🚀**
