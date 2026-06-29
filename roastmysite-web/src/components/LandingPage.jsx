import ScanForm from './ScanForm.jsx';
import Navbar from './Navbar.jsx';
import FeatureGrid from './FeatureGrid.jsx';
import RoastPreview from './RoastPreview.jsx';
import HowItWorks from './HowItWorks.jsx';
import FinalCta from './FinalCta.jsx';
import SiteFooter from './SiteFooter.jsx';

export default function LandingPage() {
  function focusRoastInput() {
    document.getElementById('roast-url-input')?.focus();
    document.getElementById('roast-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return (
    <div className="app-shell" id="top">
      <Navbar onStartRoasting={focusRoastInput} />
      <main>
        <section className="hero-section" aria-labelledby="landing-title">
          <div className="hero-copy">
            <p className="eyebrow">Website audits with attitude</p>
            <h1 id="landing-title">Roast My Site 🔥</h1>
            <p className="subtitle">Your website has problems. We'll find all of them.</p>
            <p className="hero-support">
              Paste your URL and get a brutally honest AI-powered audit covering SEO, UX,
              speed, trust, and conversion mistakes.
            </p>
          </div>

          <ScanForm />
        </section>

        <FeatureGrid />
        <RoastPreview />
        <HowItWorks />
        <FinalCta onStartRoasting={focusRoastInput} />
      </main>
      <SiteFooter />
    </div>
  );
}
