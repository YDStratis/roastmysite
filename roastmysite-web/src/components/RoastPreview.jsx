const scores = [
  { label: 'SEO', value: 62 },
  { label: 'UX', value: 48 },
  { label: 'Speed', value: 71 },
  { label: 'Trust', value: 55 },
];

export default function RoastPreview() {
  return (
    <section className="preview-section" aria-labelledby="preview-title">
      <div className="preview-copy">
        <p className="section-kicker">Sample roast</p>
        <h2 id="preview-title">Useful feedback, just honest enough to sting.</h2>
        <p>
          The goal is not to be mean. The goal is to say the quiet part clearly, then
          show you what to fix first.
        </p>
      </div>

      <article className="roast-preview-card">
        <div className="terminal-bar" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <blockquote>
          “Your homepage loads like it is thinking about its life choices. The design is
          trying its best, but your CTA is hiding like it owes someone money.”
        </blockquote>
        <div className="score-row" aria-label="Example category scores">
          {scores.map((score) => (
            <span className="score-pill" key={score.label}>
              {score.label}: {score.value}
            </span>
          ))}
        </div>
      </article>
    </section>
  );
}
