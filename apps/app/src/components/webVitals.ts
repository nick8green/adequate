'use client';
import { useReportWebVitals } from 'next/web-vitals';

const WebVitals = () => {
  useReportWebVitals(async (metric) => {
    try {
      await fetch('/api/metrics', {
        method: 'POST',
        body: JSON.stringify(metric),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      console.warn('Could not send metric', err); // eslint-disable-line no-console
    }
  });

  return null;
};

export default WebVitals;
