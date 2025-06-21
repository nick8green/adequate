import { reportToPrometheus as reportRequestCount } from '@app/utilities/metrics/httpRequestCount';
import { reportToPrometheus as reportResponseTime } from '@app/utilities/metrics/responseTime';
import { NextRequest } from 'next/server';

export const withMetrics = (
  handler: (req: NextRequest) => Promise<Response>,
  route: string,
): ((req: NextRequest) => Promise<Response>) => {
  return async (req: NextRequest) => {
    const start = Date.now();
    const res = await handler(req);

    reportRequestCount({
      method: req.method,
      route,
      statusCode: res.status.toString(),
    });

    const duration = Date.now() - start;
    reportResponseTime({
      route,
      statusCode: '200',
      responseTime: duration,
    });
    return res;
  };
};
