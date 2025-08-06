import { register as client } from '@shared/metrics';
import { withMetrics } from '@shared/metrics/withMetrics';
import { NextResponse as Response } from 'next/server';

export const endpoint = (path: string = '/metrics') =>
  withMetrics(async (): Promise<Response> => {
    return new Response(await client.metrics(), {
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type': client.contentType,
      },
    });
  }, path);

export default endpoint;
