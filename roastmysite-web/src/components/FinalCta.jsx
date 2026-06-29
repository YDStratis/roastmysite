export default function FinalCta({ onStartRoasting }) {
  return (
    <section className="final-cta" id="pricing" aria-labelledby="final-cta-title">
      <p className="section-kicker">Free preview to start</p>
      <h2 id="final-cta-title">Ready to find out what your website is doing wrong?</h2>
      <p>
        Start with the URL. The report will handle the awkward feedback.
      </p>
      <button type="button" onClick={onStartRoasting}>
        Roast my homepage
      </button>
    </section>
  );
}
