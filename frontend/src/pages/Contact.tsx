import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { alert2 } from '../utils/notifications';
import '../styles/info-pages.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.email || !formData.mensaje) {
      alert2('Por favor completa los campos obligatorios', 'error');
      return;
    }

    setLoading(true);
    
    // Simulación de envío
    setTimeout(() => {
      alert2('Tu mensaje ha sido enviado. Nos pondremos en contacto pronto.', 'success');
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        asunto: '',
        mensaje: ''
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <Header />
      <main className="info-page-container">
        <div className="info-page-wrapper">
          <h1>Contacto</h1>
          <p className="info-intro">¿Tienes dudas? Nos encantaría escucharte</p>

          <div className="contact-content">
            <div className="contact-info">
              <div className="info-item">
                <h3>📍 Ubicación</h3>
                <p>
                  Carrera 64 b # 40-33<br />
                  Barrio El Porvenir, Primera etapa<br />
                  (Consultanos por la ciudad)
                </p>
              </div>

              <div className="info-item">
                <h3>📞 Teléfono</h3>
                <p><a href="tel:+573155508228">+57 315 5508228</a></p>
              </div>

              <div className="info-item">
                <h3>⏰ Horario de Atención</h3>
                <p>
                  Lunes a Viernes: 8:00 AM - 6:00 PM<br />
                  Sábados: 9:00 AM - 4:00 PM<br />
                  Domingos: Cerrado
                </p>
              </div>

              <div className="info-item">
                <h3>💬 WhatsApp</h3>
                <p>
                  <a href="https://wa.me/573155508228" target="_blank" className="btn btn-principal">
                    Chatea con nosotros
                  </a>
                </p>
              </div>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre *</label>
                <input 
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Teléfono</label>
                <input 
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="+57 315 123 4567"
                />
              </div>

              <div className="form-group">
                <label>Asunto</label>
                <select 
                  name="asunto"
                  value={formData.asunto}
                  onChange={handleChange}
                >
                  <option value="">Selecciona un asunto</option>
                  <option value="pedido">Pregunta sobre un pedido</option>
                  <option value="producto">Consulta sobre productos</option>
                  <option value="reclamo">Reclamo</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div className="form-group">
                <label>Mensaje *</label>
                <textarea 
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  placeholder="Cuéntanos cómo podemos ayudarte"
                  rows={5}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-principal" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar Mensaje'}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
