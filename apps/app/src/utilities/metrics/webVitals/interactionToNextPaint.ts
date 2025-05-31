import { Gauge } from 'prom-client';

type InteractionToNextPaintDetails = {
  navigationType: string;
  rating: string;
  value: number;
};

export const inp = new Gauge({
  name: 'web_vitals_inp',
  help: 'interaction to next paint',
  labelNames: ['navigationType', 'rating'],
});

export const reportToPrometheus = (
  logDetails: InteractionToNextPaintDetails,
) => {
  try {
    const { navigationType, rating, value } = logDetails || {};
    inp.labels(navigationType, rating).set(value);
  } catch (error) {
    console.error('Prometheus response time event error', error); // eslint-disable-line no-console
  }
};
