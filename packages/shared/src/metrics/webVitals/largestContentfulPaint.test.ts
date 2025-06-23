import {
  lcp,
  reportToPrometheus,
} from '@shared/metrics/webVitals/largestContentfulPaint';

jest.mock('prom-client', () => {
  const labelsMock = jest.fn().mockReturnValue({ set: jest.fn() });
  return {
    Gauge: jest.fn().mockImplementation(() => ({
      labels: labelsMock,
    })),
  };
});

describe('largestContentfulPaint', () => {
  const mockLabels = (lcp as any).labels as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call lcp.labels().set() with correct arguments', () => {
    const details = {
      navigationType: 'navigate',
      rating: 'good',
      value: 1234,
    };

    reportToPrometheus(details);

    expect(mockLabels).toHaveBeenCalledWith('navigate', 'good');
    expect(mockLabels().set).toHaveBeenCalledWith(1234);
  });

  it('should handle missing logDetails gracefully', () => {
    reportToPrometheus(undefined as any);

    expect(mockLabels).toHaveBeenCalledWith(undefined, undefined);
    expect(mockLabels().set).toHaveBeenCalledWith(undefined);
  });

  it('should catch and log errors', () => {
    mockLabels.mockImplementationOnce(() => {
      throw new Error('test error');
    });
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    reportToPrometheus({
      navigationType: 'reload',
      rating: 'poor',
      value: 5678,
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Prometheus response time event error',
      expect.any(Error),
    );

    consoleErrorSpy.mockRestore();
  });
});
