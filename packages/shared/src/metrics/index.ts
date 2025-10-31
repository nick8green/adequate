import { collectDefaultMetrics, Registry } from 'prom-client';

console.log("METRICS: Initializing metrics...");

export const register = new Registry();

collectDefaultMetrics({
  register,
});

export type SupportedMetrics = {
  [key: string]: { reportToPrometheus: (logDetails: any) => void }; // eslint-disable-line @typescript-eslint/no-explicit-any
};

export { reportToPrometheus as httpRequestCount } from '@shared/metrics/httpRequestCount';
export { reportToPrometheus as responseTime } from '@shared/metrics/responseTime';

import { containerStartTime } from '@shared/metrics/containerStartTime';
import { httpRequestCounter } from '@shared/metrics/httpRequestCount';
import { responseTime } from '@shared/metrics/responseTime';
import { cls } from '@shared/metrics/webVitals/cumulativeLayoutShift';
import { fcp } from '@shared/metrics/webVitals/firstContentfulPaint';
import { fid } from '@shared/metrics/webVitals/firstInputDelay';
import { inp } from '@shared/metrics/webVitals/interactionToNextPaint';
import { lcp } from '@shared/metrics/webVitals/largestContentfulPaint';
import { ttfb } from '@shared/metrics/webVitals/timeToFirstBite';

register.registerMetric(containerStartTime);
register.registerMetric(httpRequestCounter);
register.registerMetric(responseTime);

// Register web vitals metrics
register.registerMetric(cls);
register.registerMetric(fcp);
register.registerMetric(fid);
register.registerMetric(inp);
register.registerMetric(lcp);
register.registerMetric(ttfb);

export { withMetrics } from '@shared/metrics/withMetrics';
