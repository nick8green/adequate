import { Histogram } from 'prom-client';

type ResponseTimeDetails = {
  route: string;
  statusCode: string;
  responseTime: number;
};

export const responseTime = new Histogram({
  name: 'web_server_processing_time',
  help: 'web_server data fetching and processing time',
  labelNames: ['route', 'statusCode'],
  buckets: [
    0.1, 5, 15, 50, 100, 250, 500, 750, 1000, 1500, 2000, 5000, 10000, 15000,
    20000,
  ],
});

export const reportToPrometheus = (logDetails: ResponseTimeDetails) => {
  try {
    const { route, statusCode, responseTime: time } = logDetails;
    responseTime.labels(route, statusCode).observe(time);
  } catch (error) {
    console.error('Prometheus response time event error', error); // eslint-disable-line no-console
  }
};
