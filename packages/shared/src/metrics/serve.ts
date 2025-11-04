import { register as client } from '@shared/metrics';
import { withMetrics } from '@shared/metrics/withMetrics';
import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import { NextResponse } from 'next/server';

export const next = (path: string = '/metrics') =>
  withMetrics(async (): Promise<NextResponse> => {
    return new NextResponse(await client.metrics(), {
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type': client.contentType,
      },
    });
  }, path);

export const express = async (_: ExpressRequest, response: ExpressResponse) => {
  const metrics = await client.metrics();
  response.set({
    'Cache-Control': 'no-store',
    'Content-Type': client.contentType,
  });
  response.send(metrics);
};
