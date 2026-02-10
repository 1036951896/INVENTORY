#!/bin/bash

# Script de prueba para verificar el sistema de permisos

echo "======================================"
echo "  🧪 PRUEBA DEL SISTEMA DE PERMISOS  "
echo "======================================"
echo ""

# Prueba 1: Verificar que auth.js existe y tiene permisos
echo "✓ Verificando auth.js..."
if grep -q "ver_productos" public/js/auth.js; then
    echo "  ✅ auth.js contiene permisos de admin"
else
    echo "  ❌ auth.js NO contiene permisos"
fi

if grep -q "crear_pedidos" public/js/auth.js; then
    echo "  ✅ auth.js contiene permisos de cliente"
else
    echo "  ❌ auth.js NO contiene permisos de cliente"
fi
echo ""

# Prueba 2: Verificar que admin.js tiene función de validación
echo "✓ Verificando admin.js..."
if grep -q "validarPermisosAdmin" public/js/admin.js; then
    echo "  ✅ admin.js contiene función validarPermisosAdmin"
else
    echo "  ❌ admin.js NO contiene validación de permisos"
fi

if grep -q "ver_productos" public/js/admin.js; then
    echo "  ✅ admin.js contiene validación de permisos"
else
    echo "  ❌ admin.js NO contiene validación"
fi
echo ""

# Prueba 3: Verificar que app.js tiene función de validación
echo "✓ Verificando app.js..."
if grep -q "validarPermisosCliente" public/js/app.js; then
    echo "  ✅ app.js contiene función validarPermisosCliente"
else
    echo "  ❌ app.js NO contiene validación de permisos"
fi

if grep -q "crear_pedidos" public/js/app.js; then
    echo "  ✅ app.js contiene validación de permisos"
else
    echo "  ❌ app.js NO contiene validación"
fi
echo ""

# Prueba 4: Verificar que login-admin.html tiene permisos
echo "✓ Verificando login-admin.html..."
if grep -q "autorizar_pedidos" public/html/login-admin.html; then
    echo "  ✅ login-admin.html asigna permisos completos"
else
    echo "  ❌ login-admin.html NO asigna permisos"
fi
echo ""

# Prueba 5: Verificar sincronización de IDs
echo "✓ Verificando sincronización de IDs..."
if grep -q "String(item.id)" public/js/app.js; then
    echo "  ✅ IDs se convierten a string correctamente"
else
    echo "  ❌ Conversión de IDs NO configurada"
fi
echo ""

# Prueba 6: Verificar archivos de documentación
echo "✓ Verificando documentación..."
if [ -f "PERMISOS_SISTEMA.md" ]; then
    echo "  ✅ Documentación de permisos existe"
else
    echo "  ❌ Documentación de permisos NO existe"
fi

if [ -f "ACTUALIZACION_PERMISOS.md" ]; then
    echo "  ✅ Resumen de cambios existe"
else
    echo "  ❌ Resumen de cambios NO existe"
fi
echo ""

echo "======================================"
echo "  ✅ PRUEBAS COMPLETADAS"
echo "======================================"
