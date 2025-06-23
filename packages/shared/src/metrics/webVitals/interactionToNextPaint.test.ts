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

describe('reportToPrometheus', () => {
  const mockGaugeInstance = inp as any;
  const setMock = jest.fn();
  const labelsMock = jest.fn(() => ({ set: setMock }));

  beforeEach(() => {
    jest.clearAllMocks();
    mockGaugeInstance.labels = labelsMock;
  });

  it('should call inp.labels().set() with correct arguments', () => {
    const details = {
      navigationType: 'navigate',
      rating: 'good',
      value: 123,
    };
    reportToPrometheus(details);
    expect(labelsMock).toHaveBeenCalledWith('navigate', 'good');
    expect(setMock).toHaveBeenCalledWith(123);
  });

  it('should handle missing logDetails gracefully', () => {
    reportToPrometheus(undefined as any);
    expect(labelsMock).toHaveBeenCalledWith(undefined, undefined);
    expect(setMock).toHaveBeenCalledWith(undefined);
  });

  it('should catch and log errors', () => {
    const error = new Error('test error');
    mockGaugeInstance.labels = () => {
      throw error;
    };
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    reportToPrometheus({
      navigationType: 'navigate',
      rating: 'good',
      value: 123,
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Prometheus response time event error',
      error,
    );
    consoleErrorSpy.mockRestore();
  });
});
