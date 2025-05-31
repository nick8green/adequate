import { Gauge } from 'prom-client';

type FirstInputDelayDetails = {
  navigationType: string;
  rating: string;
  value: number;
};

export const fid = new Gauge({
  name: 'web_vitals_fid',
  help: 'first input delay',
  labelNames: ['navigationType', 'rating'],
});

export const reportToPrometheus = (logDetails: FirstInputDelayDetails) => {
  try {
    const { navigationType, rating, value } = logDetails || {};
    fid.labels(navigationType, rating).set(value);
  } catch (error) {
    console.error('Prometheus response time event error', error); // eslint-disable-line no-console
  }
};
