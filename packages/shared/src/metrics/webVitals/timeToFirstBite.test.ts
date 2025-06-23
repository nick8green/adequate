import {
  reportToPrometheus,
  ttfb,
} from '@shared/metrics/webVitals/timeToFirstBite';

jest.mock('prom-client', () => {
  const labelsMock = jest.fn().mockReturnValue({ set: jest.fn() });
  return {
    Gauge: jest.fn().mockImplementation(() => ({
      labels: labelsMock,
    })),
  };
});

describe('reportToPrometheus', () => {
  const mockLabels = (ttfb as any).labels as jest.Mock;
  const mockSet = (ttfb as any).set as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the mocks to ensure correct chaining
    (ttfb as any).labels = jest.fn().mockReturnValue(ttfb);
    (ttfb as any).set = jest.fn();
  });

  it('should set the gauge with correct labels and value', () => {
    const details = {
      navigationType: 'navigate',
      rating: 'good',
      value: 123,
    };

    reportToPrometheus(details);

    expect((ttfb as any).labels).toHaveBeenCalledWith('navigate', 'good');
    expect((ttfb as any).set).toHaveBeenCalledWith(123);
  });

  it('should handle missing logDetails gracefully', () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    // @ts-expect-error testing undefined input
    reportToPrometheus(undefined);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it('should catch and log errors from ttfb.labels/set', () => {
    (ttfb as any).labels = jest.fn(() => {
      throw new Error('fail');
    });
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const details = {
      navigationType: 'navigate',
      rating: 'bad',
      value: 456,
    };

    reportToPrometheus(details);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Prometheus response time event error',
      expect.any(Error),
    );
    consoleErrorSpy.mockRestore();
  });
});
