import { reportToPrometheus, responseTime } from '@shared/metrics/responseTime';
import { Histogram } from 'prom-client';

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

describe('responseTime Histogram', () => {
  // it('should be an instance of Histogram', () => {
  //     expect(responseTime).toBeInstanceOf(Histogram);
  // });
});

describe('reportToPrometheus', () => {
  let labelsSpy: jest.SpyInstance;
  let observeSpy: jest.SpyInstance;

  beforeEach(() => {
    labelsSpy = jest.spyOn(responseTime, 'labels');
    observeSpy = jest.fn();
    labelsSpy.mockReturnValue({ observe: observeSpy } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call responseTime.labels and observe with correct arguments', () => {
    const details = { route: '/test', statusCode: '200', responseTime: 123 };
    reportToPrometheus(details);
    expect(labelsSpy).toHaveBeenCalledWith('/test', '200');
    expect(observeSpy).toHaveBeenCalledWith(123);
  });

  it('should handle errors gracefully', () => {
    labelsSpy.mockImplementation(() => {
      throw new Error('fail');
    });
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    reportToPrometheus({ route: '/fail', statusCode: '500', responseTime: 1 });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Prometheus response time event error',
      expect.any(Error),
    );
    consoleErrorSpy.mockRestore();
  });
});
