import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/info-pages.css';

export default function TermsConditions() {
  return (
    <>
      <Header />
      <main className="info-page-container">
        <div className="info-page-wrapper">
          <h1>Términos y Condiciones</h1>
          <p className="info-intro">Última actualización: Marzo 2026</p>

          <section className="info-section">
            <h2>1. Aceptación de Términos</h2>
            <p>
              Al utilizar nuestro sitio web y realizar compras en StoreHub, aceptas estos términos y condiciones. 
              Si no estás de acuerdo, por favor no realices compras en nuestro sitio.
            </p>
          </section>

          <section className="info-section">
            <h2>2. Productos y Servicios</h2>
            <p>
              Nos esforzamos por proporcionar productos de la más alta calidad. 
              Todos nuestros productos están sujetos a disponibilidad de stock. 
              Nos reservamos el derecho de rechazar cualquier pedido.
            </p>
          </section>

          <section className="info-section">
            <h2>3. Precios y Pagos</h2>
            <p>
              Los precios mostrados en nuestro sitio están en pesos colombianos (COP). 
              Los precios pueden cambiar sin previo aviso. 
              Aceptamos múltiples métodos de pago según se especifica en el checkout.
            </p>
          </section>

          <section className="info-section">
            <h2>4. Entregas</h2>
            <p>
              Nos comprometemos a entregar tu pedido en el tiempo estimado. 
              Si ocurre un retraso, te notificaremos por WhatsApp. 
              No somos responsables de retrasos causados por terceros como transportistas o situaciones impredecibles.
            </p>
          </section>

          <section className="info-section">
            <h2>5. Cambios y Devoluciones</h2>
            <p>
              Puedes cambiar o devolver productos dentro de 7 días de la entrega si están en perfectas condiciones. 
              Los gastos de envío de devoluciones corren por cuenta del cliente.
            </p>
          </section>

          <section className="info-section">
            <h2>6. Limitación de Responsabilidad</h2>
            <p>
              StoreHub no es responsable por daños indirectos, pérdidas de ganancias o cualquier otro daño 
              incidental que resulte de tu uso de nuestro sitio o productos.
            </p>
          </section>

          <section className="info-section">
            <h2>7. Cambios a los Términos</h2>
            <p>
              Nos reservamos el derecho de modificar estos términos en cualquier momento. 
              Las modificaciones entrarán en vigencia inmediatamente después de su publicación.
            </p>
          </section>

          <Link to="/" className="btn btn-secundario">Volver al Inicio</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
