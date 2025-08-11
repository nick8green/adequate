import { SupportedMetrics } from '@shared/metrics';
import collectMetrics from '@shared/metrics/collect';
import * as httpRequestCounter from '@shared/metrics/httpRequestCount';
import serveMetrics from '@shared/metrics/serve';
import * as cls from '@shared/metrics/webVitals/cumulativeLayoutShift';
import * as fcp from '@shared/metrics/webVitals/firstContentfulPaint';
import * as fid from '@shared/metrics/webVitals/firstInputDelay';
import * as inp from '@shared/metrics/webVitals/interactionToNextPaint';
import * as lcp from '@shared/metrics/webVitals/largestContentfulPaint';
import * as ttfb from '@shared/metrics/webVitals/timeToFirstBite';

const supportedMetrics: SupportedMetrics = {
  cls,
  fcp,
  fid,
  httpRequestCounter,
  inp,
  lcp,
  ttfb,
};

export const revalidate = 0;

export const GET = serveMetrics('/metrics');
export const POST = collectMetrics('/metrics', supportedMetrics);
