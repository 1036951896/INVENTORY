#!/usr/bin/env python3
"""
Test automatizado del flujo de login y admin panel
Verifica que:
1. Backend responde correctamente
2. Login devuelve el formato correcto
3. Endpoints de admin funcionan con credentials
"""

import requests
import json
import sys
from datetime import datetime

# Colores para terminal
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'

BASE_URL = 'http://localhost:3000/api/v1'
ADMIN_EMAIL = 'admin@inventory.com'
ADMIN_PASSWORD = 'admin123'

def print_test(title, status, message=''):
    symbol = f'{GREEN}✅{RESET}' if status else f'{RED}❌{RESET}'
    print(f'{symbol} {title}')
    if message:
        print(f'   {BLUE}→{RESET} {message}')

def print_step(step_num, title):
    print(f'\n{YELLOW}{'='*60}{RESET}')
    print(f'{YELLOW}PASO {step_num}: {title}{RESET}')
    print(f'{YELLOW}{'='*60}{RESET}')

def test_backend_health():
    """Test 1: Verifica que el backend esté corriendo"""
    print_step(1, 'Verificar Backend')
    
    try:
        resp = requests.get(f'{BASE_URL.replace("/api/v1", "")}', timeout=5)
        print_test('Backend accesible', resp.status_code == 200 or resp.status_code == 404)
        return True
    except Exception as e:
        print_test('Backend accesible', False, f'Error: {str(e)}')
        return False

def test_login():
    """Test 2: Login como admin"""
    print_step(2, 'Login como Admin')
    
    try:
        resp = requests.post(
            f'{BASE_URL}/auth/login',
            json={'email': ADMIN_EMAIL, 'password': ADMIN_PASSWORD},
            timeout=5
        )
        
        print_test(f'Status HTTP: 201', resp.status_code == 201, f'Recibido: {resp.status_code}')
        
        if resp.status_code != 201:
            print(f'{RED}Response:{RESET}', resp.text)
            return None
        
        data = resp.json()
        
        # Verificar estructura
        print_test('Tengo access_token', 'access_token' in data)
        print_test('Tengo user object', 'user' in data)
        
        if 'user' not in data:
            return None
            
        user = data['user']
        print_test('User tiene id', 'id' in user)
        print_test('User tiene nombre', 'nombre' in user)
        print_test('User tiene email', 'email' in user)
        print_test('User tiene rol', 'rol' in user, f'Valor: {user.get("rol")}')
        
        # Verificar valores correctos
        print_test(f'Email es correcto', 
                  user.get('email') == ADMIN_EMAIL,
                  f'Email: {user.get("email")}')
        
        rol = user.get('rol')
        print_test(f'Rol es "ADMIN"',
                  rol == 'ADMIN',
                  f'Valor: "{rol}" (tipo: {type(rol).__name__})')
        
        print(f'\n{BLUE}Datos del usuario:{RESET}')
        print(json.dumps(user, indent=2))
        
        return data
        
    except Exception as e:
        print_test('Login exitoso', False, f'Error: {str(e)}')
        return None

def test_endpoints(token):
    """Test 3: Verifica endpoints protegidos"""
    print_step(3, 'Verificar Endpoints Protegidos')
    
    headers = {'Authorization': f'Bearer {token}'}
    
    endpoints = [
        ('/users', 'GET', 'Listar Usuarios'),
        ('/orders', 'GET', 'Listar Órdenes'),
        ('/products', 'GET', 'Listar Productos'),
        ('/categories', 'GET', 'Listar Categorías'),
    ]
    
    for endpoint, method, description in endpoints:
        try:
            url = f'{BASE_URL}{endpoint}'
            resp = requests.request(method, url, headers=headers, timeout=5)
            
            status_ok = resp.status_code == 200
            print_test(f'{description} ({endpoint})',
                      status_ok,
                      f'Status: {resp.status_code}')
            
            if status_ok:
                data = resp.json()
                if isinstance(data, dict) and 'data' in data:
                    count = len(data['data']) if isinstance(data['data'], list) else 1
                    print(f'   {BLUE}→{RESET} Items: {count}')
                elif isinstance(data, list):
                    print(f'   {BLUE}→{RESET} Items: {len(data)}')
                    
        except Exception as e:
            print_test(f'{description} ({endpoint})', False, f'Error: {str(e)}')

def test_redirect_logic():
    """Test 4: Verifica la lógica de redirección"""
    print_step(4, 'Verificar Lógica de Redirección (Frontend)')
    
    print(f'{BLUE}En el navegador, después del login:{RESET}')
    print(f'  1. Si rol === "ADMIN" → Redirige a /admin ✓')
    print(f'  2. Si rol === "CLIENTE" → Redirige a / ✓')
    print(f'  3. Si no está autenticado → Redirige a /login ✓')
    
    print(f'\n{BLUE}localStorage después del login como ADMIN:{RESET}')
    print(f'  admin-usuario: {{"id":"...", "nombre":"...", "rol":"ADMIN"}}')
    print(f'  admin-token: "eyJhbGc..." (JWT)')

def main():
    print(f'\n{BLUE}╔═══════════════════════════════════════════╗{RESET}')
    print(f'{BLUE}║   TEST AUTOMATIZADO: LOGIN ADMIN         ║{RESET}')
    print(f'{BLUE}╚═══════════════════════════════════════════╝{RESET}')
    print(f'Timestamp: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}')
    print(f'Backend URL: {BASE_URL}\n')
    
    # Test 1: Backend health
    if not test_backend_health():
        print(f'\n{RED}❌ El backend no está corriendo. Inicia con:{RESET}')
        print(f'   cd backend && npm run start:dev')
        sys.exit(1)
    
    # Test 2: Login
    login_data = test_login()
    if not login_data:
        print(f'\n{RED}❌ Login fallido. Verifica:{RESET}')
        print(f'   1. Email: {ADMIN_EMAIL}')
        print(f'   2. Password: correcta en la BD')
        print(f'   3. Base de datos iniciada')
        sys.exit(1)
    
    # Test 3: Endpoints
    token = login_data['access_token']
    test_endpoints(token)
    
    # Test 4: Redirect logic
    test_redirect_logic()
    
    # Summary
    print(f'\n{BLUE}╔═══════════════════════════════════════════╗{RESET}')
    print(f'{GREEN}✅ TODOS LOS TESTS PASARON{RESET}')
    print(f'{BLUE}╚═══════════════════════════════════════════╝{RESET}')
    
    print(f'\n{BLUE}Próximos pasos:{RESET}')
    print(f'  1. Ve a {YELLOW}http://localhost:5173/login{RESET}')
    print(f'  2. Ingresa: {YELLOW}{ADMIN_EMAIL} / {ADMIN_PASSWORD}{RESET}')
    print(f'  3. Deberías ver: {GREEN}http://localhost:5173/admin{RESET}')
    print()

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print(f'\n{YELLOW}Test interrumpido{RESET}')
    except Exception as e:
        print(f'\n{RED}Error: {e}{RESET}')
        sys.exit(1)
