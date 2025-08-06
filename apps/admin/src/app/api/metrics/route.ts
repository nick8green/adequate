import { SupportedMetrics } from '@shared/metrics';
import collectMetrics from '@shared/metrics/collect';
import serveMetrics from '@shared/metrics/serve';

const supportedMetrics: SupportedMetrics = {};

export const revalidate = 0;

export const GET = serveMetrics('/metrics');
export const POST = collectMetrics('/metrics', supportedMetrics);
