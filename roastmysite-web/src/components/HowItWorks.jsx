import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import './HowItWorks.css';

const steps = [
  {
    number: '01',
    title: 'Paste your URL',
    description: 'Drop in the site you want audited. No forms, no sales call, no ceremony.',
  },
  {
    number: '02',
    title: 'We scan the site',
    description: 'The audit checks structure, speed, content, trust signals, and conversion friction.',
  },
  {
    number: '03',
    title: 'You get roasted',
    description: 'You get sharp feedback that is funny enough to share and useful enough to act on.',
  },
];

export default function HowItWorks() {
  const count = steps.length;
  const [index, setIndex] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const viewportRef = useRef(null);

  const go = (i) => setIndex(Math.max(0, Math.min(i, count - 1)));

  // Measure the slide width (= viewport width) so we can translate in pixels.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return undefined;
    const update = () => setSlideWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  function handleDragEnd(_event, info) {
    const swipe = 60;
    if (info.offset.x < -swipe || info.velocity.x < -500) go(index + 1);
    else if (info.offset.x > swipe || info.velocity.x > 500) go(index - 1);
  }

  function handleKeyDown(event) {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      go(index + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go(index - 1);
    }
  }

  return (
    <section className="content-section steps-section" id="how-it-works" aria-labelledby="steps-title">
      <div className="section-heading">
        <p className="section-kicker">How it works</p>
        <h2 id="steps-title">Three steps. One uncomfortable truth.</h2>
      </div>

      <div
        className="carousel"
        role="group"
        aria-roledescription="carousel"
        aria-label="How it works steps"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div className="carousel-viewport" ref={viewportRef}>
          <motion.div
            className="carousel-track"
            drag="x"
            dragConstraints={{ left: -slideWidth * (count - 1), right: 0 }}
            dragElastic={0.18}
            onDragEnd={handleDragEnd}
            animate={{ x: -index * slideWidth }}
            transition={{ type: 'spring', stiffness: 320, damping: 36 }}
          >
            {steps.map((step, i) => (
              <div
                className="carousel-slide"
                key={step.number}
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}`}
                aria-hidden={i !== index}
              >
                <article className="step-card">
                  <span className="step-number">{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="carousel-controls">
          <button
            type="button"
            className="carousel-arrow"
            onClick={() => go(index - 1)}
            disabled={index === 0}
            aria-label="Previous step"
          >
            ‹
          </button>

          <div className="carousel-dots">
            {steps.map((step, i) => (
              <button
                key={step.number}
                type="button"
                className={`carousel-dot ${i === index ? 'is-active' : ''}`}
                onClick={() => go(i)}
                aria-label={`Go to step ${i + 1}`}
                aria-current={i === index}
              />
            ))}
          </div>

          <button
            type="button"
            className="carousel-arrow"
            onClick={() => go(index + 1)}
            disabled={index === count - 1}
            aria-label="Next step"
          >
            ›
          </button>
        </div>

        <p className="carousel-status" aria-live="polite">
          Step {index + 1} of {count}
        </p>
      </div>
    </section>
  );
}
