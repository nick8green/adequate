import { withMetrics } from '@app/utilities/metrics';
import handler from '@shared/routes/status';

export const GET = withMetrics(handler, '/status');
