import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import ScanForm from './ScanForm.jsx';
import DotField from './DotField.jsx';
import Navbar from './Navbar.jsx';
import FeatureGrid from './FeatureGrid.jsx';
import RoastPreview from './RoastPreview.jsx';
import HowItWorks from './HowItWorks.jsx';
import FinalCta from './FinalCta.jsx';
import SiteFooter from './SiteFooter.jsx';
import { heroContainer, fadeUp } from '../lib/motionPresets.js';
import './LandingPage.css';

export default function LandingPage() {
  const reduceMotion = useReducedMotion();
  // The dot-field is a mouse-driven, canvas-heavy rAF loop. Only render it on
  // devices with a real pointer — on touch/mobile it does nothing useful but
  // still burns frames, so skipping it there keeps scrolling smooth.
  const enableDotField =
    !reduceMotion &&
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Scroll-linked effects.
  const { scrollY, scrollYProgress } = useScroll();
  const glowYRaw = useTransform(scrollY, [0, 600], [0, -120]);
  const glowY = reduceMotion ? 0 : glowYRaw;

  function focusRoastInput() {
    document.getElementById('roast-url-input')?.focus();
    document.getElementById('roast-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return (
    <div className="app-shell" id="top">
      {enableDotField && (
        <DotField
          className="site-bg"
          dotRadius={1.5}
          dotSpacing={14}
          bulgeStrength={67}
          glowRadius={160}
          sparkle={false}
          waveAmplitude={0}
        />
      )}

      <motion.div
        className="scroll-progress"
        style={{ scaleX: scrollYProgress }}
        aria-hidden="true"
      />

      <Navbar onStartRoasting={focusRoastInput} />
      <main>
        <section
          className="hero-section"
          aria-labelledby="landing-title"
          style={{ position: 'relative' }}
        >
          <motion.div className="hero-glow" style={{ y: glowY }} aria-hidden="true" />

          <motion.div
            className="hero-copy"
            variants={heroContainer}
            initial="hidden"
            animate="show"
          >
            <motion.p className="eyebrow" variants={fadeUp}>
              Website audits with attitude
            </motion.p>
            <motion.h1 id="landing-title" variants={fadeUp}>
              Roast My Site
            </motion.h1>
            <motion.p className="subtitle" variants={fadeUp}>
              Your website has problems. We'll find all of them.
            </motion.p>
            <motion.p className="hero-support" variants={fadeUp}>
              Paste your URL and get a brutally honest AI-powered audit covering SEO, UX,
              speed, trust, and conversion mistakes.
            </motion.p>
          </motion.div>

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
