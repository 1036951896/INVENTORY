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
          <p className="info-intro">Última actualización: Marzo 2026 &nbsp;·&nbsp; StoreHub Colombia</p>

          <section className="info-section">
            <h2>1. Aceptación de los Términos</h2>
            <p>
              Al acceder, navegar o realizar compras en <strong>StoreHub</strong> (en adelante, "el Sitio"),
              el usuario declara haber leído, comprendido y aceptado en su totalidad los presentes Términos
              y Condiciones. Si no está de acuerdo con alguno de estos términos, le pedimos que se abstenga
              de utilizar el Sitio o de realizar pedidos.
            </p>
            <p>
              StoreHub se reserva el derecho de actualizar estos términos en cualquier momento. La versión
              vigente siempre estará publicada en esta página con su fecha de actualización.
            </p>
          </section>

          <section className="info-section">
            <h2>2. Registro de Cuenta</h2>
            <p>
              Para realizar pedidos es necesario crear una cuenta con información verídica y actualizada.
              El usuario es responsable de mantener la confidencialidad de su contraseña y de todas las
              actividades que ocurran bajo su cuenta.
            </p>
            <ul>
              <li>La contraseña debe tener más de 8 caracteres y combinar letras y números.</li>
              <li>No debes compartir tus credenciales con terceros.</li>
              <li>En caso de acceso no autorizado, debes notificarnos de inmediato por WhatsApp.</li>
            </ul>
          </section>

          <section className="info-section">
            <h2>3. Productos, Precios y Disponibilidad</h2>
            <p>
              Todos los precios se expresan en <strong>pesos colombianos (COP)</strong> e incluyen IVA cuando
              aplica. Los precios pueden modificarse sin previo aviso. La disponibilidad de productos está
              sujeta al stock existente al momento de confirmar el pedido.
            </p>
            <p>
              Nos reservamos el derecho de cancelar pedidos en los siguientes casos:
            </p>
            <ul>
              <li>Producto agotado después de la confirmación.</li>
              <li>Error evidente en el precio publicado.</li>
              <li>Sospecha de fraude o abuso del servicio.</li>
            </ul>
            <p>En caso de cancelación, realizaremos el reembolso total dentro de los 5 días hábiles siguientes.</p>
          </section>

          <section className="info-section">
            <h2>4. Proceso de Compra y Pago</h2>
            <p>
              El proceso de compra se completa cuando el usuario recibe la confirmación de pedido por pantalla
              y, si aplica, por mensaje de WhatsApp. Los métodos de pago aceptados se especifican durante el
              checkout.
            </p>
            <p>
              StoreHub no almacena información de tarjetas de crédito/débito. Los pagos son procesados por
              pasarelas externas certificadas.
            </p>
          </section>

          <section className="info-section">
            <h2>5. Entregas y Tiempos</h2>
            <p>
              Los tiempos de entrega son estimados y dependen de la zona geográfica y la disponibilidad del
              transportista. El cliente será notificado por WhatsApp cuando su pedido sea despachado.
            </p>
            <ul>
              <li><strong>Zona urbana (Bogotá y principales ciudades):</strong> 1–3 días hábiles.</li>
              <li><strong>Municipios y zonas rurales:</strong> 3–7 días hábiles.</li>
            </ul>
            <p>
              StoreHub no se responsabiliza por retrasos ocasionados por eventos de fuerza mayor, huelgas,
              condiciones climáticas extremas o fallas de la empresa transportadora.
            </p>
          </section>

          <section className="info-section">
            <h2>6. Cambios y Devoluciones</h2>
            <p>
              El usuario puede solicitar cambio o devolución dentro de los <strong>7 días calendario</strong>
              siguientes a la recepción del pedido, siempre que:
            </p>
            <ul>
              <li>El producto esté en perfectas condiciones, sin uso y con su empaque original.</li>
              <li>La solicitud sea comunicada por WhatsApp con número de pedido y motivo.</li>
            </ul>
            <p>
              Los gastos de envío de devolución corren por cuenta del cliente, excepto cuando el producto
              presente defecto de fábrica o error en el despacho, caso en el cual StoreHub asume el costo.
            </p>
          </section>

          <section className="info-section">
            <h2>7. Propiedad Intelectual</h2>
            <p>
              Todo el contenido del Sitio (textos, imágenes, logotipos, diseños) es propiedad de StoreHub
              o de sus proveedores y está protegido por la legislación colombiana de derechos de autor.
              Queda prohibida su reproducción total o parcial sin autorización expresa y por escrito.
            </p>
          </section>

          <section className="info-section">
            <h2>8. Limitación de Responsabilidad</h2>
            <p>
              StoreHub no será responsable por daños indirectos, lucro cesante ni perjuicios de cualquier
              naturaleza derivados del uso del Sitio, siempre que dichos daños no sean atribuibles a dolo o
              culpa grave de nuestra parte.
            </p>
          </section>

          <section className="info-section">
            <h2>9. Ley Aplicable y Jurisdicción</h2>
            <p>
              Estos términos se rigen por las leyes de la <strong>República de Colombia</strong>. Para
              cualquier controversia, las partes se someten a los jueces y tribunales competentes de la
              ciudad de Bogotá D.C., renunciando a cualquier otro fuero que pudiera corresponderles.
            </p>
          </section>

          <section className="info-section">
            <h2>10. Contacto</h2>
            <p>
              Para cualquier duda sobre estos términos, escríbenos por{' '}
              <a href="https://wa.me/573155508228" target="_blank" rel="noopener noreferrer">WhatsApp</a>.
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
