import { useCallback, useEffect, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import ScanForm from './ScanForm.jsx';
import Navbar from './Navbar.jsx';
import FeatureGrid from './FeatureGrid.jsx';
import RoastPreview from './RoastPreview.jsx';
import HowItWorks from './HowItWorks.jsx';
import FinalCta from './FinalCta.jsx';
import SiteFooter from './SiteFooter.jsx';
import IntroOverlay from './IntroOverlay.jsx';
import { heroContainer, fadeUp } from '../lib/motionPresets.js';
import './LandingPage.css';

export default function LandingPage() {
  const reduceMotion = useReducedMotion();
  const introSeen =
    typeof window !== 'undefined' && sessionStorage.getItem('introSeen') === '1';

  const [showIntro, setShowIntro] = useState(!introSeen);
  const [introComplete, setIntroComplete] = useState(introSeen);

  // Skip the splash entirely when the user prefers reduced motion.
  useEffect(() => {
    if (reduceMotion) {
      setShowIntro(false);
      setIntroComplete(true);
    }
  }, [reduceMotion]);

  const handleIntroDone = useCallback(() => {
    sessionStorage.setItem('introSeen', '1');
    setShowIntro(false);
    setIntroComplete(true);
  }, []);

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
      <AnimatePresence>
        {showIntro && <IntroOverlay key="intro" onComplete={handleIntroDone} />}
      </AnimatePresence>

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
            animate={introComplete ? 'show' : 'hidden'}
          >
            <motion.p className="eyebrow" variants={fadeUp}>
              Website audits with attitude
            </motion.p>
            <motion.h1 id="landing-title" variants={fadeUp}>
              Roast My Site 🔥
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
