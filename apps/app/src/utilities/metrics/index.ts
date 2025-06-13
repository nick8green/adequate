import { collectDefaultMetrics, Registry } from 'prom-client';

export { reportToPrometheus as httpRequestCount } from '@app/utilities/metrics/httpRequestCount';
export { reportToPrometheus as responseTime } from '@app/utilities/metrics/responseTime';

import { containerStartTime } from '@app/utilities/metrics/containerStartTime';
import { httpRequestCounter } from '@app/utilities/metrics/httpRequestCount';
import { responseTime } from '@app/utilities/metrics/responseTime';
import { cls } from '@app/utilities/metrics/webVitals/cumulativeLayoutShift';
import { fcp } from '@app/utilities/metrics/webVitals/firstContentfulPaint';
import { fid } from '@app/utilities/metrics/webVitals/firstInputDelay';
import { inp } from '@app/utilities/metrics/webVitals/interactionToNextPaint';
import { lcp } from '@app/utilities/metrics/webVitals/largestContentfulPaint';
import { ttfb } from '@app/utilities/metrics/webVitals/timeToFirstBite';

export const register = new Registry();

collectDefaultMetrics({
  register,
});

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

export default register;

export { withMetrics } from '@app/utilities/metrics/withMetrics';
