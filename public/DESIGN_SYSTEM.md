# 📐 StoreHub Design System v2.0
## Sistema de Diseño Visual para E-Commerce de Hogar Masivo

---

## 🎨 PALETA DE COLORES

### Colores Primarios
```css
--azul-oscuro: #386273     /* Color principal, headers, títulos */
--azul-claro: #B6E1F2      /* Backgrounds claros, highlights */
--blanco: #FFFFFF          /* Fondo principal, cards */
```

### Colores Secundarios & Estados
```css
--exito: #27AE60           /* Confirmaciones, precios, CTAs positivas */
--error: #E74C3C           /* Errores, advertencias críticas */
--warning: #F39C12         /* Alertas, información importante */
--info: #3498DB            /* Información general */

/* Color cálido para warnings (reemplaza el amarillo fluorescente) */
--warning-caldo: #fffbea   /* Fondo de avisos suave */
```

### Colores Neutrales
```css
--gris-claro: #F5F5F5      /* Backgrounds secundarios */
--gris-oscuro: #666666     /* Texto secundario */
--borde: #E8ECF1           /* Bordes sutiles */
--fondo-pagina: #f4f6f8    /* Fondo de página */
```

---

## 📝 TIPOGRAFÍA

### Familia de Fuente
```css
--fuente-principal: 'Inter', 'Poppins', 'Roboto', sans-serif;
```

### Pesos & Espaciado
```css
font-weight: 400;  /* Normal (body text) */
font-weight: 500;  /* Medium (labels, small headers) */
font-weight: 600;  /* Semibold (subheaders) */
font-weight: 800;  /* Bold (números, ofertas) */

letter-spacing: 0.8px;   /* Labels pequeños */
letter-spacing: 1.5px;   /* Números importantes */
```

### Tamaños Jerárquicos
```css
/* Títulos */
h1, .titulo-principal: 1.8rem (28.8px) - font-weight: 600
h2, .subtitulo: 1.6rem (25.6px)
h3, .titulo-seccion: 1.4rem (22.4px)

/* Body */
.parrafo: 0.95rem (15.2px) - line-height: 1.4
.texto-pequeño: 0.9rem (14.4px)
.etiqueta: 0.8rem (12.8px) - font-weight: 600

/* Casos especiales */
.numero-grande: 1.8rem - font-weight: 800 - font-family: monospace
.precio: 1rem (16px) - font-weight: 600 - color: #27AE60
```

---

## 📦 ESPACIADO (PADDING & MARGIN)

### Sistema de Spacing Compactado
```css
/* NO usar valores inflados como 2.5rem, 3rem, etc */
0.3rem  (4.8px)   /* Micro espacios */
0.4rem  (6.4px)   /* Espacios muy pequeños */
0.6rem  (9.6px)   /* Espacios pequeños */
0.8rem  (12.8px)  /* Compactado */
1rem    (16px)    /* Estándar */
1.2rem  (19.2px)  /* Respirable */
1.5rem  (24px)    /* Separación clara */

/* EVITAR: 2rem, 2.5rem, 3rem = INFLACIÓN VISUAL */
```

### Aplicaciones Comunes
```css
/* Headers */ 
.header {
  padding: 1rem 1.2rem;  /* NO 1.5rem */
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}

/* Cards / Productos */
.card {
  padding: 0.9rem 1rem;   /* Compactado */
  gap: 0.8rem;            /* Separación contenido */
  margin-bottom: 1rem;
}

/* Modales / Paneles */
.modal-contenedor {
  padding: 2rem 2.2rem;   /* Principal + lateral = respirable */
  border-radius: 16px;
}

/* Botones */
.btn {
  padding: 0.9rem 1.5rem;
  gap: 0.5rem;            /* Ícono + texto */
}

/* Separadores */
.seccion-titulo { margin-bottom: 1.5rem; }
.item-separador { border-bottom: 1px solid #E8ECF1; padding: 0.6rem 0; }
```

---

## 🎭 SOMBRAS & EFECTOS

### Sistema de Sombras Sutil
```css
/* Hover leve (cards interactivas) */
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

/* Elevación media (tooltips, modales secundarios) */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

/* Elevación alta (modales principales, carrito) */
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);

/* Carrito/Paneles fijos */
box-shadow: -12px 0 60px rgba(0, 0, 0, 0.15);

/* NO usar sombras grandes: 0 12px 40px, 0 20px 60px = INFLADO */
```

### Bordes & Separadores
```css
border: 1px solid #E8ECF1;    /* Bordes sutiles */
border-radius: 8px;            /* Cards, inputs */
border-radius: 12px;           /* Modales, grandes áreas */
border-radius: 16px;           /* Contenedores principales */
```

---

## 🎬 ANIMACIONES & TRANSICIONES

### Duración Estándar
```css
transition: all 0.3s ease;     /* Cambios normales */
transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);  /* Entrada suave */
animation: slideIn 0.3s ease;  /* Aparecer elementos */
animation: bounce 2s infinite; /* Atención suave */
```

### Propiedades Animadas
```css
transform: translateY(-2px);   /* Hover elevation */
opacity: 0 → 1;                /* Fade in/out */
transform: scaleX/Y(1.05);     /* Zoom sutil en hover */
```

---

## 📐 COMPONENTES & MEDIDAS

### Productos / Cards
```css
.producto-imagen {
  width: 70px;               /* Compactado, NO 90px */
  height: 70px;
  border-radius: 6px;
  object-fit: cover;
}

.producto-card {
  padding: 0.9rem 1rem;
  gap: 0.8rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.producto-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
```

### Carrito Sidebar
```css
.carrito-panel {
  width: 500px;              /* Escritorio */
  max-width: 95vw;           /* Mobile */
  position: fixed;
  right: -500px;             /* Cerrado */
  top: 0;
  height: 100vh;
  z-index: 9999;             /* Por debajo de modales (10000) */
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.carrito-panel.activo {
  right: 0;                  /* Abierto */
}
```

### Modales & Overlays
```css
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);  /* Transparencia */
  z-index: 10000;                   /* Por encima de carrito (9999) */
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-contenido {
  background: white;
  border-radius: 16px;
  padding: 2rem 2.2rem;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}
```

### Botones
```css
.btn {
  padding: 0.9rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-principal {
  background: #007bff;
  color: white;
}

.btn-principal:hover {
  background: #0056b3;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,123,255,0.3);
}

.btn-secundario {
  background: #E8ECF1;
  color: #386273;
}

.btn-secundario:hover {
  background: #D8DCE1;
}
```

---

## 🔔 NOTIFICACIONES (ALERT2)

```css
/* Toast notification superior derecha */
position: fixed;
top: 20px;
right: 20px;
z-index: 99999;   /* Por encima de todo */
padding: 1rem 1.5rem;
border-radius: 8px;
box-shadow: 0 8px 16px rgba(0,0,0,0.3);
max-width: 320px;
font-weight: 500;

/* Colores por tipo */
success: #27AE60
error: #E74C3C
warning: #F39C12
info: #3498DB

/* Animación entrada/salida */
animation: slideInRight 0.4s ease-out;   /* Entrada */
animation: slideOutRight 0.3s ease-in;   /* Salida */
```

---

## 📱 RESPONSIVE BREAKPOINTS

```css
/* Desktop */
@media (min-width: 1024px) {
  /* Full layout */
}

/* Tablet */
@media (max-width: 768px) {
  padding: -10%;
  font--size: -5%;
}

/* Mobile */
@media (max-width: 600px) {
  padding: -15%;  /* Reduce más */
  .carrito-panel { width: 100%; }
  .modal-contenido { width: 95%; padding: 1.5rem 1.2rem; }
  .btn { padding: 0.85rem 1rem; }
  gap: -20%;
}
```

---

## ✅ PRINCIPIOS CLAVE

### 1️⃣ **NO INFLAR VISUALMENTE**
```css
❌ EVITAR: padding: 2.5rem, 3rem, 3.5rem, 4rem
❌ EVITAR: margin: 2rem o superior
❌ EVITAR: box-shadow: 0 12px 40px, 0 20px 60px
❌ EVITAR: font-size: 2rem en títulos normales
✅ USAR: Valores compactados: 0.9rem, 1rem, 1.2rem, 1.5rem
```

### 2️⃣ **MANTENER JERARQUÍA VISUAL**
```css
✅ Títulos principales: más grandes, peso 600
✅ Subtítulos: medianos, peso normal
✅ Body text: pequeño, peso 400
```

### 3️⃣ **SOMBRAS SUTILES**
```css
✅ Sombras max: 0 4px 16px rgba(0,0,0,0.1)
❌ EVITAR: 0 12px 40px o superior = INFLACIÓN
```

### 4️⃣ **Z-INDEX HIERARCHY**
```
99999 ← Notificaciones (alert2)
10000 ← Modales, overlays
9999  ← Carrito sidebar
1000+ ← Dropdown, tooltips
100   ← Cards, content
0     ← Background
```

### 5️⃣ **ESPACIADO RESPONSABLE**
```css
✅ Respiración visual sin exceso
✅ Contenedor padding: 2rem máximo
✅ Item padding: 0.8rem - 1.2rem
✅ Gap entre elementos: 0.6rem - 1rem
```

---

## 🎨 VARIABLES CSS LISTAS PARA COPIAR

```css
:root {
  /* Colores principales */
  --azul-oscuro: #386273;
  --azul-claro: #B6E1F2;
  --blanco: #FFFFFF;
  --gris-claro: #F5F5F5;
  --gris-oscuro: #666666;
  --exito: #27AE60;
  --error: #E74C3C;
  --warning: #F39C12;
  --warning-caldo: #fffbea;
  --info: #3498DB;
  --borde: #E8ECF1;
  --fondo-pagina: #f4f6f8;
  
  /* Tipografía */
  --fuente-principal: 'Inter', 'Poppins', 'Roboto', sans-serif;
  
  /* Z-index */
  --z-notificacion: 99999;
  --z-modal: 10000;
  --z-carrito: 9999;
  --z-dropdown: 1000;
  --z-content: 100;
}
```

---

## 📋 CHECKLIST PARA NUEVAS SECCIONES

- [ ] Paleta de colores: Solo azul oscuro, azul claro, blanco, grises
- [ ] Padding contenedor: máx 2rem (NO 3rem+)
- [ ] Sombra: max 0 4px 16px (NO 0 12px 40px)
- [ ] Font-size principal: 0.95rem - 1rem (NO 1.1rem+)
- [ ] Títulos: 1.4rem - 1.8rem (NO 2rem+)
- [ ] Espaciado entre elementos: 0.8rem - 1.5rem
- [ ] Z-index: Solo si necesario (respuesta modales/notificaciones)
- [ ] Animaciones: 0.3s-0.4s ease
- [ ] Bordes: 1px solid #E8ECF1 (sutil)
- [ ] Border-radius: 8px (cards), 12px (modales), 16px (principal)
- [ ] Responsive: Reducir 10-15% en mobile
- [ ] Contraste: Mínimo AA (WCAG)

---

**Versión:** 2.0 - StoreHub Design System
**Última actualización:** Febrero 2026
**Aplicable a:** index.html, detalle-producto.html, ofertas.html, confirmacion-pedido.html
