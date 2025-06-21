import { render } from '@testing-library/react';
import vitals from 'next/web-vitals';
import React from 'react';

import WebVitals from './webVitals';

const useReportWebVitalsMock = vitals.useReportWebVitals as jest.Mock;

// Mock useReportWebVitals from next/web-vitals
jest.mock('next/web-vitals', () => ({
  useReportWebVitals: jest.fn(),
}));

describe('WebVitals', () => {
  beforeEach(() => {
    useReportWebVitalsMock.mockClear();
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({}) }),
    ) as jest.Mock;
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    (global.fetch as jest.Mock).mockRestore?.();
    (console.warn as jest.Mock).mockRestore?.(); // eslint-disable-line no-console
  });

  it('registers a web vitals callback', () => {
    render(<WebVitals />);
    expect(useReportWebVitalsMock).toHaveBeenCalledTimes(1);
    expect(typeof useReportWebVitalsMock.mock.calls[0][0]).toBe('function');
  });

  it('sends metrics via fetch', async () => {
    render(<WebVitals />);
    const metric = { name: 'FCP', value: 123 };
    // Call the callback passed to useReportWebVitals
    await useReportWebVitalsMock.mock.calls[0][0](metric);

    expect(global.fetch).toHaveBeenCalledWith('/api/metrics', {
      method: 'POST',
      body: JSON.stringify(metric),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('warns if fetch fails', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject('fail'),
    );
    render(<WebVitals />);
    const metric = { name: 'LCP', value: 456 };
    await useReportWebVitalsMock.mock.calls[0][0](metric);

    expect(console.warn).toHaveBeenCalledWith('Could not send metric', 'fail'); // eslint-disable-line no-console
  });
});
