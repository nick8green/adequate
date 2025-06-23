import {
  fcp,
  reportToPrometheus,
} from '@shared/metrics/webVitals/firstContentfulPaint';

jest.mock('prom-client', () => {
  const labelsMock = jest.fn().mockReturnValue({ set: jest.fn() });
  return {
    Gauge: jest.fn().mockImplementation(() => ({
      labels: labelsMock,
    })),
  };
});

describe('reportToPrometheus', () => {
  const mockLabels = (fcp as any).labels as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call fcp.labels with correct arguments and set value', () => {
    const setMock = jest.fn();
    mockLabels.mockReturnValueOnce({ set: setMock });

    const details = {
      navigationType: 'navigate',
      rating: 'good',
      value: 1234,
    };

    reportToPrometheus(details);

    expect(mockLabels).toHaveBeenCalledWith('navigate', 'good');
    expect(setMock).toHaveBeenCalledWith(1234);
  });

  it('should handle missing logDetails gracefully', () => {
    const setMock = jest.fn();
    mockLabels.mockReturnValueOnce({ set: setMock });

    // @ts-expect-error testing undefined input
    reportToPrometheus(undefined);

    expect(mockLabels).toHaveBeenCalledWith(undefined, undefined);
    expect(setMock).toHaveBeenCalledWith(undefined);
  });

  it('should catch and log errors', () => {
    const error = new Error('test error');
    mockLabels.mockImplementationOnce(() => {
      throw error;
    });
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    reportToPrometheus({
      navigationType: 'reload',
      rating: 'poor',
      value: 1000,
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Prometheus response time event error',
      error,
    );

    consoleErrorSpy.mockRestore();
  });
});
