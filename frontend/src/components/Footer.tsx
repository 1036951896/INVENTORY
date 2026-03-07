import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <>
      {/* BOTÓN FLOTANTE DE WHATSAPP */}
      <a href="https://wa.me/573155508228" target="_blank" className="boton-whatsapp" title="Chatea con nosotros en WhatsApp">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="11" fill="#25D366"/>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" fill="white"/>
        </svg>
        <span className="tooltip-whatsapp">Chatea con nosotros</span>
      </a>

      {/* FOOTER */}
      <footer>
        <div className="footer-contenido">
          <div className="footer-seccion">
            <h3>Sobre Nosotros</h3>
            <p>StoreHub es tu distribuidora de confianza para productos de hogar y abarrotes de la mejor calidad.</p>
            <div className="redes-sociales">
              <a href="#" title="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '14px', height: '14px' }}>
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" title="Instagram">
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '14px', height: '14px' }}>
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.117.6c-.388.15-.76.368-1.085.683-.315.309-.533.697-.686 1.086-.266.79-.467 1.66-.527 2.938C1.031 8.333 1.016 8.74 1.016 12s.015 3.667.072 4.947c.06 1.277.261 2.148.527 2.938.153.389.37.756.686 1.084.309.317.677.533 1.07.687.76.272 1.632.474 2.898.536 1.22.057 1.627.072 4.947.072s3.728-.015 4.947-.072c1.266-.062 2.139-.263 2.898-.536.389-.153.756-.37 1.084-.686.317-.309.533-.677.687-1.07.272-.76.474-1.632.536-2.898.057-1.22.072-1.627.072-4.947s-.015-3.667-.072-4.947c-.062-1.266-.263-2.139-.536-2.898-.153-.389-.37-.756-.686-1.084-.309-.317-.677-.533-1.07-.687-.76-.272-1.632-.474-2.898-.536C15.667 1.031 15.26 1.016 12 1.016s-3.667.015-4.947.072zm0 2.016c3.183 0 3.556.01 4.812.063 1.161.053 1.792.247 2.21.412.557.217.953.477 1.369.893.416.416.676.812.893 1.369.165.418.36 1.049.412 2.21.053 1.255.063 1.629.063 4.812s-.01 3.557-.063 4.812c-.053 1.161-.247 1.792-.412 2.21-.217.557-.477.953-.893 1.369-.416.416-.812.676-1.369.893-.418.165-1.049.36-2.21.412-1.255.053-1.629.063-4.812.063s-3.557-.01-4.812-.063c-1.161-.053-1.792-.247-2.21-.412-.557-.217-.953-.477-1.369-.893-.416-.416-.676-.812-.893-1.369-.165-.418-.36-1.049-.412-2.21-.053-1.255-.063-1.629-.063-4.812s.01-3.557.063-4.812c.053-1.161.247-1.792.412-2.21.217-.557.477-.953.893-1.369.416-.416.812-.676 1.369-.893.418-.165 1.049-.36 2.21-.412 1.255-.053 1.629-.063 4.812-.063z"/>
                  <circle cx="12" cy="12" r="3.206"/>
                  <circle cx="18.406" cy="5.594" r=".75"/>
                </svg>
              </a>
              <a href="#" title="Twitter">
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '14px', height: '14px' }}>
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="https://wa.me/573155508228" target="_blank" title="WhatsApp">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  <circle cx="8" cy="10" r="1.5" fill="currentColor" opacity="0.7"></circle>
                  <circle cx="12" cy="10" r="1.5" fill="currentColor" opacity="0.7"></circle>
                  <circle cx="16" cy="10" r="1.5" fill="currentColor" opacity="0.7"></circle>
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-seccion">
            <h3>Información</h3>
            <Link to="/preguntas-frecuentes">Preguntas Frecuentes</Link>
            <Link to="/politica-privacidad">Política de Privacidad</Link>
            <Link to="/terminos-condiciones">Términos y Condiciones</Link>
            <Link to="/contacto">Contacto</Link>
          </div>

          <div className="footer-seccion">
            <h3>Contacto</h3>
            <p>
              <svg className="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Carrera 64 b # 40-33
            </p>
            <p>
              <svg className="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Barrio El Porvenir, Primera etapa
            </p>
            <p>
              <svg className="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              +57 315 5508228
            </p>
            <p>
              <svg className="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="1"></circle>
                <path d="M12 1v6m0 6v6"></path>
                <path d="M4.22 4.22l4.24 4.24m0 5.08l-4.24 4.24"></path>
                <path d="M1 12h6m6 0h6"></path>
              </svg>
              Lun - Vie: 8am - 6pm
            </p>
            <p>
              <a href="https://wa.me/573155508228" target="_blank">
                <svg className="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Chatea en WhatsApp
              </a>
            </p>
          </div>

          <div className="footer-seccion">
            <h3>Métodos de Pago</h3>
            <div className="payment-method">
              <svg className="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
              <span>Tarjeta de Crédito/Débito</span>
            </div>
            <div className="payment-method">
              <svg className="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="18" rx="2" ry="2"></rect>
                <line x1="2" y1="7" x2="22" y2="7"></line>
              </svg>
              <span>Transferencia Bancaria</span>
            </div>
            <div className="payment-method">
              <svg className="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6m0 3v0.01"></path>
              </svg>
              <span>Efectivo Contra Entrega</span>
            </div>
            <div className="payment-method">
              <svg className="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                <line x1="12" y1="20" x2="12" y2="20.01"></line>
              </svg>
              <span>Billetera Digital</span>
            </div>
          </div>
        </div>

        <div className="footer-separador">
          <p>&copy; 2026 StoreHub. Todos los derechos reservados.</p>
        </div>
      </footer>
    </>
  );
}
