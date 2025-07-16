import { reportToPrometheus as reportRequestCount } from '@shared/metrics/httpRequestCount';
import { reportToPrometheus as reportResponseTime } from '@shared/metrics/responseTime';
import { withMetrics } from '@shared/metrics/withMetrics';

class MockResponse {
  status: number;
  body: string;
  constructor(body: string, options: { status: number }) {
    this.body = body;
    this.status = options.status;
  }
}

jest.mock('@shared/metrics/httpRequestCount', () => ({
  reportToPrometheus: jest.fn(),
}));
jest.mock('@shared/metrics/responseTime', () => ({
  reportToPrometheus: jest.fn(),
}));

describe('withMetrics', () => {
  const route = '/api/test';

  // Mock NextRequest
  const mockRequest = {
    method: 'GET',
  } as any; // eslint-disable-line @typescript-eslint/no-explicit-any

  // Mock Response
  const mockResponse = new MockResponse('ok', { status: 201 });

  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(global.Date, 'now')
      .mockImplementationOnce(() => 1000)
      .mockImplementationOnce(() => 1100);
  });

  it('should call the handler and return its response', async () => {
    const handler = jest.fn().mockResolvedValue(mockResponse);
    const wrapped = withMetrics(handler, route);

    const res = await wrapped(mockRequest);

    expect(handler).toHaveBeenCalledWith(mockRequest);
    expect(res).toBe(mockResponse);
  });

  it('should report request count with correct parameters', async () => {
    const handler = jest.fn().mockResolvedValue(mockResponse);
    const wrapped = withMetrics(handler, route);

    await wrapped(mockRequest);

    expect(reportRequestCount).toHaveBeenCalledWith({
      method: 'GET',
      route,
      statusCode: '201',
    });
  });

  it('should report response time with correct parameters', async () => {
    const handler = jest.fn().mockResolvedValue(mockResponse);
    const wrapped = withMetrics(handler, route);

    await wrapped(mockRequest);

    expect(reportResponseTime).toHaveBeenCalledWith({
      route,
      statusCode: '200',
      responseTime: 100,
    });
  });
});
