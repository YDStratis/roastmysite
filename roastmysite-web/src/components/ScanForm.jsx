import { useState } from 'react';
import { motion } from 'motion/react';
import LoadingSpinner from './LoadingSpinner.jsx';

const SCAN_API_URL = 'http://localhost:5029/api/Scan';

export default function ScanForm() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setMessage('Please enter a URL');
      return;
    }

    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(SCAN_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: trimmedUrl,
          businessType: null,
          targetAudience: null,
        }),
      });

      const data = await response.json().catch((parseError) => {
        console.error('Failed to parse scan response JSON:', parseError);
        return null;
      });

      if (!response.ok) {
        console.error('Scan request failed:', response.status, data);
        throw new Error(data?.message || 'Unable to start the scan. Please try again.');
      }

      console.log('Scan response:', data);

      const scanId = data?.scanId || data?.id || data?.scanRequestId;

      if (!scanId) {
        console.error('Scan response did not include an id:', data);
        setMessage('Scan started but no scan id was returned.');
        return;
      }

      window.location.href = `/results/${scanId}`;
    } catch (error) {
      console.error('Scan request error:', error);
      setMessage(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="scan-card" id="roast-form" onSubmit={handleSubmit} noValidate>
      <div className="scan-card-header">
        <div>
          <p className="scan-label">Start the roast</p>
          <label htmlFor="roast-url-input">Website URL</label>
        </div>
        <span className="scan-status" aria-hidden="true">
          Live audit
        </span>
      </div>

      <div className="scan-control">
        <div className="input-shell">
          <input
            id="roast-url-input"
            type="url"
            value={url}
            onChange={(event) => {
              setUrl(event.target.value);
              if (message) {
                setMessage('');
              }
            }}
            placeholder="https://example.com"
            aria-label="Website URL"
            aria-invalid={Boolean(message)}
            aria-describedby="scan-helper scan-message"
          />
        </div>
        <motion.button
          className="primary-cta"
          type="submit"
          disabled={isLoading}
          whileHover={isLoading ? undefined : { scale: 1.03 }}
          whileTap={isLoading ? undefined : { scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              <span>Roasting...</span>
            </>
          ) : (
            'Roast My Site'
          )}
        </motion.button>
      </div>

      <p id="scan-helper" className="scan-helper">
        We will scan the public page and send you to the results as soon as the roast starts.
      </p>

      <div className="badge-row" aria-label="Audit focus areas">
        <span>SEO checks</span>
        <span>UX feedback</span>
        <span>Performance audit</span>
      </div>

      <p id="scan-message" className="form-message" role="alert" aria-live="polite">
        {message ? (
          message
        ) : (
          <span aria-hidden="true">Ready when your homepage is.</span>
        )}
      </p>
    </form>
  );
}
