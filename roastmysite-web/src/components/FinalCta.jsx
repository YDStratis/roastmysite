import { motion } from 'motion/react';
import { viewportOnce } from '../lib/motionPresets.js';

export default function FinalCta({ onStartRoasting }) {
  return (
    <motion.section
      className="final-cta"
      id="pricing"
      aria-labelledby="final-cta-title"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      <p className="section-kicker">Free preview to start</p>
      <h2 id="final-cta-title">Ready to find out what your website is doing wrong?</h2>
      <p>
        Start with the URL. The report will handle the awkward feedback.
      </p>
      <button type="button" onClick={onStartRoasting}>
        Roast my homepage
      </button>
    </motion.section>
  );
}
