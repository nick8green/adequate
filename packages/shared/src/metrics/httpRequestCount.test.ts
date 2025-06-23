let promClient: any;
let reportToPrometheus: typeof import('@shared/metrics/httpRequestCount').reportToPrometheus;

describe('reportToPrometheus', () => {
  let originalConsoleError: typeof console.error;
  let labelsMock: jest.Mock;
  let incMock: jest.Mock;

  beforeEach(() => {
    // Re-import to get fresh mocks
    jest.resetModules();
    jest.mock('prom-client', () => {
      return {
        Counter: jest.fn().mockImplementation(() => ({
          labels: jest.fn().mockReturnValue({ inc: jest.fn() }),
        })),
      };
    });

    promClient = require('prom-client');
    reportToPrometheus =
      require('@shared/metrics/httpRequestCount').reportToPrometheus;

    labelsMock = promClient.Counter.mock.results[0].value.labels;
    incMock = labelsMock().inc;
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
    jest.clearAllMocks();
  });

  it('should increment the counter with correct labels', () => {
    const logDetails = {
      method: 'GET',
      route: '/api/test',
      statusCode: '200',
    };
    reportToPrometheus(logDetails);

    expect(labelsMock).toHaveBeenCalledWith('GET', '/api/test', '200');
    expect(incMock).toHaveBeenCalled();
  });

  it('should handle missing logDetails gracefully', () => {
    reportToPrometheus(undefined as any);

    expect(labelsMock).toHaveBeenCalledWith(undefined, undefined, undefined);
    expect(incMock).toHaveBeenCalled();
  });

  it('should catch and log errors', () => {
    labelsMock.mockImplementationOnce(() => {
      throw new Error('test error');
    });

    const logDetails = {
      method: 'POST',
      route: '/api/error',
      statusCode: '500',
    };

    reportToPrometheus(logDetails);

    expect(console.error).toHaveBeenCalledWith(
      'Prometheus event counter event error',
      expect.any(Error),
    );
  });
});
