import { Counter } from 'prom-client';

type EventCounterLogDetails = {
  method: string;
  route: string;
  statusCode: string;
};

export const httpRequestCounter = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
});

export const reportToPrometheus = (logDetails: EventCounterLogDetails) => {
  try {
    const { method, route, statusCode } = logDetails || {};
    httpRequestCounter.labels(method, route, statusCode).inc();
  } catch (error) {
    console.error('Prometheus event counter event error', error); // eslint-disable-line no-console
  }
};
