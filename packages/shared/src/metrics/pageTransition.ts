import { Counter } from 'prom-client';

type PageTransitionDetails = {
  from: string;
  to: string;
  session: string;
};

export const pageTransition = new Counter({
  name: 'page_transition',
  help: 'Total number of page transitions',
  labelNames: ['from', 'session', 'to'],
});

export const reportToPrometheus = (transition: PageTransitionDetails) => {
  try {
    const { from, session, to } = transition || {};
    pageTransition.labels(from, session, to).inc();
  } catch (error) {
    console.error('Prometheus event counter event error', error); // eslint-disable-line no-console
  }
};
