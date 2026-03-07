export default function Hero() {
  return (
    <section className="hero-premium">
      <div className="hero-grid">
        <div className="hero-texto">
          <span className="badge-oferta">OFERTA EXCLUSIVA</span>
          <h1>Descuentos Especiales</h1>
          <p>
            Obtén hasta <strong>40% de descuento</strong> 
            en productos seleccionados por tiempo limitado.
          </p>
          <a href="/ofertas" className="btn-hero-premium">
            Ver ofertas
            <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" width="18" height="18">
              <path d="M5 12h14M13 6l6 6-6 6"/>
            </svg>
          </a>
        </div>
        <div className="hero-acento"></div>
      </div>
    </section>
  );
}
