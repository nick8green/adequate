import { Gauge } from 'prom-client';

export const containerStartTime = new Gauge({
  name: 'container_start_time_seconds',
  help: 'Time when the container started in seconds since epoch',
  labelNames: ['container_name'],
});

containerStartTime.setToCurrentTime();
