import { registerOTel } from '@vercel/otel';

// Collector needs setting up: https://opentelemetry.io/docs/collector/quick-start/
export const register = () => {
  registerOTel({ serviceName: process.env.NAME ?? 'adequate-app' });
};
