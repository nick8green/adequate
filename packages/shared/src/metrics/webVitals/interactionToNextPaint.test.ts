import {
  inp,
  reportToPrometheus,
} from '@shared/metrics/webVitals/interactionToNextPaint';

jest.mock('prom-client', () => {
  const labelsMock = jest.fn().mockReturnValue({ set: jest.fn() });
  return {
    Gauge: jest.fn().mockImplementation(() => ({
      labels: labelsMock,
    })),
  };
});

describe('interactionToNextPaint', () => {
  const mockLabels = (inp as any).labels as jest.Mock; // eslint-disable-line @typescript-eslint/no-explicit-any

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call inp.labels with correct arguments and set value', () => {
    const setMock = jest.fn();
    mockLabels.mockReturnValueOnce({ set: setMock });

    const details = {
      navigationType: 'navigate',
      rating: 'good',
      value: 0.01,
    };

    reportToPrometheus(details);

    expect(mockLabels).toHaveBeenCalledWith('navigate', 'good');
    expect(setMock).toHaveBeenCalledWith(0.01);
  });

  it('should handle errors gracefully', () => {
    const labelsMock = inp.labels as jest.Mock;
    labelsMock.mockImplementationOnce(() => {
      throw new Error('test error');
    });
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    reportToPrometheus({
      navigationType: 'navigate',
      rating: 'bad',
      value: 0.5,
    });

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
