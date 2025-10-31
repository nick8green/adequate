import * as route from '@app/app/api/metrics/route';
import * as collect from '@shared/metrics/collect';
import * as httpRequestCounter from '@shared/metrics/httpRequestCount';
import * as serve from '@shared/metrics/serve';
import * as cls from '@shared/metrics/webVitals/cumulativeLayoutShift';
import * as fcp from '@shared/metrics/webVitals/firstContentfulPaint';
import * as fid from '@shared/metrics/webVitals/firstInputDelay';
import * as inp from '@shared/metrics/webVitals/interactionToNextPaint';
import * as lcp from '@shared/metrics/webVitals/largestContentfulPaint';
import * as ttfb from '@shared/metrics/webVitals/timeToFirstBite';

jest.mock('@shared/metrics/serve', () => ({
  __esModule: true,
  default: jest.fn(() => 'serveMetricsHandler'),
}));
jest.mock('@shared/metrics/collect', () => ({
  __esModule: true,
  default: jest.fn(() => 'collectMetricsHandler'),
}));
jest.mock('@shared/metrics/httpRequestCount', () => ({}));
jest.mock('@shared/metrics/webVitals/cumulativeLayoutShift', () => ({}));
jest.mock('@shared/metrics/webVitals/firstContentfulPaint', () => ({}));
jest.mock('@shared/metrics/webVitals/firstInputDelay', () => ({}));
jest.mock('@shared/metrics/webVitals/interactionToNextPaint', () => ({}));
jest.mock('@shared/metrics/webVitals/largestContentfulPaint', () => ({}));
jest.mock('@shared/metrics/webVitals/timeToFirstBite', () => ({}));

describe('metrics route', () => {
  it('should export revalidate as 0', () => {
    expect(route.revalidate).toBe(0);
  });

  it('should export GET as the result of serveMetrics("/metrics")', () => {
    expect(route.GET).toBe('serveMetricsHandler');
    expect(serve.next).toHaveBeenCalledWith('/metrics');
  });

  it('should export POST as the result of collectMetrics("/metrics", supportedMetrics)', () => {
    expect(route.POST).toBe('collectMetricsHandler');
    expect(collect.default).toHaveBeenCalledWith(
      '/metrics',
      expect.objectContaining({
        cls,
        fcp,
        fid,
        httpRequestCounter,
        inp,
        lcp,
        ttfb,
      }),
    );
  });
});
