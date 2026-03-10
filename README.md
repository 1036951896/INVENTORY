# 📦 StoreHub - E-Commerce Inventory System

**Versión**: 2.0 | **Estado**: ✅ En Producción en Render | **Stack**: React + NestJS + PostgreSQL

Sistema moderno de e-commerce con gestión integral de inventario, órdenes y ofertas. Totalmente funcional en producción.

---

## 🚀 Estructura del Proyecto

```
├── frontend/                    # React 19 + Vite + React Router
│   ├── src/
│   │   ├── components/         # Componentes reutilizables
│   │   ├── pages/              # Páginas (Home, Login, ProductDetail, etc)
│   │   ├── services/           # APIs y servicios
│   │   ├── context/            # React Context (Carrito)
│   │   └── styles/             # CSS modular
│   ├── server.js               # Express para SPA routing
│   └── package.json
│
├── backend/                     # NestJS + PostgreSQL
│   ├── src/
│   │   ├── modules/            # Módulos (Products, Orders, Auth, etc)
│   │   ├── prisma/             # Configuración ORM
│   │   └── health/             # Health check
│   ├── Dockerfile
│   └── package.json
│
├── nginx/                       # Configuración Nginx (producción)
│   └── nginx.conf
│
├── legacy/                      # 📚 Código anterior a React
│   ├── html-css-js-inicial/    # HTML/CSS/JS original
│   └── README.md               # Explicación
│
├── render.yaml                  # Configuración Auto-Deploy Render
└── .vscode/                     # Configuración VS Code
```

---

## 🎯 URLs en Producción

> **Frontend**: https://inventory-2-sewi.onrender.com  
> **Backend**: https://inventory-1-jkh2.onrender.com  
> **API Base**: https://inventory-1-jkh2.onrender.com/api/v1

---

## 🏃 Quick Start

### Desarrollo Local

```bash
# Frontend (React dev server)
cd frontend
npm install
npm run dev          # http://localhost:5173

# Backend (en otra terminal)
cd backend
npm install
npm run start:dev    # http://localhost:3000
```

### Build para Producción

```bash
# Frontend
cd frontend
npm run build        # Genera dist/

# Backend (Docker)
docker build -t inventory-backend:latest .
```

---

## 🔄 Deploy en Render

El repositorio está configurado con **auto-deploy** mediante `render.yaml`:

1. **Frontend**: Web Service Node.js
   - Build: `npm install && npm run build`
   - Start: `npm start` (Express server)

2. **Backend**: Web Service Docker
   - Build: Dockerfile automático
   - Expone puerto 3000

**Proceso automático**: Push a `main` → Render detecta cambios → Deploy automático

---

## ✨ Características

- ✅ **E-Commerce Completo**: Catálogo, carrito, checkout, órdenes
- ✅ **Autenticación**: Login/Registro de clientes y admin
- ✅ **Admin Panel**: Gestión de productos, órdenes, categorías y ofertas
- ✅ **SPA Routing**: React Router con fallback a index.html
- ✅ **Base de Datos**: PostgreSQL con Prisma ORM
- ✅ **Notificaciones**: Sonner para feedback visual
- ✅ **Responsive**: Mobile-first design
- ✅ **Scroll automático**: Al navegar a nuevas páginas

---

## 🛠️ Tech Stack

| Capa | Tecnología | 
|------|-----------|
| **Frontend** | React 19 + TypeScript |
| **Build** | Vite ^5 |
| **Backend** | NestJS + TypeScript |
| **Database** | PostgreSQL 14+ |
| **ORM** | Prisma |
| **Auth** | JWT |
| **Hosting** | Render.com |

---

## 📁 Carpeta `legacy/`

La carpeta **`legacy/`** contiene el código HTML/CSS/JS original anterior a la migración a React.

**¿Por qué está aquí?**
- Referencia histórica del proyecto
- Documentación de evolución
- **⚠️ NO está en producción** - Solo para consulta

Ver [legacy/README.md](legacy/README.md) para más detalles.

---

## 🚀 Pasos al Deployar

1. **Commit & Push** a `main`
   ```bash
   git add .
   git commit -m "Descripción del cambio"
   git push origin main
   ```

2. **Render detecta automáticamente** el cambio

3. **Build inicia automáticamente**
   - Frontend: `npm install && npm run build`
   - Backend: Docker build

4. **Deploy completado** - Los cambios son visibles en producción

---

## 🐛 Problemas Comunes

### Frontend muestra 404 en rutas SPA
✅ **Solucionado**: `server.js` hace fallback a `index.html` para todas las rutas

### Backend responde lentamente (Plan gratuito Render)
✅ **Normal**: 30-60s cold start en plan gratuito

### Scroll va al footer al navegar
✅ **Solucionado**: Scroll automático al inicio en todas las páginas dinámicas

---

## 📚 Documentación por Componente

### Frontend
- **Pages**: Home, ProductDetail, Checkout, OrderConfirmation, OrderTracking, PublicOffers
- **Components**: Header, Hero, ProductGrid, Categories, CartPanel
- **Services**: products-service, auth-service, admin-api-service
- **Context**: CartContext para estado global del carrito

### Backend
- **Modules**: products, orders, categories, offers, auth, users
- **Database**: Prisma schema con relaciones completas
- **Authentication**: JWT con roles (admin/cliente)

---

## 📞 Desarrollo

**Team**: 1 Desarrollador  
**Última actualización**: Marzo 9, 2026  
**Status**: ✅ Completamente Funcional

---

**Stack limpio, moderno y en producción. 🎉**
