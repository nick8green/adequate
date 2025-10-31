import { register, SupportedMetrics } from '@shared/metrics';
import collectMetrics from '@shared/metrics/collect';
import * as pageTransition from '@shared/metrics/pageTransition';
import * as responseTime from '@shared/metrics/responseTime';
import { next as serveMetrics } from '@shared/metrics/serve';
import * as cls from '@shared/metrics/webVitals/cumulativeLayoutShift';
import * as fcp from '@shared/metrics/webVitals/firstContentfulPaint';
import * as fid from '@shared/metrics/webVitals/firstInputDelay';
import * as inp from '@shared/metrics/webVitals/interactionToNextPaint';
import * as lcp from '@shared/metrics/webVitals/largestContentfulPaint';
import * as ttfb from '@shared/metrics/webVitals/timeToFirstBite';

register.registerMetric(responseTime.responseTime);
register.registerMetric(pageTransition.pageTransition);

const supportedMetrics: SupportedMetrics = {
  cls,
  fcp,
  fid,
  inp,
  lcp,
  ttfb,

  responsetime: responseTime,
  pagetransition: pageTransition,
};

export const revalidate = 0;

export const GET = serveMetrics('/metrics');
export const POST = collectMetrics('/metrics', supportedMetrics);
