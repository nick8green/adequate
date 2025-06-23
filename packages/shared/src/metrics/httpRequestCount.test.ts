let promClient: any; // eslint-disable-line @typescript-eslint/no-explicit-any
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

    promClient = require('prom-client'); // eslint-disable-line @typescript-eslint/no-require-imports
    reportToPrometheus =
      require('@shared/metrics/httpRequestCount').reportToPrometheus; // eslint-disable-line @typescript-eslint/no-require-imports

    labelsMock = promClient.Counter.mock.results[0].value.labels;
    incMock = labelsMock().inc;
    originalConsoleError = console.error; // eslint-disable-line no-console
    console.error = jest.fn(); // eslint-disable-line no-console
  });

  afterEach(() => {
    console.error = originalConsoleError; // eslint-disable-line no-console
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
    reportToPrometheus(undefined as any); // eslint-disable-line @typescript-eslint/no-explicit-any

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

    // eslint-disable-next-line no-console
    expect(console.error).toHaveBeenCalledWith(
      'Prometheus event counter event error',
      expect.any(Error),
    );
  });
});
