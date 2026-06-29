// Shared Motion presets for scroll-triggered reveals on the landing page.
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

// Hero entrance — slightly slower, more deliberate cascade.
export const heroContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

export const viewportOnce = { once: true, amount: 0.2 };
