import { registerOTel } from '@vercel/otel';

export const register = () => {
  // Collector needs setting up: https://opentelemetry.io/docs/collector/quick-start/
  registerOTel({ serviceName: process.env.APP_NAME ?? 'adequate-app' });
};
