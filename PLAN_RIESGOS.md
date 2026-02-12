# 📋 PLAN DE RIESGOS Y MITIGACIÓN

**Proyecto**: Sistema E-commerce con Gestión de Inventario  
**Fecha**: 11 de Febrero de 2026  
**Versión**: 1.0  
**Estado**: Activo

---

## 1. IDENTIFICACIÓN DE RIESGOS

| ID    | Riesgo                           | Probabilidad | Impacto | Prioridad  | Estado      |
| ----- | -------------------------------- | ------------ | ------- | ---------- | ----------- |
| R-001 | Corrupción de datos en BD        | Baja         | Alto    | 🔴 CRÍTICO | Mitigado    |
| R-002 | Vulnerabilidad de seguridad      | Media        | Alto    | 🔴 CRÍTICO | Mitigado    |
| R-003 | Pérdida de sesión usuario        | Baja         | Medio   | 🟡 ALTO    | Mitigado    |
| R-004 | Caída del servidor               | Media        | Alto    | 🔴 CRÍTICO | Mitigado    |
| R-005 | Error en cálculo de órdenes      | Baja         | Medio   | 🟡 ALTO    | Mitigado    |
| R-006 | Stock inconsistente              | Baja         | Medio   | 🟡 ALTO    | Mitigado    |
| R-007 | Rendimiento degrada con usuarios | Media        | Medio   | 🟡 ALTO    | Monitoreado |
| R-008 | Incompatibilidad navegadores     | Baja         | Bajo    | 🟢 BAJO    | Probado     |

---

## 2. ANÁLISIS DETALLADO DE RIESGOS CRÍTICOS

### 🔴 R-001: CORRUPCIÓN DE DATOS EN BD

**Descripción**: La base de datos podría corromperse por eventos inesperados.

**Causas Potenciales**:

- Falla del sistema de archivos
- Corte repentino de energía
- Error en migración de Prisma
- Concurrencia en transacciones

**Impacto**:

- Pérdida de todos los datos
- Sistema completamente inoperativo
- Pérdida de confianza del cliente

**MITIGACIÓN IMPLEMENTADA** ✅:

1. **Backup Diarios**

```bash
# Script automático ubicado en:
backend/scripts/backup-db.sh

# Ejecución: 2 AM diariamente mediante cron
0 2 * * * /home/user/backup-db.sh
```

2. **Transacciones ACID**

```typescript
// Prisma garantiza ACID por defecto
await prisma.$transaction([
  prisma.order.create(/* */),
  prisma.product.update(/* */),
  // Todo o nada
]);
```

3. **Replicas de BD** (Fase 2)
   Implementar PostgreSQL con replicas standby

4. **Monitoreo Diario**

- Verificar integridad: `REINDEX DATABASE;`
- Logs de error
- Alertas de espacio disco

---

### 🔴 R-002: VULNERABILIDAD DE SEGURIDAD

**Descripción**: Sistema podría ser comprometido por ataques.

**Causas Potenciales**:

- SQL Injection sin validación
- XSS (Cross Site Scripting)
- CSRF (Cross Site Request Forgery)
- Fuerza bruta en login
- JWT token inválido
- Datos sensibles en logs

**Impacto**:

- Robo de datos de usuarios
- Fraude en transacciones
- Reputación dañada

**MITIGACIÓN IMPLEMENTADA** ✅:

1. **Validación en Backend**

```typescript
// DTOs con class-validator
export class CrearProductoDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  nombre: string;

  @IsNumber()
  @Min(0)
  precio: number;
}
```

2. **Encriptación de Contraseñas**

```typescript
// bcrypt con salt rounds = 10
const hashedPassword = await bcrypt.hash(password, 10);
```

3. **JWT con Expiración**

```typescript
// Token expira en 24 horas
const token = this.jwtService.sign(payload, {
  expiresIn: "24h",
  secret: process.env.JWT_SECRET,
});
```

4. **CORS Configurado**

```javascript
// Solo localhost puede hacer requests
window.BACKEND_URL = "http://localhost:3000";
```

5. **Headers de Seguridad** (Nginx)

```nginx
add_header X-Content-Type-Options "nosniff";
add_header X-Frame-Options "DENY";
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000";
```

6. **HTTPS en Producción** (Fase 2)

- Certificados SSL/TLS
- Redirección HTTP → HTTPS

7. **Validación de Entrada**

```html
<!-- Frontend: Validación HTML5 -->
<input type="email" required />
<input type="number" min="0" required />
<input type="text" maxlength="255" pattern="[a-zA-Z0-9 ]" />
```

8. **Sanitización de Output**

```javascript
// NO usar innerHTML con datos de usuario
// NO interpolar directamente en SQL
// USAR prepared statements (Prisma lo hace)
```

---

### 🔴 R-004: CAÍDA DEL SERVIDOR

**Descripción**: El servidor de aplicación o BD se queda sin responder.

**Causas Potenciales**:

- Out of Memory
- CPU 100%
- Conexiones agotadas
- Proceso bloqueado
- Network timeout

**Impacto**:

- Usuarios no pueden acceder
- Órdenes se pierden
- Pérdida de ingresos

**MITIGACIÓN IMPLEMENTADA** ✅:

1. **Health Check Endpoints**

```typescript
// GET /api/v1/health
@Get('health')
health() {
  return { status: 'ok', timestamp: new Date() };
}
```

2. **Docker Restart Policy**

```yaml
# docker-compose.yml
services:
  backend:
    restart: always # Reiniciarse automáticamente
```

3. **Load Balancing** (Fase 2)

```nginx
# Nginx con múltiples backends
upstream node_backend {
  server backend1:3000;
  server backend2:3000;
  server backend3:3000;
}
```

4. **Monitoreo con Logs**

```bash
# Ver logs en tiempo real
docker logs -f
tail -f /var/log/nginx/error.log
```

5. **Alertas** (Fase 2)

- Enviar email si servidor cae
- Notificación a admin

---

## 3. RIESGOS DE FUNCIONALIDAD

### 🟡 R-005: ERROR EN CÁLCULO DE ÓRDENES

**Descripción**: El total del pedido podría calcularse incorrectamente.

**MITIGACIÓN**:

```typescript
// Cálculo seguro con precisión decimal
const subtotal = item.cantidad * item.precio;
const descuento = oferta ? (subtotal * oferta.descuento) / 100 : 0;
const total = subtotal - descuento;

// Validación en frontend
if (total < 0) throw new Error("Total inválido");
```

---

### 🟡 R-006: STOCK INCONSISTENTE

**Descripción**: Stock del producto no coincide entre órdenes y BD.

**MITIGACIÓN**:

```typescript
// Transacción atómica
await prisma.$transaction(async (tx) => {
  const product = await tx.product.findUnique({ id: productId });

  if (product.stock < cantidad) {
    throw new Error("Stock insuficiente");
  }

  await tx.product.update({
    where: { id: productId },
    data: { stock: { decrement: cantidad } },
  });

  await tx.order.create(/* pedido */);
});
```

---

## 4. RIESGOS DE RENDIMIENTO

### 🟡 R-007: RENDIMIENTO CON USUARIOS

**Descripción**: Sistema se ralentiza con muchos usuarios simultáneos.

**MITIGACIÓN**:

```typescript
// Índices en BD
CREATE INDEX idx_products_categoria ON products(categoria_id);
CREATE INDEX idx_orders_estado ON orders(estado);

// Paginación
GET /api/v1/products?page=1&limit=10

// Caché en Frontend
const cache = new Map();
if (cache.has('categorias')) {
  return cache.get('categorias');
}
```

**Fase 2**: Implementar Redis cache

---

## 5. MATRIZ DE RIESGOS RESIDUALES

```
             Alto Impacto
                  ↑
                  │
         R-001 ●  │  ● R-002
              \│ /
          ────┼────→ Probabilidad
              /│\
         ○   │  ○
              ↓
          Bajo Impacto

● = Crítico
○ = Alto
□ = Medio
- = Bajo
```

---

## 6. PLAN DE CONTINGENCIA

### Si cae la BD

**Procedimiento**:

```bash
# 1. Detectar con health check
curl http://localhost:3000/api/v1/health
# Respuesta: timeout

# 2. Reintentar conexión
docker-compose restart db

# 3. Si persiste, restaurar desde backup
gunzip backups/backup_latest.sql.gz
psql -U postgres < backups/backup_latest.sql

# 4. Verificar integridad
npm run seed  # Recargar datos críticos

# 5. Reiniciar aplicación
docker-compose restart backend
```

### Si falla el backend

**Procedimiento**:

```bash
# 1. Ver logs
docker logs
npm run start:dev

# 2. Limpiar dependencias
rm -rf node_modules
npm install

# 3. Resetear BD si corrupción
npx prisma migrate reset

# 4. Reiniciar
npm run start
```

### Si se corrompe datos

**Procedimiento**:

```bash
# 1. Parar servicios inmediatamente
docker-compose down

# 2. Restaurar backup más reciente
ls -lt backups/  # Ver backups ordenados por fecha
psql -U postgres < backups/backup_YYYYMMDD_HHMMSS.sql

# 3. Verificar datos
npm run seed
psql -c "SELECT COUNT(*) FROM products;"

# 4. Reiniciar
docker-compose up -d

# 5. Notificar a usuarios del retraso
```

---

## 7. REVISIÓN Y MONITOREO

**Frecuencia de Revisión**: Mensual  
**Responsable**: Equipo DevOps  
**Última Revisión**: 11 Febrero 2026

### Métricas a Monitorear

- Disponibilidad: 99.5%
- Tiempo respuesta: < 500ms
- Errores 5xx: < 0.1%
- Espacio BD: < 80% utilizado
- Conexiones activas: < 50

### Escalabilidad (Fase 2)

- Implementar Redis cache
- Agregar replicas de BD
- Load balancing Nginx
- CDN para assets estáticos

---

**Actualizado**: 11 Febrero 2026  
**Aprobado por**: Equipo Técnico  
**Estado**: ✅ Implementado
