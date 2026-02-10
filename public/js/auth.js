
// ===== AUTENTICACIÓN Y REGISTRO =====
// URL base del backend
const BACKEND_URL = window.BACKEND_URL || 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', function() {
  const formLogin = document.getElementById('form-login');
  const formRegistro = document.getElementById('form-registro');

  if (formLogin) {
    formLogin.addEventListener('submit', iniciarSesion);
  }

  if (formRegistro) {
    formRegistro.addEventListener('submit', registrarUsuario);
  }
});

// Iniciar Sesión
function iniciarSesion(e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const mensajeEl = document.getElementById('mensaje-login');

  // Validaciones
  if (!email || !password) {
    mostrarMensaje(mensajeEl, '✗ Por favor completa todos los campos', 'error');
    return;
  }

  if (!validarEmail(email)) {
    mostrarMensaje(mensajeEl, '✗ Formato de correo inválido', 'error');
    return;
  }

  // Autenticar contra el backend
  fetch(`${BACKEND_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
    .then(async resp => {
      let data;
      try {
        data = await resp.json();
      } catch (e) {
        data = {};
      }
      if (!resp.ok) {
        let msg = 'Correo o contraseña incorrectos';
        if (resp.status === 401) {
          msg = data.message || 'Credenciales inválidas';
        } else if (resp.status === 500) {
          msg = 'Error interno del servidor. Intenta más tarde.';
        } else if (data.message) {
          msg = data.message;
        }
        throw new Error(msg);
      }
      // Guardar token y datos de usuario o admin
      if (data.user && (data.user.rol === 'ADMIN' || data.user.rol === 'admin')) {
        // Es admin - validar permisos de administración
        const usuarioAdmin = {
          ...data.user,
          access_token: data.access_token,
          permisos: {
            ver_productos: true,
            editar_productos: true,
            eliminar_productos: true,
            crear_productos: true,
            ver_pedidos: true,
            editar_pedidos: true,
            autorizar_pedidos: true,
            rechazar_pedidos: true,
            ver_usuarios: true,
            ver_categorias: true,
            editar_categorias: true,
            ver_reportes: true,
            ver_configuracion: true
          }
        };
        console.log('✅ Login admin exitoso');
        console.log('Token:', data.access_token?.substring(0, 20) + '...');
        console.log('Usuario:', usuarioAdmin);
        localStorage.setItem('admin-token', data.access_token);
        localStorage.setItem('admin-usuario', JSON.stringify(usuarioAdmin));
        mostrarMensaje(mensajeEl, '✓ Inicio de sesión exitoso. Redirigiendo al panel admin...', 'exito');
        setTimeout(() => {
          window.location.href = 'admin.html';
        }, 1500);
      } else {
        // Es usuario normal - permisos básicos de cliente
        const usuarioCliente = {
          ...data.user,
          access_token: data.access_token,
          permisos: {
            ver_productos: true,
            ver_carrito: true,
            crear_pedidos: true,
            ver_pedidos_propios: true,
            ver_seguimiento: true
          }
        };
        console.log('✅ Login cliente exitoso');
        console.log('Token:', data.access_token?.substring(0, 20) + '...');
        console.log('Usuario:', usuarioCliente);
        localStorage.setItem('usuario', JSON.stringify(usuarioCliente));
        mostrarMensaje(mensajeEl, '✓ Inicio de sesión exitoso. Redirigiendo...', 'exito');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1500);
      }
    })
    .catch(err => {
      mostrarMensaje(mensajeEl, '✗ ' + err.message, 'error');
    });
}

// Registrar Usuario
function registrarUsuario(e) {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const apellido = document.getElementById('apellido').value.trim();
  const email = document.getElementById('email-registro').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const password = document.getElementById('password-registro').value;
  const confirmPassword = document.getElementById('confirmar-password').value;
  const mensajeEl = document.getElementById('mensaje-registro');

  // Validaciones
  if (!nombre || !apellido || !email || !telefono || !password || !confirmPassword) {
    mostrarMensaje(mensajeEl, '✗ Por favor completa todos los campos', 'error');
    return;
  }

  if (!validarEmail(email)) {
    mostrarMensaje(mensajeEl, '✗ Formato de correo inválido', 'error');
    return;
  }

  if (password.length < 6) {
    mostrarMensaje(mensajeEl, '✗ La contraseña debe tener al menos 6 caracteres', 'error');
    return;
  }

  if (password !== confirmPassword) {
    mostrarMensaje(mensajeEl, '✗ Las contraseñas no coinciden', 'error');
    return;
  }

  // Registrar usuario en el backend
  fetch(`${BACKEND_URL}/api/v1/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nombre: nombre + ' ' + apellido,
      email,
      telefono,
      password
    })
  })
    .then(async resp => {
      let data;
      try {
        data = await resp.json();
      } catch (e) {
        data = {};
      }
      if (!resp.ok) {
        let msg = 'No se pudo registrar el usuario';
        if (resp.status === 400) {
          msg = data.message || 'Datos inválidos o usuario ya registrado';
        } else if (resp.status === 500) {
          msg = 'Error interno del servidor. Intenta más tarde.';
        } else if (data.message) {
          msg = data.message;
        }
        throw new Error(msg);
      }
      // Guardar token y datos de usuario después del registro
      if (data.access_token && data.user) {
        localStorage.setItem('usuario', JSON.stringify({
          ...data.user,
          access_token: data.access_token
        }));
        mostrarMensaje(mensajeEl, '✓ Registro exitoso. Redirigiendo...', 'exito');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1500);
      } else {
        mostrarMensaje(mensajeEl, '✓ Registro exitoso. Redirigiendo al inicio de sesión...', 'exito');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1500);
      }
    })
    .catch(err => {
      mostrarMensaje(mensajeEl, '✗ ' + err.message, 'error');
    });
}

// Validar email
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Mostrar mensajes
function mostrarMensaje(elemento, mensaje, tipo) {
  elemento.textContent = mensaje;
  elemento.className = `mensaje activo mensaje-${tipo}`;
  
  if (tipo === 'error') {
    setTimeout(() => {
      elemento.classList.remove('activo');
    }, 4000);
  }
}

// Verificar sesión al cargar página
function verificarSesion() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  
  // Si no hay sesión en página protegida, redirigir a login
  if (!usuario && window.location.pathname.includes('admin.html')) {
    window.location.href = 'login-admin.html';
  }
}

// Llamar verificación
verificarSesion();
