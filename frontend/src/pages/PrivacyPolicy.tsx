import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/info-pages.css';

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <main className="info-page-container">
        <div className="info-page-wrapper">
          <h1>Política de Privacidad</h1>
          <p className="info-intro">Última actualización: Marzo 2026 &nbsp;·&nbsp; StoreHub Colombia</p>

          <p className="info-intro" style={{ marginTop: '0.5rem', color: '#374151' }}>
            En <strong>StoreHub</strong> respetamos y protegemos la privacidad de nuestros usuarios.
            Esta política describe qué datos recopilamos, cómo los usamos y los derechos que te asisten,
            en cumplimiento de la <strong>Ley 1581 de 2012</strong> (Ley de Protección de Datos Personales
            de Colombia) y sus decretos reglamentarios.
          </p>

          <section className="info-section">
            <h2>1. Responsable del Tratamiento</h2>
            <p>
              <strong>StoreHub</strong> es la empresa responsable del tratamiento de los datos personales
              que nos suministras. Puedes contactarnos en cualquier momento por{' '}
              <a href="https://wa.me/573155508228" target="_blank" rel="noopener noreferrer">WhatsApp</a>{' '}
              para ejercer tus derechos o resolver dudas sobre esta política.
            </p>
          </section>

          <section className="info-section">
            <h2>2. Datos que Recopilamos</h2>
            <p>Recopilamos únicamente los datos necesarios para prestarte el servicio:</p>
            <ul>
              <li><strong>Datos de identificación:</strong> nombre y apellido.</li>
              <li><strong>Datos de contacto:</strong> correo electrónico y número de teléfono.</li>
              <li><strong>Dirección de entrega:</strong> calle, número, ciudad, departamento y código postal.</li>
              <li><strong>Datos de uso:</strong> historial de pedidos y preferencias de navegación (cookies técnicas).</li>
            </ul>
            <p>
              <strong>No recopilamos</strong> datos de tarjetas de crédito/débito ni información financiera sensible.
              Los pagos son gestionados íntegramente por pasarelas de pago externas certificadas.
            </p>
          </section>

          <section className="info-section">
            <h2>3. Finalidad del Tratamiento</h2>
            <p>Tus datos son utilizados exclusivamente para:</p>
            <ul>
              <li>Gestionar y confirmar tus pedidos.</li>
              <li>Coordinar la entrega de productos a tu dirección.</li>
              <li>Enviarte notificaciones sobre el estado de tu pedido (por WhatsApp o correo).</li>
              <li>Mantener tu historial de compras accesible desde tu cuenta.</li>
              <li>Informarte sobre ofertas o promociones, <strong>solo si lo autorizas expresamente</strong>.</li>
              <li>Cumplir con obligaciones legales y fiscales aplicables en Colombia.</li>
            </ul>
          </section>

          <section className="info-section">
            <h2>4. Compartir Información con Terceros</h2>
            <p>
              StoreHub <strong>no vende ni comercializa</strong> tus datos personales. Solo los compartimos con:
            </p>
            <ul>
              <li>Empresas de logística y transporte, únicamente para efectuar la entrega de tu pedido.</li>
              <li>Autoridades competentes cuando sea requerido por ley o orden judicial.</li>
            </ul>
            <p>Estos terceros están contractualmente obligados a mantener la confidencialidad de tus datos.</p>
          </section>

          <section className="info-section">
            <h2>5. Seguridad de los Datos</h2>
            <p>
              Implementamos medidas técnicas y organizativas para proteger tu información contra acceso no
              autorizado, pérdida, alteración o divulgación:
            </p>
            <ul>
              <li>Transmisión de datos cifrada mediante HTTPS/TLS.</li>
              <li>Contraseñas almacenadas con hashing seguro (bcrypt).</li>
              <li>Acceso restringido a datos personales solo para personal autorizado.</li>
              <li>Tokens de sesión con expiración automática.</li>
            </ul>
          </section>

          <section className="info-section">
            <h2>6. Tus Derechos (Ley 1581 de 2012)</h2>
            <p>Como titular de los datos, tienes derecho a:</p>
            <ul>
              <li><strong>Conocer:</strong> saber qué datos tenemos sobre ti.</li>
              <li><strong>Actualizar:</strong> corregir datos inexactos o incompletos.</li>
              <li><strong>Suprimir:</strong> solicitar la eliminación de tus datos cuando no exista obligación legal de conservarlos.</li>
              <li><strong>Revocar:</strong> retirar el consentimiento para el tratamiento de tus datos.</li>
              <li><strong>Acceder:</strong> obtener una copia de la información personal que conservamos.</li>
            </ul>
            <p>
              Para ejercer cualquiera de estos derechos, escríbenos por{' '}
              <a href="https://wa.me/573155508228" target="_blank" rel="noopener noreferrer">WhatsApp</a>.
              Responderemos en un plazo máximo de <strong>10 días hábiles</strong>.
            </p>
          </section>

          <section className="info-section">
            <h2>7. Cookies</h2>
            <p>
              Utilizamos únicamente <strong>cookies técnicas esenciales</strong> para el funcionamiento del
              carrito y la sesión de usuario. No utilizamos cookies de rastreo publicitario ni de terceros.
              Puedes desactivar las cookies desde la configuración de tu navegador, aunque esto puede afectar
              algunas funciones del Sitio.
            </p>
          </section>

          <section className="info-section">
            <h2>8. Retención de Datos</h2>
            <p>
              Conservamos tus datos personales mientras mantengas una cuenta activa en StoreHub, o por el
              tiempo que sea necesario para cumplir con obligaciones legales (máximo 5 años para registros
              de transacciones según normativa tributaria colombiana). Puedes solicitar la eliminación de tu
              cuenta en cualquier momento.
            </p>
          </section>

          <section className="info-section">
            <h2>9. Cambios a esta Política</h2>
            <p>
              Podemos actualizar esta política periódicamente. Te notificaremos de cambios significativos
              mediante un aviso en el Sitio o por correo electrónico. El uso continuo del Sitio después de
              publicada la actualización implica tu aceptación.
            </p>
          </section>

          <div className="info-actions">
            <Link to="/" className="btn btn-secundario">← Volver al Inicio</Link>
            <Link to="/registro" className="btn btn-primario">Crear mi cuenta</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
