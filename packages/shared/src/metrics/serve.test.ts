import { register as client } from '@shared/metrics';
import { endpoint } from '@shared/metrics/serve';
import { withMetrics } from '@shared/metrics/withMetrics';

jest.mock('@shared/metrics/withMetrics');
jest.mock('@shared/metrics', () => ({
  register: {
    metrics: jest.fn(),
    contentType: 'text/plain',
  },
}));

jest.mock('next/server', () => ({
  NextResponse: jest.fn().mockImplementation((body, opts) => ({ body, opts })),
}));

describe('endpoint', () => {
  const mockWithMetrics = withMetrics as jest.Mock;
  const mockMetrics = client.metrics as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockWithMetrics.mockImplementation((handler, path) => ({ handler, path }));
  });

  it('should call withMetrics with default path', async () => {
    const result = endpoint();
    expect(result.path).toBe('/metrics');
    expect(typeof result.handler).toBe('function');
  });

  it('should call withMetrics with custom path', async () => {
    const result = endpoint('/custom');
    expect(result.path).toBe('/custom');
  });

  it('handler should return a Response with metrics and correct headers', async () => {
    mockMetrics.mockResolvedValue('metrics-data');
    const result = endpoint();
    const response = await result.handler();

    expect(mockMetrics).toHaveBeenCalled();
    expect(response.body).toBe('metrics-data');
    expect(response.opts.headers).toEqual({
      'Cache-Control': 'no-store',
      'Content-Type': 'text/plain',
    });
  });
});
