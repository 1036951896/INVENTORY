
// ===== AUTENTICACIÓN Y REGISTRO =====
// URL base del backend
const BACKEND_URL = window.BACKEND_URL || 'http://localhost:3000';

console.log('🔧 Auth.js cargado. BACKEND_URL:', BACKEND_URL);

document.addEventListener('DOMContentLoaded', function() {
  console.log('📝 Formularios siendo configurados...');
  const formLogin = document.getElementById('form-login');
  const formRegistro = document.getElementById('form-registro');

  console.log('📝 form-login encontrado:', !!formLogin);
  console.log('📝 form-registro encontrado:', !!formRegistro);

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
  console.log('🔑 Formulario de login enviado');

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const mensajeEl = document.getElementById('mensaje-login');

  console.log('📧 Email:', email);
  console.log('🔒 Password:', '*'.repeat(password.length));

  // Validaciones
  if (!email || !password) {
    console.log('❌ Faltan campos');
    mostrarMensaje(mensajeEl, '✗ Por favor completa todos los campos', 'error');
    return;
  }

  if (!validarEmail(email)) {
    console.log('❌ Email inválido');
    mostrarMensaje(mensajeEl, '✗ Formato de correo inválido', 'error');
    return;
  }

  console.log('📤 Enviando login a:', `${BACKEND_URL}/api/v1/auth/login`);

  // Autenticar contra el backend
  fetch(`${BACKEND_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
    .then(async resp => {
      console.log('📥 Respuesta del servidor. Status:', resp.status);
      let data;
      try {
        data = await resp.json();
      } catch (e) {
        console.log('❌ Error parseando JSON:', e);
        data = {};
      }
      if (!resp.ok) {
        console.log('❌ Login fallido:', data);
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
      console.log('✅ Login exitoso. Datos:', data.user);
      if (data.user && (data.user.rol === 'ADMIN' || data.user.rol === 'admin')) {
        // Es admin - validar permisos de administración
        console.log('👨‍💼 Usuario es ADMIN');
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
        
        // Crear dirección predeterminada si no tiene ninguna
        if (typeof crearDireccionPredeterminada === 'function') {
          crearDireccionPredeterminada();
        }
        
        mostrarMensaje(mensajeEl, '✓ Inicio de sesión exitoso. Redirigiendo...', 'exito');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1500);
      }
    })
    .catch(err => {
      console.error('Error en login:', err);
      let message = '✗ ' + err.message;
      // Si es error de credenciales, sugerir setup
      if (err.message.toLowerCase().includes('inválid') || err.message.toLowerCase().includes('incorrect')) {
        message = '✗ Credenciales inválidas<br><a href="setup.html" style="color: #386273; text-decoration: underline; font-weight: 600;">¿Primera vez? Inicializa la BD aquí →</a>';
      }
      mostrarMensaje(mensajeEl, message, 'error');
    });
}

// Registrar Usuario
function registrarUsuario(e) {
  e.preventDefault();
  console.log('Formulario de registro enviado');
  console.log('Using BACKEND_URL:', BACKEND_URL);

  const nombre = document.getElementById('nombre').value.trim();
  const apellido = document.getElementById('apellido').value.trim();
  const email = document.getElementById('email-registro').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const password = document.getElementById('password-registro').value;
  const confirmPassword = document.getElementById('confirmar-password').value;
  
  // Capturar campos de dirección
  const calle = document.getElementById('calle').value.trim();
  const numero = document.getElementById('numero').value.trim();
  const apartamento = document.getElementById('apartamento').value.trim();
  const ciudad = document.getElementById('ciudad').value.trim();
  const departamento = document.getElementById('departamento').value.trim();
  const codigoPostal = document.getElementById('codigoPostal').value.trim();
  const pais = document.getElementById('pais').value.trim();
  
  const mensajeEl = document.getElementById('mensaje-registro');

  console.log('Email:', email);
  console.log('Nombre:', nombre);

  // Validaciones
  if (!nombre || !apellido || !email || !telefono || !password || !confirmPassword) {
    mostrarMensaje(mensajeEl, '✗ Por favor completa todos los campos de perfil', 'error');
    return;
  }

  if (!calle || !numero || !ciudad || !departamento || !pais) {
    mostrarMensaje(mensajeEl, '✗ Por favor completa todos los campos de dirección', 'error');
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

  const registerUrl = `${BACKEND_URL}/api/v1/users`;
  console.log('Enviando registro a:', registerUrl);

  // Registrar usuario en el backend
  fetch(registerUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nombre: nombre + ' ' + apellido,
      email,
      telefono,
      password,
      // Datos de dirección
      direccion: {
        calle,
        numero,
        apartamento: apartamento || null,
        ciudad,
        departamento,
        codigoPostal: codigoPostal || null,
        pais,
        esPrincipal: true
      }
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
  elemento.innerHTML = mensaje;
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

// ===== HEADER QUE SE CONTRAE AL SCROLLEAR =====
(() => {
  let lastScroll = 0;
  const header = document.querySelector('header');

  if (header) {
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 100 && currentScroll > lastScroll) {
        header.classList.add('header-hidden');
      } else if (currentScroll < 100 || currentScroll < lastScroll) {
        header.classList.remove('header-hidden');
      }

      lastScroll = currentScroll <= 0 ? 0 : currentScroll;
    });
  }
})();
