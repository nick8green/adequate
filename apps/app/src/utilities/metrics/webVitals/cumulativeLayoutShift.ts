import { Gauge } from 'prom-client';

interface CumulativeLayoutShiftDetails {
  navigationType: string;
  rating: string;
  value: number;
}

export const cls = new Gauge({
  name: 'web_vitals_cls',
  help: 'cumulative layout shift',
  labelNames: ['navigationType', 'rating'],
});

export const reportToPrometheus = (
  logDetails: CumulativeLayoutShiftDetails,
) => {
  try {
    const { navigationType, rating, value } = logDetails || {};
    cls.labels(navigationType, rating).set(value);
  } catch (error) {
    console.error('Prometheus response time event error', error); // eslint-disable-line no-console
  }
};
