import { motion } from 'motion/react';
import { fadeUp, staggerContainer, viewportOnce } from '../lib/motionPresets.js';

const scores = [
  { label: 'SEO', value: 62 },
  { label: 'UX', value: 48 },
  { label: 'Speed', value: 71 },
  { label: 'Trust', value: 55 },
];

export default function RoastPreview() {
  return (
    <section className="preview-section" aria-labelledby="preview-title">
      <motion.div
        className="preview-copy"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
      >
        <p className="section-kicker">Sample roast</p>
        <h2 id="preview-title">Useful feedback, just honest enough to sting.</h2>
        <p>
          The goal is not to be mean. The goal is to say the quiet part clearly, then
          show you what to fix first.
        </p>
      </motion.div>

      <motion.article
        className="roast-preview-card"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <div className="terminal-bar" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <blockquote>
          “Your homepage loads like it is thinking about its life choices. The design is
          trying its best, but your CTA is hiding like it owes someone money.”
        </blockquote>
        <motion.div
          className="score-row"
          aria-label="Example category scores"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          {scores.map((score) => (
            <motion.span className="score-pill" key={score.label} variants={fadeUp}>
              {score.label}: {score.value}
            </motion.span>
          ))}
        </motion.div>
      </motion.article>
    </section>
  );
}
