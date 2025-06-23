/**
 * @jest-environment node
 */

import { endpoint } from '@shared/metrics/collect';
import { withMetrics } from '@shared/metrics/withMetrics';
import { NextRequest as Request, NextResponse as Response } from 'next/server';

jest.mock('@shared/metrics/withMetrics', () => ({
  withMetrics: jest.fn((handler) => handler),
}));

describe('endpoint', () => {
  const mockReportToPrometheus = jest.fn();
  const supportedMetrics = {
    metric1: { reportToPrometheus: mockReportToPrometheus },
  };

  const createRequest = (
    body: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  ) =>
    ({
      json: jest.fn().mockResolvedValue(body),
    }) as unknown as Request;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 if metric is not found', async () => {
    const req = createRequest({ name: 'unknownMetric' });
    const jsonSpy = jest.spyOn(Response, 'json');

    const handler = endpoint('/metrics', supportedMetrics);
    await handler(req);

    expect(jsonSpy).toHaveBeenCalledWith(
      { error: 'no metric found' },
      { status: 400 },
    );
    expect(mockReportToPrometheus).not.toHaveBeenCalled();
  });

  it('calls reportToPrometheus and returns success if metric is found', async () => {
    const req = createRequest({ name: 'metric1', value: 123 });
    const jsonSpy = jest.spyOn(Response, 'json');

    const handler = endpoint('/metrics', supportedMetrics);
    await handler(req);

    expect(mockReportToPrometheus).toHaveBeenCalledWith({
      name: 'metric1',
      value: 123,
    });
    expect(jsonSpy).toHaveBeenCalledWith({ success: true });
  });

  it('uses default path if not provided', async () => {
    endpoint(undefined, supportedMetrics);
    expect(withMetrics).toHaveBeenCalledWith(expect.any(Function), '/metrics');
  });
});
