# 📑 ÍNDICE DE DOCUMENTACIÓN - REFERENCIA RÁPIDA

**Sistema**: Inventory E-Commerce  
**Versión**: 1.0  
**Última Actualización**: 11 Febrero 2026

---

## 🎯 ¿QUÉ NECESITAS?

### "Quiero instalar y ejecutar el sistema"

→ [MANUAL_SISTEMA_COMPLETO.md - Sección 3](MANUAL_SISTEMA_COMPLETO.md#instalación-y-configuración)

### "Quiero entender cómo funciona"

→ [MANUAL_SISTEMA_COMPLETO.md - Sección 2](MANUAL_SISTEMA_COMPLETO.md#stack-tecnológico) + [Sección 3](MANUAL_SISTEMA_COMPLETO.md#arquitectura-del-sistema)

### "Necesito acceder a la API"

→ [MANUAL_SISTEMA_COMPLETO.md - Sección 7](MANUAL_SISTEMA_COMPLETO.md#api-rest---documentación-técnica)

### "¿Cuáles eran los requisitos?"

→ [IEEE_830_ESPECIFICACION.md](IEEE_830_ESPECIFICACION.md)

### "¿Qué se probó?"

→ [MANUAL_CALIDAD.md](MANUAL_CALIDAD.md)

### "¿Cuáles son los riesgos?"

→ [PLAN_RIESGOS.md](PLAN_RIESGOS.md)

### "¿Es el proyecto realmente completado?"

→ [ACTA_CIERRE_PROYECTO.md](ACTA_CIERRE_PROYECTO.md)

### "¿Cuál es la estructura de la base de datos?"

→ [MER_PROYECTO.sql](MER_PROYECTO.sql) o [MER_PROYECTO.puml](MER_PROYECTO.puml)

### "Documentos desactualizados a limpiar"

→ [LIMPIEZA_DOCUMENTACION.md](LIMPIEZA_DOCUMENTACION.md)

---

## 📚 DOCUMENTOS POR PROPÓSITO

### Documentación Técnica (Para Developers)

1. **[MANUAL_SISTEMA_COMPLETO.md](MANUAL_SISTEMA_COMPLETO.md)** - Guía técnica completa
   - Instalación
   - Arquitectura
   - Módulos backend
   - API REST
   - Base de datos
   - Mantenimiento

2. **[MER_PROYECTO.sql](MER_PROYECTO.sql)** - Modelo SQL completo
3. **[MER_PROYECTO.puml](MER_PROYECTO.puml)** - Diagramas UML
4. **[docker-compose.yml](docker-compose.yml)** - Configuración

---

### Documentación Académica (Para Evaluación)

1. **[IEEE_830_ESPECIFICACION.md](IEEE_830_ESPECIFICACION.md)** ⭐ CRÍTICO
   - Requisitos funcionales
   - Requisitos no funcionales
   - Datos y interfaces
   - Criterios de aceptación

2. **[PLAN_RIESGOS.md](PLAN_RIESGOS.md)** ⭐ CRÍTICO
   - Identificación de riesgos
   - Análisis detallado
   - Mitigación implementada
   - Plan de contingencia

3. **[MANUAL_CALIDAD.md](MANUAL_CALIDAD.md)** ⭐ CRÍTICO
   - Pruebas funcionales
   - Pruebas no funcionales
   - Resultados
   - Métricas de calidad

4. **[ACTA_CIERRE_PROYECTO.md](ACTA_CIERRE_PROYECTO.md)** ⭐ CRÍTICO
   - Objetivos cumplidos
     -Entregables
   - Autorización

---

### Documentación de Usuario

1. **[MANUAL_SISTEMA_COMPLETO.md - Manual del Usuario](MANUAL_SISTEMA_COMPLETO.md#manual-del-usuario)**
   - Para clientes
   - Para administradores

---

### Administración de Proyecto

1. **[README.md](README.md)** - Punto de entrada, resumen ejecutivo
2. **[LIMPIEZA_DOCUMENTACION.md](LIMPIEZA_DOCUMENTACION.md)** - Archivos a limpiar

---

## 🔍 BÚSQUEDA POR TEMA

### Autenticación y Seguridad

- Requisitos: [IEEE_830_ESPECIFICACION.md § 4](IEEE_830_ESPECIFICACION.md#seguridad-y-autenticación)
- Implementación: [MANUAL_SISTEMA_COMPLETO.md § 9](MANUAL_SISTEMA_COMPLETO.md#seguridad-y-autenticación)
- Pruebas: [MANUAL_CALIDAD.md § 3.2](MANUAL_CALIDAD.md#seguridad)
- Riesgos: [PLAN_RIESGOS.md § 2.2](PLAN_RIESGOS.md#-r-002-vulnerabilidad-de-seguridad)

### Productos y Categorías

- Requisitos: [IEEE_830_ESPECIFICACION.md § 2 (RF-002 a RF-005)](IEEE_830_ESPECIFICACION.md#rf-002-listar-productos)
- API: [MANUAL_SISTEMA_COMPLETO.md § 7.1](MANUAL_SISTEMA_COMPLETO.md#productos)
- BD: [MER_PROYECTO.sql](MER_PROYECTO.sql) - Tablas `products`, `categories`

### Órdenes y Pedidos

- Requisitos: [IEEE_830_ESPECIFICACION.md § 2 (RF-007 a RF-009)](IEEE_830_ESPECIFICACION.md#rf-007-crear-pedido)
- API: [MANUAL_SISTEMA_COMPLETO.md § 7.4](MANUAL_SISTEMA_COMPLETO.md#-órdenes)
- BD: [MER_PROYECTO.sql](MER_PROYECTO.sql) - Tablas `orders`, `order_items`

### Carrito y Checkout

- Requisitos: [IEEE_830_ESPECIFICACION.md § 2 (RF-006)](IEEE_830_ESPECIFICACION.md#rf-006-agregar-al-carrito)
- Manual: [MANUAL_SISTEMA_COMPLETO.md § 6](MANUAL_SISTEMA_COMPLETO.md#manual-del-usuario)
- Implementación: [MANUAL_SISTEMA_COMPLETO.md § 5.7](MANUAL_SISTEMA_COMPLETO.md#-frontend-e-commerce)

### Base de Datos y Backup

- Esquema: [MER_PROYECTO.sql](MER_PROYECTO.sql)
- Documentación: [MANUAL_SISTEMA_COMPLETO.md § 8](MANUAL_SISTEMA_COMPLETO.md#-base-de-datos)
- Backup: [MANUAL_SISTEMA_COMPLETO.md § 8 (Script)](MANUAL_SISTEMA_COMPLETO.md#script-de-backup)
- Riesgos: [PLAN_RIESGOS.md § 2.1](PLAN_RIESGOS.md#-r-001-corrupción-de-datos-en-bd)

### Rendimiento y Escalabilidad

- Requisitos: [IEEE_830_ESPECIFICACION.md § 3 (RNF-001 a RNF-007)](IEEE_830_ESPECIFICACION.md#rnf-001-rendimiento)
- Pruebas: [MANUAL_CALIDAD.md § 3.2](MANUAL_CALIDAD.md#rendimiento)
- Riesgos: [PLAN_RIESGOS.md § 4](PLAN_RIESGOS.md#-riesgos-de-rendimiento)

### Deployment y DevOps

- Guía: [MANUAL_SISTEMA_COMPLETO.md § 3.4](MANUAL_SISTEMA_COMPLETO.md#-iniciar-servicios)
- Producción: [ACTA_CIERRE_PROYECTO.md § 8](ACTA_CIERRE_PROYECTO.md#para-próxima-fase)
- Mantenimiento: [MANUAL_SISTEMA_COMPLETO.md § 10](MANUAL_SISTEMA_COMPLETO.md#procedimientos-de-mantenimiento)

---

## 🎯 LECTURA RECOMENDADA POR ROL

### Para Aprendiz (Desarrollador)

1. Leer: [README.md](README.md) (10 min)
2. Leer: [MANUAL_SISTEMA_COMPLETO.md](MANUAL_SISTEMA_COMPLETO.md) (30 min)
3. Revisar: [docker-compose.yml](docker-compose.yml)
4. Revisar: [MER_PROYECTO.sql](MER_PROYECTO.sql)
5. Ejecutar: `docker-compose up`

### Para Instructor (Revisor)

1. Revisar: [IEEE_830_ESPECIFICACION.md](IEEE_830_ESPECIFICACION.md) (Requisitos) ✅
2. Revisar: [MANUAL_CALIDAD.md](MANUAL_CALIDAD.md) (Pruebas) ✅
3. Revisar: [PLAN_RIESGOS.md](PLAN_RIESGOS.md) (Riesgos) ✅
4. Revisar: [ACTA_CIERRE_PROYECTO.md](ACTA_CIERRE_PROYECTO.md) (Cierre) ✅
5. Probar: Sistema en vivo

### Para Cliente/Usuario

1. Leer: [MANUAL_SISTEMA_COMPLETO.md - Manual del Usuario](MANUAL_SISTEMA_COMPLETO.md#manual-del-usuario) (20 min)
2. Acceder: http://localhost/public/html/
3. Crear cuenta y comprar producto
4. Para admin: http://localhost/public/html/login-admin.html

### Para DevOps/Operaciones

1. Leer: [MANUAL_SISTEMA_COMPLETO.md § 3](MANUAL_SISTEMA_COMPLETO.md#instalación-y-configuración) (Instalación)
2. Leer: [MANUAL_SISTEMA_COMPLETO.md § 10](MANUAL_SISTEMA_COMPLETO.md#procedimientos-de-mantenimiento) (Mantenimiento)
3. Leer: [PLAN_RIESGOS.md § 6](PLAN_RIESGOS.md#plan-de-contingencia) (Contingencia)
4. Configurar: Backup automático
5. Configurar: Monitoreo

---

## 📊 MATRIZ DE DOCUMENTACIÓN

| Documento                  | Propósito          | Audiencia   | Prioridad     |
| -------------------------- | ------------------ | ----------- | ------------- |
| README.md                  | Punto de entrada   | Todos       | 🔴 CRÍTICA    |
| MANUAL_SISTEMA_COMPLETO.md | Referencia técnica | Developers  | 🔴 CRÍTICA    |
| IEEE_830_ESPECIFICACION.md | Especificación     | Evaluadores | 🔴 CRÍTICA    |
| PLAN_RIESGOS.md            | Gestión de riesgos | Evaluadores | 🔴 CRÍTICA    |
| MANUAL_CALIDAD.md          | Pruebas y calidad  | Evaluadores | 🔴 CRÍTICA    |
| ACTA_CIERRE_PROYECTO.md    | Cierre oficial     | Evaluadores | 🔴 CRÍTICA    |
| MER_PROYECTO.sql           | Modelo BD          | Developers  | 🟡 IMPORTANTE |
| MER_PROYECTO.puml          | Diagramas          | Architects  | 🟡 IMPORTANTE |
| docker-compose.yml         | Configuración      | DevOps      | 🟡 IMPORTANTE |
| LIMPIEZA_DOCUMENTACION.md  | Mantenimiento      | Admins      | 🟢 REFERENCIA |

---

## ✅ CHECKLIST DE DOCUMENTACIÓN

**Verificar que tienes:**

- [x] README.md - Resumen ejecutivo y punto de entrada
- [x] MANUAL_SISTEMA_COMPLETO.md - Documentación técnica
- [x] IEEE_830_ESPECIFICACION.md - Requisitos (Evaluación)
- [x] PLAN_RIESGOS.md - Riesgos y mitigación (Evaluación)
- [x] MANUAL_CALIDAD.md - Pruebas y resultados (Evaluación)
- [x] ACTA_CIERRE_PROYECTO.md - Cierre oficial (Evaluación)
- [x] MER_PROYECTO.sql - Modelo BD
- [x] MER_PROYECTO.puml - Diagramas UML
- [x] docker-compose.yml - Configuración
- [x] Código comentado y documentado
- [x] Scripts de utilidad (backup, etc.)

**Todos verificados**: ✅ **LISTO PARA EVALUACIÓN**

---

## 🔗 ENLACES RÁPIDOS

### Inicio

- [Home](README.md)
- [Manual Técnico](MANUAL_SISTEMA_COMPLETO.md)

### Evaluación

- [Especificación IEEE 830](IEEE_830_ESPECIFICACION.md)
- [Plan de Riesgos](PLAN_RIESGOS.md)
- [Manual de Calidad](MANUAL_CALIDAD.md)
- [Acta de Cierre](ACTA_CIERRE_PROYECTO.md)

### Técnico

- [Modelo ER (SQL)](MER_PROYECTO.sql)
- [Diagramas UML](MER_PROYECTO.puml)
- [Docker Compose](docker-compose.yml)

### Administración

- [Limpieza de Docs](LIMPIEZA_DOCUMENTACION.md)
- [Este Índice](INDICE_DOCUMENTACION.md)

---

**Generado**: 11 Febrero 2026  
**Versión**: 1.0  
**Estado**: ✅ Documentación Completa

🎉 **¡Suite de Documentación Lista!** 🎉
