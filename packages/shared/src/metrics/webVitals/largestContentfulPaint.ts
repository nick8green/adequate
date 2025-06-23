import { Gauge } from 'prom-client';

type LargestContentfulPaintDetails = {
  navigationType: string;
  rating: string;
  value: number;
};

export const lcp = new Gauge({
  name: 'web_vitals_lcp',
  help: 'largest contentful paint',
  labelNames: ['navigationType', 'rating'],
});

export const reportToPrometheus = (
  logDetails: LargestContentfulPaintDetails,
) => {
  try {
    const { navigationType, rating, value } = logDetails || {};
    lcp.labels(navigationType, rating).set(value);
  } catch (error) {
    console.error('Prometheus response time event error', error); // eslint-disable-line no-console
  }
};
