export default function Navbar({ onStartRoasting }) {
  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="RoastMySite home">
          RoastMySite <span aria-hidden="true">🔥</span>
        </a>
        <div className="nav-links">
          <a href="#how-it-works">How it works</a>
          <a href="#what-we-check">What we check</a>
          <a href="#pricing">Pricing</a>
        </div>
        <button className="nav-cta" type="button" onClick={onStartRoasting}>
          Start roasting
        </button>
      </nav>
    </header>
  );
}
