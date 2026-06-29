const features = [
  {
    icon: '🔎',
    title: 'SEO Readiness',
    description: 'Find missing titles, weak meta descriptions, bad structure, and visibility issues.',
  },
  {
    icon: '🧭',
    title: 'UX & Conversion',
    description: 'See why users leave before clicking, buying, or trusting you.',
  },
  {
    icon: '⚡',
    title: 'Performance',
    description: 'Catch slow loading, Core Web Vitals problems, and speed killers.',
  },
  {
    icon: '🛡️',
    title: 'Trust Signals',
    description: 'Detect missing contact info, weak credibility, and sketchy signals.',
  },
  {
    icon: '✍️',
    title: 'Content Quality',
    description: 'Find vague messaging, confusing copy, and weak value propositions.',
  },
  {
    icon: '🧪',
    title: 'Technical Health',
    description: 'Surface broken basics, accessibility problems, and implementation issues.',
  },
];

export default function FeatureGrid() {
  return (
    <section className="content-section" id="what-we-check" aria-labelledby="features-title">
      <div className="section-heading">
        <p className="section-kicker">What we roast</p>
        <h2 id="features-title">Every weak spot gets dragged into the light.</h2>
        <p>
          RoastMySite checks the stuff customers notice, search engines judge, and teams
          quietly hope nobody asks about.
        </p>
      </div>

      <div className="feature-grid">
        {features.map((feature) => (
          <article className="feature-card" key={feature.title}>
            <span className="feature-icon" aria-hidden="true">
              {feature.icon}
            </span>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
