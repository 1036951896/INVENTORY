# 📋 LIMPIEZA DE DOCUMENTACIÓN - ARCHIVOS DESACTUALIZADOS

**Fecha**: 11 Febrero 2026  
**Estado**: Documentación actualizada y consolidada

---

## 🗑️ ARCHIVOS QUE PUEDEN SER ELIMINADOS

Los siguientes archivos contienen información antigua o redundante que ya está consolidada en los nuevos documentos maestros.

### **Status: DEPRECATED - ELIMINAR**

| Archivo                                    | Razón                              | Reemplazado por                        |
| ------------------------------------------ | ---------------------------------- | -------------------------------------- |
| `ACTUALIZACION_9_FEBRERO.md`               | Nota de iteración antigua          | MANUAL_SISTEMA_COMPLETO.md             |
| `ALINEACION_CATEGORIAS_REALIZADA.md`       | Documento de seguimiento iterativo | IEEE_830_ESPECIFICACION.md             |
| `CARRITO_PERSISTENTE_GUIA.md`              | Guía rápida desactualizada         | MANUAL_SISTEMA_COMPLETO.md             |
| `ESTADO_ACTUAL_PROYECTO.md`                | Resumen antiguo del proyecto       | README.md + MANUAL_SISTEMA_COMPLETO.md |
| `ESTADO_ACTUAL_PROYECTO.txt`               | Duplicado en texto                 | Eliminar                               |
| `GUIA_DEPLOY_RAPIDO.md`                    | Guía parcial de deployment         | MANUAL_SISTEMA_COMPLETO.md             |
| `GUIA_ENDPOINTS_NUEVAS_FUNCIONALIDADES.md` | Endpoints antiguos                 | MANUAL_SISTEMA_COMPLETO.md             |
| `GUIA_RAPIDA_SOLUCION_404.md`              | Solución a problema específico     | Resuelto, no necesario                 |
| `IMPLEMENTACION_NUEVAS_FUNCIONALIDADES.md` | Registro de cambios iterativos     | Documentación consolidada              |
| `OFERTAS_GUIA_RAPIDA.md`                   | Guía rápida de ofertas             | MANUAL_SISTEMA_COMPLETO.md             |
| `RESUMEN_FINAL_ALINEACION_CATEGORIAS.md`   | Resumen de iteración               | Consolidado                            |
| `RESUMEN_FINAL_IMPLEMENTACION.md`          | Resumen de implementación          | Consolidado                            |
| `RESUMEN_SISTEMA_COMPLETO.md`              | Resumen anterior                   | README.md + MANUAL_SISTEMA_COMPLETO.md |
| `SCHEMA_CARRITO.sql`                       | Schema parcial antiguo             | MER_PROYECTO.sql                       |
| `SCHEMA_NUEVAS_TABLAS.sql`                 | Schema parcial antiguo             | MER_PROYECTO.sql                       |
| `SISTEMA_OFERTAS_COMPLETADO.md`            | Nota de completitud                | IEEE_830_ESPECIFICACION.md             |
| `SOLUCION_ERROR_404_ORDENES.md`            | Solución a bug específico          | Resuelto, no necesario                 |
| `VERIFICACION_CATEGORIAS.md`               | Verificación de iteración          | MANUAL_CALIDAD.md                      |
| `test-reportes.js`                         | Script de test antiguo             | Reemplazado por MANUAL_CALIDAD.md      |

---

## 📊 ARCHIVOS A MANTENER ✅

### Documentación Maestros (NUEVOS - MANTENER)

- ✅ `README.md` - Punto de entrada principal
- ✅ `MANUAL_SISTEMA_COMPLETO.md` - Documentación técnica completa
- ✅ `IEEE_830_ESPECIFICACION.md` - Especificación de requisitos
- ✅ `PLAN_RIESGOS.md` - Identificación y mitigación de riesgos
- ✅ `MANUAL_CALIDAD.md` - Pruebas y control de calidad
- ✅ `ACTA_CIERRE_PROYECTO.md` - Cierre oficial

### Modelos y Diagramas (MANTENER)

- ✅ `MER_PROYECTO.sql` - Modelo entidad-relación
- ✅ `MER_PROYECTO.puml` - Diagramas UML
- ✅ `MER_PROYECTO.json` - Estructura de datos JSON

### Configuración (MANTENER)

- ✅ `docker-compose.yml` - Orquestación de contenedores
- ✅ `package.json` - Dependencias del proyecto
- ✅ `.gitignore` - Control de versiones
- ✅ `backend/.env` - Variables de ambiente

### Código Fuente (MANTENER)

- ✅ `backend/` - API NestJS
- ✅ `frontend/` - React (Vite)
- ✅ `public/` - HTML/CSS/JS
- ✅ `nginx/` - Configuración web
- ✅ `scripts/` - Utilidades

---

## 🧹 PROCESO DE LIMPIEZA RECOMENDADO

### Paso 1: Crear carpeta de archivo

```bash
mkdir old_docs
mv ACTUALIZACION_9_FEBRERO.md old_docs/
mv ALINEACION_CATEGORIAS_REALIZADA.md old_docs/
# ... más archivos ...
```

### Paso 2: Verificar que nueva doc hay

```bash
ls -la *.md
# Debe mostrar:
# README.md ✅
# MANUAL_SISTEMA_COMPLETO.md ✅
# IEEE_830_ESPECIFICACION.md ✅
# PLAN_RIESGOS.md ✅
# MANUAL_CALIDAD.md ✅
# ACTA_CIERRE_PROYECTO.md ✅
```

### Paso 3: Validar que no hay contenido único

Antes de eliminar, buscar en cada archivo por contenido único que no está en nuevos docs.

### Paso 4: Eliminar o archivar

```bash
# Opción A: Eliminar (cuidadoso)
rm ACTUALIZACION_9_FEBRERO.md

# Opción B: Archivar en git
git rm ACTUALIZACION_9_FEBRERO.md
git commit -m "Archive: Remove deprecated documentation"

# Opción C: Mantener en carpeta histórica
mv *.md old_docs/  # Archivar todo
```

---

## 📝 MAPEO DE CONTENIDO

Dónde encontrar cada concepto en la nueva documentación:

| Concepto        | Ubicación                                         |
| --------------- | ------------------------------------------------- |
| Instalación     | MANUAL_SISTEMA_COMPLETO.md § 3                    |
| API REST        | MANUAL_SISTEMA_COMPLETO.md § 7                    |
| Módulos Backend | MANUAL_SISTEMA_COMPLETO.md § 5                    |
| BD Modelo       | MER_PROYECTO.sql / MANUAL_SISTEMA_COMPLETO.md § 8 |
| Usuario Manual  | MANUAL_SISTEMA_COMPLETO.md § 6                    |
| Requisitos      | IEEE_830_ESPECIFICACION.md                        |
| Pruebas         | MANUAL_CALIDAD.md                                 |
| Riesgos         | PLAN_RIESGOS.md § 2-4                             |
| Deployment      | ACTA_CIERRE_PROYECTO.md § 11                      |

---

## ✅ VERIFICACIÓN POST-LIMPIEZA

Después de eliminar archivos desactualizados, verificar:

```bash
# 1. Validar estructura
ls -la *.md
# Debe tener exactamente: README.md + 5 docs maestros + 3 diagramas

# 2. Verificar links en README
# Abrir README.md y comprobar que todos los links funcionan

# 3. Validar git
git status
# No debe haber archivos no rastreados

# 4. Prueba funcional
docker-compose up -d
curl http://localhost/api/v1/health
```

---

## 📦 ARCHIVOS A CONSERVAR EN GIT

```bash
# Mantener estos en repositorio
.git/
.gitignore
backend/
frontend/
public/
nginx/
scripts/
docker-compose.yml
package.json
package-lock.json

# Documentación
README.md
MANUAL_SISTEMA_COMPLETO.md
IEEE_830_ESPECIFICACION.md
PLAN_RIESGOS.md
MANUAL_CALIDAD.md
ACTA_CIERRE_PROYECTO.md
MER_PROYECTO.sql
MER_PROYECTO.puml
MER_PROYECTO.json
```

---

## 🔄 VERSIONADO DE DOCUMENTACIÓN

Para futuras versiones:

```
Versión 1.0 (ACTUAL)
├── README.md
├── MANUAL_SISTEMA_COMPLETO.md
├── IEEE_830_ESPECIFICACION.md
├── PLAN_RIESGOS.md
├── MANUAL_CALIDAD.md
└── ACTA_CIERRE_PROYECTO.md

Versión 2.0 (Fase 2)
├── README.md (actualizado)
├── MANUAL_SISTEMA_COMPLETO_V2.md
├── ...
└── CHANGELOG.md (registrar cambios)
```

---

## 📊 RESUMEN DE CONSOLIDACIÓN

**Archivos Antiguos**: 19  
**Archivos Nuevos**: 6 documentos maestros  
**Reducción**: 68% de documentos redundantes  
**Beneficio**: Mayor claridad, menos confusión, mantenimiento fácil

---

## 🎯 ESTADO ACTUAL DE DOCUMENTACIÓN

```
ANTES (Caótico)
├── 19 archivos .md desactualizados
├── Información duplicada
├── Guías parciales
└── Notas de iteración

DESPUÉS (Consolidado)
├── 5 documentos maestros + README
├── Information centralizada
├── Menú claro de navegación
└── Documentación profesional ✅
```

---

## 🚀 SIGUIENTE PASO

1. ✅ Revisar este documento
2. ⏳ Archivar archivos desactualizados (Paso 1-3)
3. ✅ Validar estructura post-limpieza
4. ✅ Hacer commit a git
5. ✅ Documentación consolidada lista

---

**Generado**: 11 Febrero 2026  
**Responsable**: Equipo de Documentación  
**Estado**: ✅ Listo para implementar
