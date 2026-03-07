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
          <p className="info-intro">Última actualización: Marzo 2026</p>

          <section className="info-section">
            <h2>1. Información que Recopilamos</h2>
            <p>
              Recopilamos información personal cuando realizas compras, creas una cuenta o nos contactas. 
              Esto incluye tu nombre, correo electrónico, número de teléfono y dirección de entrega.
            </p>
          </section>

          <section className="info-section">
            <h2>2. Cómo Usamos tu Información</h2>
            <p>
              Utilizamos tu información para:
            </p>
            <ul>
              <li>Procesar tus pedidos y entregas</li>
              <li>Mantenerlo informado sobre el estado de tus compras</li>
              <li>Mejorar nuestros servicios</li>
              <li>Enviar notificaciones de ofertas especiales (solo con tu consentimiento)</li>
              <li>Cumplir con requisitos legales</li>
            </ul>
          </section>

          <section className="info-section">
            <h2>3. Protección de Datos</h2>
            <p>
              Protegemos tu información personal mediante medidas de seguridad estándar de la industria. 
              No compartimos tu información con terceros sin tu consentimiento, excepto cuando es necesario 
              para procesar tu pedido (como con proveedores de logística).
            </p>
          </section>

          <section className="info-section">
            <h2>4. Derechos del Usuario</h2>
            <p>
              Tienes derecho a acceder, modificar o eliminar tu información personal en cualquier momento. 
              Contáctanos por WhatsApp para solicitar cambios en tus datos.
            </p>
          </section>

          <section className="info-section">
            <h2>5. Cookies</h2>
            <p>
              Nuestro sitio utiliza cookies para mejorar tu experiencia de compra. 
              Puedes desabilitar cookies en tu navegador si lo deseas.
            </p>
          </section>

          <Link to="/" className="btn btn-secundario">Volver al Inicio</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
