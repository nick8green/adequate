import * as httpRequestCounter from '@app/utilities/metrics/httpRequestCount';
import * as cls from '@app/utilities/metrics/webVitals/cumulativeLayoutShift';
import * as fcp from '@app/utilities/metrics/webVitals/firstContentfulPaint';
import * as fid from '@app/utilities/metrics/webVitals/firstInputDelay';
import * as inp from '@app/utilities/metrics/webVitals/interactionToNextPaint';
import * as lcp from '@app/utilities/metrics/webVitals/largestContentfulPaint';
import * as ttfb from '@app/utilities/metrics/webVitals/timeToFirstBite';
import { SupportedMetrics } from '@shared/metrics';
import collectMetrics from '@shared/metrics/collect';
import serveMetrics from '@shared/metrics/serve';

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
