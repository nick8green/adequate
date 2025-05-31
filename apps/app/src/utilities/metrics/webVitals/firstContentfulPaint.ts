import { Gauge } from 'prom-client';

type FirstContentfulPaintDetails = {
  navigationType: string;
  rating: string;
  value: number;
};

export const fcp = new Gauge({
  name: 'web_vitals_fcp',
  help: 'first contentful paint',
  labelNames: ['navigationType', 'rating'],
});

export const reportToPrometheus = (logDetails: FirstContentfulPaintDetails) => {
  try {
    const { navigationType, rating, value } = logDetails || {};
    fcp.labels(navigationType, rating).set(value);
  } catch (error) {
    console.error('Prometheus response time event error', error); // eslint-disable-line no-console
  }
};
