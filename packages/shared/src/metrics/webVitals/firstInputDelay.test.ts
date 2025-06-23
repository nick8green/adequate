import {
  fid,
  reportToPrometheus,
} from '@shared/metrics/webVitals/firstInputDelay';

jest.mock('prom-client', () => {
  const labelsMock = jest.fn().mockReturnValue({ set: jest.fn() });
  return {
    Gauge: jest.fn().mockImplementation(() => ({
      labels: labelsMock,
    })),
  };
});

describe('reportToPrometheus', () => {
  const mockLabels = (fid as unknown as { labels: jest.Mock }).labels;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call fid.labels with correct arguments and set value', () => {
    const details = {
      navigationType: 'navigate',
      rating: 'good',
      value: 123,
    };

    // @ts-ignore
    mockLabels.mockReturnValue({ set: jest.fn() });

    reportToPrometheus(details);

    expect(mockLabels).toHaveBeenCalledWith('navigate', 'good');
    const setMock = mockLabels.mock.results[0].value.set;
    expect(setMock).toHaveBeenCalledWith(123);
  });

  it('should handle missing logDetails gracefully', () => {
    // @ts-ignore
    mockLabels.mockReturnValue({ set: jest.fn() });

    expect(() => reportToPrometheus(undefined as any)).not.toThrow();
    expect(mockLabels).toHaveBeenCalledWith(undefined, undefined);
    const setMock = mockLabels.mock.results[0].value.set;
    expect(setMock).toHaveBeenCalledWith(undefined);
  });

  it('should catch and log errors', () => {
    // Simulate error in labels
    mockLabels.mockImplementation(() => {
      throw new Error('test error');
    });
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    expect(() =>
      reportToPrometheus({
        navigationType: 'reload',
        rating: 'poor',
        value: 42,
      }),
    ).not.toThrow();

    expect(consoleSpy).toHaveBeenCalledWith(
      'Prometheus response time event error',
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });
});
