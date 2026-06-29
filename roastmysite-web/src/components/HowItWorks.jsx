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
  return (
    <section className="content-section steps-section" id="how-it-works" aria-labelledby="steps-title">
      <div className="section-heading">
        <p className="section-kicker">How it works</p>
        <h2 id="steps-title">Three steps. One uncomfortable truth.</h2>
      </div>

      <div className="steps-grid">
        {steps.map((step) => (
          <article className="step-card" key={step.number}>
            <span className="step-number">{step.number}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
