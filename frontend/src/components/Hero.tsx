export default function Hero() {
  return (
    <section className="hero-premium">
      <div className="hero-grid">
        <div className="hero-texto">
          <span className="badge-oferta">OFERTA EXCLUSIVA</span>
          <h1>Descuentos<br/>Especiales</h1>
          <div className="hero-descuento-bloque">
            <span className="hero-hasta">HASTA</span>
            <span className="hero-porcentaje">40%</span>
            <span className="hero-off">OFF</span>
          </div>
          <p>En productos seleccionados por tiempo limitado</p>
          <div className="hero-acciones">
            <a href="/ofertas" className="btn-hero-premium">
              Ver ofertas
              <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" width="18" height="18">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </a>
            <span className="hero-urgencia-badge">⏳ Solo por hoy</span>
          </div>
        </div>
        <div className="hero-acento"></div>
      </div>
    </section>
  );
}
