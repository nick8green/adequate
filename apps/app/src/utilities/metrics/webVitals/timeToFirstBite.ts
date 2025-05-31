import { Gauge } from 'prom-client';

type TimeToFirstBiteDetails = {
  navigationType: string;
  rating: string;
  value: number;
};

export const ttfb = new Gauge({
  name: 'web_vitals_ttfb',
  help: 'time to first byte',
  labelNames: ['navigationType', 'rating'],
});

export const reportToPrometheus = (logDetails: TimeToFirstBiteDetails) => {
  try {
    const { navigationType, rating, value } = logDetails || {};
    ttfb.labels(navigationType, rating).set(value);
  } catch (error) {
    console.error('Prometheus response time event error', error); // eslint-disable-line no-console
  }
};
