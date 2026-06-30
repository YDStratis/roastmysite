import { motion } from 'motion/react';
import { fadeUp, staggerContainer, viewportOnce } from '../lib/motionPresets.js';

const svgProps = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: '#ffb184',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

function FeatureIcon({ name }) {
  switch (name) {
    case 'search':
      return (
        <svg {...svgProps}>
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );
    case 'compass':
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88" />
        </svg>
      );
    case 'zap':
      return (
        <svg {...svgProps}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...svgProps}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'pen':
      return (
        <svg {...svgProps}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
        </svg>
      );
    case 'flask':
      return (
        <svg {...svgProps}>
          <path d="M9 3h6" />
          <path d="M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3" />
        </svg>
      );
    default:
      return null;
  }
}

const features = [
  {
    icon: 'search',
    title: 'SEO Readiness',
    description: 'Find missing titles, weak meta descriptions, bad structure, and visibility issues.',
  },
  {
    icon: 'compass',
    title: 'UX & Conversion',
    description: 'See why users leave before clicking, buying, or trusting you.',
  },
  {
    icon: 'zap',
    title: 'Performance',
    description: 'Catch slow loading, Core Web Vitals problems, and speed killers.',
  },
  {
    icon: 'shield',
    title: 'Trust Signals',
    description: 'Detect missing contact info, weak credibility, and sketchy signals.',
  },
  {
    icon: 'pen',
    title: 'Content Quality',
    description: 'Find vague messaging, confusing copy, and weak value propositions.',
  },
  {
    icon: 'flask',
    title: 'Technical Health',
    description: 'Surface broken basics, accessibility problems, and implementation issues.',
  },
];

export default function FeatureGrid() {
  return (
    <section className="content-section" id="what-we-check" aria-labelledby="features-title">
      <motion.div
        className="section-heading"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
      >
        <p className="section-kicker">What we roast</p>
        <h2 id="features-title">Every weak spot gets dragged into the light.</h2>
        <p>
          RoastMySite checks the stuff customers notice, search engines judge, and teams
          quietly hope nobody asks about.
        </p>
      </motion.div>

      <motion.div
        className="feature-grid"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
      >
        {features.map((feature) => (
          <motion.article className="feature-card" key={feature.title} variants={fadeUp}>
            <span className="feature-icon" aria-hidden="true">
              <FeatureIcon name={feature.icon} />
            </span>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
