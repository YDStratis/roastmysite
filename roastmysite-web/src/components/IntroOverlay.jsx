import { lazy, Suspense, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import ErrorBoundary from './ErrorBoundary.jsx';
import './IntroOverlay.css';

// Code-split the Lottie flame (pulls in lottie-web) so it only loads with the splash.
const LottieFlame = lazy(() => import('./LottieFlame.jsx'));

// One-time ember splash. Mounted by LandingPage inside <AnimatePresence>;
// runs a short timer then calls onComplete so the overlay exit-wipes upward.
export default function IntroOverlay({ onComplete }) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const t = setTimeout(onComplete, reduceMotion ? 300 : 1700);
    return () => clearTimeout(t);
  }, [onComplete, reduceMotion]);

  return (
    <motion.div
      className="intro-overlay"
      initial={{ opacity: 1 }}
      exit={{ y: '-100%' }}
      transition={{ duration: 0.7, ease: [0.7, 0, 0.3, 1] }}
    >
      <div className="intro-inner">
        {!reduceMotion && (
          <ErrorBoundary fallback={null}>
            <Suspense fallback={null}>
              <LottieFlame />
            </Suspense>
          </ErrorBoundary>
        )}
        <motion.p
          className="intro-wordmark"
          initial={{ opacity: 0, scale: 0.82, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        >
          RoastMySite <span className="intro-fire">🔥</span>
        </motion.p>
      </div>
    </motion.div>
  );
}
