import client, { withMetrics } from '@app/utilities/metrics';
import * as httpRequestCounter from '@app/utilities/metrics/httpRequestCount';
import * as cls from '@app/utilities/metrics/webVitals/cumulativeLayoutShift';
import * as fcp from '@app/utilities/metrics/webVitals/firstContentfulPaint';
import * as fid from '@app/utilities/metrics/webVitals/firstInputDelay';
import * as inp from '@app/utilities/metrics/webVitals/interactionToNextPaint';
import * as lcp from '@app/utilities/metrics/webVitals/largestContentfulPaint';
import * as ttfb from '@app/utilities/metrics/webVitals/timeToFirstBite';
import { NextRequest as Request, NextResponse as Response } from 'next/server';

const supportedMetrics: {
  [key: string]: { reportToPrometheus: (logDetails: any) => void }; // eslint-disable-line @typescript-eslint/no-explicit-any
} = {
  cls,
  fcp,
  fid,
  httpRequestCounter,
  inp,
  lcp,
  ttfb,
};

export const revalidate = 0;

export const GET = withMetrics(async (): Promise<Response> => {
  return new Response(await client.metrics(), {
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': client.contentType,
    },
  });
}, '/metrics');

export const POST = withMetrics(async (req: Request) => {
  const body = await req.json();
  const { name } = body;
  const key = name.toLowerCase();

  if (!supportedMetrics[key]) {
    return Response.json({ error: 'no metric found' }, { status: 400 });
  }

  const metric = supportedMetrics[key];

  switch (name) {
    default:
      metric.reportToPrometheus(body);
      break;
  }

  return Response.json({ success: true });
}, '/metrics');
