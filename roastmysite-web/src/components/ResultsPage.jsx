import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import './ResultsPage.css';

const API_BASE = 'http://localhost:5029';

const clamp = (value) => Math.max(0, Math.min(Number(value) || 0, 100));

// A=green, B=blue, C=yellow, D=orange, F=red
function gradeClass(grade) {
  switch ((grade || '').trim().toUpperCase()[0]) {
    case 'A':
      return 'grade-a';
    case 'B':
      return 'grade-b';
    case 'C':
      return 'grade-c';
    case 'D':
      return 'grade-d';
    case 'F':
      return 'grade-f';
    default:
      return '';
  }
}

function scoreClass(value) {
  if (value >= 80) return 'score-good';
  if (value >= 50) return 'score-mid';
  return 'score-bad';
}

// The backend serializes FullReportJson with default (PascalCase) keys,
// but accept camelCase too in case that changes.
function parseFullReport(json) {
  try {
    const parsed = JSON.parse(json || '{}');
    return {
      criticalIssues: parsed.criticalIssues ?? parsed.CriticalIssues ?? [],
      quickWins: parsed.quickWins ?? parsed.QuickWins ?? [],
    };
  } catch {
    return { criticalIssues: [], quickWins: [] };
  }
}

const gridContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function ResultsPage() {
  const { scanId } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    let timer;

    async function poll() {
      try {
        const res = await fetch(`${API_BASE}/api/Scan/${scanId}`);
        if (!res.ok) {
          throw new Error(`Request failed (${res.status})`);
        }
        const data = await res.json();
        // Endpoint returns the ScanRequest; report is null while scanning.
        const r = data?.report ?? (data?.overallGrade ? data : null);
        if (!active) return;
        if (r) {
          setReport(r);
          setLoading(false);
        } else {
          timer = setTimeout(poll, 3000); // still scanning — retry in 3s
        }
      } catch (e) {
        if (!active) return;
        setError(e.message);
        setLoading(false);
      }
    }

    poll();
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [scanId]);

  if (loading) {
    return (
      <div className="results-shell">
        <div className="results-status">
          <div className="results-spinner" />
          <h2>Roasting your site…</h2>
          <p>Heating up the grill. This usually takes a few seconds.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-shell">
        <div className="results-status">
          <h2 className="results-error">Something went wrong</h2>
          <p>{error}</p>
          <button
            className="primary-cta"
            type="button"
            onClick={() => navigate('/')}
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  const isPaid = Boolean(report.isPaid);
  const { criticalIssues } = parseFullReport(report.fullReportJson);
  const scores = [
    { label: 'SEO', value: report.seoScore },
    { label: 'UX', value: report.uxScore },
    { label: 'Performance', value: report.performanceScore },
    { label: 'Trust', value: report.trustScore },
  ];

  return (
    <div className="results-shell">
      <header className="site-header">
        <nav className="navbar">
          <Link to="/" className="brand">
            RoastMySite 🔥
          </Link>
          <Link to="/" className="nav-cta">
            Roast another site
          </Link>
        </nav>
      </header>

      <main className="results-main">
        <motion.section
          className="grade-block"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 16 }}
        >
          <p className="results-kicker">Your grade</p>
          <div className={`grade-letter ${gradeClass(report.overallGrade)}`}>
            {report.overallGrade}
          </div>
        </motion.section>

        <motion.blockquote
          className="roast-quote"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          &ldquo;{report.roastSummary}&rdquo;
        </motion.blockquote>

        <div className="locked-area">
          <div className={isPaid ? undefined : 'locked-content'} aria-hidden={!isPaid}>
            <motion.div
              className="score-grid"
              variants={gridContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              {scores.map((s) => (
                <motion.div className="result-score-card" key={s.label} variants={cardItem}>
                  <div className="result-score-top">
                    <span className="result-score-label">{s.label}</span>
                    <span className={`result-score-value ${scoreClass(s.value)}`}>
                      {s.value}
                    </span>
                  </div>
                  <div className="score-track">
                    <motion.div
                      className={`score-fill ${scoreClass(s.value)}`}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: clamp(s.value) / 100 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <div className="issues-block">
              <h2>Critical issues</h2>
              <motion.ul
                className="issues-list"
                variants={gridContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
              >
                {criticalIssues.length === 0 ? (
                  <li className="issue-empty">No critical issues listed.</li>
                ) : (
                  criticalIssues.map((issue, i) => (
                    <motion.li className="issue-item" key={i} variants={cardItem}>
                      <span className="issue-x" aria-hidden="true">
                        ✕
                      </span>
                      <span>{issue}</span>
                    </motion.li>
                  ))
                )}
              </motion.ul>
            </div>
          </div>

          {!isPaid && (
            <div className="paywall">
              <p className="paywall-title">Unlock Full Report</p>
              <p className="paywall-sub">
                See every score and the full list of issues holding your site
                back.
              </p>
              <button className="primary-cta paywall-cta" type="button">
                Unlock Full Report — €19
              </button>
            </div>
          )}
        </div>

        <button
          className="ghost-cta"
          type="button"
          onClick={() => navigate('/')}
        >
          Roast Another Site
        </button>
      </main>
    </div>
  );
}
