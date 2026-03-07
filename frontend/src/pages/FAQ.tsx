import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/info-pages.css';

export default function FAQ() {
  const faqs = [
    {
      pregunta: '¿Cuáles son los tiempos de entrega?',
      respuesta: 'Los pedidos se entregan entre 2-3 días hábiles en el área metropolitana. Para otras ciudades, el tiempo puede variar entre 3-7 días.'
    },
    {
      pregunta: '¿Puedo cambiar mi pedido después de realizarlo?',
      respuesta: 'Sí, puedes cambiar o cancelar tu pedido dentro de 1 hora después de haberlo realizado. Contacta a nuestro equipo por WhatsApp.'
    },
    {
      pregunta: '¿Qué métodos de pago aceptan?',
      respuesta: 'Aceptamos efectivo contra entrega, transferencia bancaria y pago por Nequi/Daviplata.'
    },
    {
      pregunta: '¿Hay garantía en los productos?',
      respuesta: 'Todos nuestros productos cuentan con garantía de calidad. Si encontramos defectos, ofrecemos cambio gratuito.'
    },
    {
      pregunta: '¿Dónde están ubicados?',
      respuesta: 'Estamos ubicados en Carrera 64 b # 40-33, Barrio El Porvenir, Primera etapa. Puedes visitarnos de lunes a viernes de 8am a 6pm.'
    },
    {
      pregunta: '¿Cómo puedo contactar al equipo de soporte?',
      respuesta: 'Puedes contactarnos por WhatsApp al +57 315 5508228 o visitarnos directamente en nuestro local.'
    }
  ];

  return (
    <>
      <Header />
      <main className="info-page-container">
        <div className="info-page-wrapper">
          <h1>Preguntas Frecuentes</h1>
          <p className="info-intro">Encuentra respuestas a las preguntas más comunes sobre nuestros servicios</p>

          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h3 className="faq-pregunta">{faq.pregunta}</h3>
                <p className="faq-respuesta">{faq.respuesta}</p>
              </div>
            ))}
          </div>

          <div className="info-footer-section">
            <h3>¿No encontraste lo que buscabas?</h3>
            <p>Contáctanos por WhatsApp y te ayudaremos a resolver tu pregunta.</p>
            <a href="https://wa.me/573155508228" target="_blank" className="btn btn-principal">
              Contactar por WhatsApp
            </a>
          </div>

          <Link to="/" className="btn btn-secundario">Volver al Inicio</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
