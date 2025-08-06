import { reportToPrometheus, responseTime } from '@shared/metrics/responseTime';

jest.mock('prom-client', () => {
  const observeMock = jest.fn();
  return {
    Histogram: jest.fn().mockImplementation(() => ({
      labels: jest.fn(() => ({
        observe: observeMock,
      })),
    })),
  };
});

describe('responseTime', () => {
  const mockLabels = (responseTime as any).labels as jest.Mock; // eslint-disable-line @typescript-eslint/no-explicit-any

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call responseTime.labels with correct arguments and set value', () => {
    const observeMock = jest.fn();
    mockLabels.mockReturnValueOnce({ observe: observeMock });

    const details = { route: '/test', statusCode: '200', responseTime: 123 };

    reportToPrometheus(details);

    expect(mockLabels).toHaveBeenCalledWith('/test', '200');
    expect(observeMock).toHaveBeenCalledWith(123);
  });

  it('should handle errors gracefully', () => {
    const labelsMock = responseTime.labels as jest.Mock;
    labelsMock.mockImplementationOnce(() => {
      throw new Error('test error');
    });
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    reportToPrometheus({ route: '/bad', statusCode: '500', responseTime: 321 });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Prometheus response time event error',
      expect.any(Error),
    );
    consoleSpy.mockRestore();
  });

  it('should catch and log errors', () => {
    const error = new Error('test error');
    mockLabels.mockImplementationOnce(() => {
      throw error;
    });
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    reportToPrometheus({
      route: '/log',
      statusCode: '401',
      responseTime: 1000,
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Prometheus response time event error',
      error,
    );

    consoleErrorSpy.mockRestore();
  });
});
