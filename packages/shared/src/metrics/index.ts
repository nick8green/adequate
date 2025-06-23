import { collectDefaultMetrics, Registry } from 'prom-client';

export const register = new Registry();

collectDefaultMetrics({
  register,
});

export type SupportedMetrics = {
  [key: string]: { reportToPrometheus: (logDetails: any) => void }; // eslint-disable-line @typescript-eslint/no-explicit-any
};
