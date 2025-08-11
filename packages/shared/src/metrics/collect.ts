import { SupportedMetrics } from '@shared/metrics';
import { withMetrics } from '@shared/metrics/withMetrics';
import { NextRequest as Request, NextResponse as Response } from 'next/server';

export const endpoint = (
  path: string = '/metrics',
  supportedMetrics: SupportedMetrics = {},
) =>
  withMetrics(async (req: Request) => {
    const body = await req.json();
    const { name } = body;
    const key = name.toLowerCase();

    if (!supportedMetrics[key]) {
      return Response.json({ error: 'no metric found' }, { status: 400 });
    }

    supportedMetrics[key].reportToPrometheus(body);

    return Response.json({ success: true });
  }, path);

export default endpoint;
