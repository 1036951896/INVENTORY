# Referencia de Iconos SVG - StoreHub

## Actualización: Todos los Iconos Convertidos a SVG

Se han reemplazado todos los emojis y iconos de la aplicación por SVG profesionales y escalables para mejorar la consistencia visual.

### ✅ Cambios Realizados

#### 1. **Logo Actualizado**

- **Ubicación**: `public/assets/logo.svg`
- **Cambio**: De "Inventory" con checkmark a "StoreHub" con bolsa de compras
- **Características**:
  - Fondo con gradiente profesional
  - Bolsa de compras (símbolo de ecommerce)
  - Checkmark verde indicando compra exitosa
  - Colores coherentes con la paleta de StoreHub

#### 2. **Iconos SVG Reutilizables**

- **Ubicación**: `public/assets/icons.svg`
- El archivo contiene símbolos SVG que pueden utilizarse con:
  ```html
  <svg><use xlink:href="../assets/icons.svg#icon-cart"></use></svg>
  ```

#### 3. **Reemplazos de Emojis por SVG**

**Dashboard (admin.html)**:

- 📊 → SVG Gráfico (Ventas)
- 📦 → SVG Paquete (Productos)
- 🚚 → SVG Camión (Entregas)
- 👥 → SVG Usuarios
- ⚙️ → SVG Engranaje (En Preparación)
- ✅ → SVG Checkmark (Entregados)
- ⚠️ → SVG Alerta (Sin Stock)
- 🔔 → SVG Campana (Notificaciones)
- 🏢 → SVG Usuario/Perfil

**Carrito (index.html)**:

- 📍 → SVG Ubicación
- 🔄 → SVG Refresh
- 💳 → SVG Tarjeta de Crédito
- 🏦 → SVG Banco
- 💰 → SVG Dinero
- 📱 → SVG Teléfono
- ⏰ → SVG Reloj

**Producto (detalle-producto.html)**:

- 🛒 → SVG Carrito

**Confirmación y Estados**:

- ✅ → SVG Checkmark
- ❌ → SVG Error
- ⏳ → SVG Reloj
- 📦 → SVG Paquete
- 🚚 → SVG Camión

### 📀 Paleta de Colores StoreHub

```
Primario: #386273 (Azul oscuro)
Secundario: #5a8fa3 (Azul medio)
Terciario: #B6E1F2 (Azul claro)
Éxito: #4CAF50 (Verde)
Advertencia: #ff9800 (Naranja)
Error: #f44336 (Rojo)
Blanco: #ffffff
```

### 🎨 Cómo Usar los Iconos

#### Opción 1: SVG Inline Directo

```html
<svg
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  width="24"
  height="24"
>
  <circle cx="9" cy="21" r="1"></circle>
  <circle cx="20" cy="21" r="1"></circle>
  <path
    d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
  ></path>
</svg>
```

#### Opción 2: Archivo de Símbolos (Recomendado para reutilización)

```html
<svg><use xlink:href="../assets/icons.svg#icon-cart"></use></svg>
```

### 📋 Lista de Iconos Disponibles

| ID              | Descripción          | Uso                           |
| --------------- | -------------------- | ----------------------------- |
| `icon-cart`     | Carrito de compras   | Botones de compra             |
| `icon-check`    | Checkmark/Éxito      | Estados positivos             |
| `icon-error`    | Error/Cancelación    | Estados negativos             |
| `icon-location` | Ubicación/Dirección  | Dirección de entrega          |
| `icon-refresh`  | Refrescar/Actualizar | Botones de actualización      |
| `icon-package`  | Paquete              | Productos, pedidos            |
| `icon-clock`    | Reloj/Tiempo         | Estados pendientes            |
| `icon-settings` | Engranaje            | Configuración, en preparación |
| `icon-chart`    | Gráfico              | Estadísticas, ventas          |
| `icon-truck`    | Camión/Entrega       | Envíos                        |
| `icon-alert`    | Alerta/Advertencia   | Advertencias                  |
| `icon-download` | Descarga             | Exportar datos                |
| `icon-user`     | Usuario              | Perfil, usuarios              |
| `icon-search`   | Búsqueda             | Campo de búsqueda             |
| `icon-mail`     | Email                | Contacto                      |

### ✨ Ventajas de SVG sobre Emojis

1. **Escalabilidad**: Se adaptan a cualquier tamaño sin perder calidad
2. **Consistencia**: Mismo estilo visual en todos los navegadores
3. **Accesibilidad**: Mejor soporte para lectores de pantalla
4. **Personalización**: Fácil ajuste de colores y estilos
5. **Rendimiento**: Reducen dependencia de fuentes Unicode
6. **Profesionalismo**: Apariencia más pulida y consistente

### 🔧 Customización de Colores

Para cambiar el color de un SVG inline:

```html
<svg viewBox="0 0 24 24" fill="none" stroke="#386273" stroke-width="2">
  <!-- Contenido -->
</svg>
```

O usar CSS:

```css
svg {
  stroke: #386273;
  color: #386273;
}
```

### 📝 Notas Importantes

- Todos los SVG están optimizados para web
- Utilizan `stroke="currentColor"` para heredar color del texto padre
- Mantienen proporciones 24x24 para consistencia
- Compatible con navegadores modernos
- Se han removido todos los emojis unicode del código visible

### 🚀 Próximos Pasos Sugeridos

1. Crear estilos CSS reutilizables para variaciones de iconos
2. Implementar animaciones SVG para interactividad
3. Crear conjunto de iconos para categorías de productos
4. Optimizar SVG con herramientas como SVGO

---

**Última actualización**: 16 de Febrero 2026
**Versión**: 1.0
