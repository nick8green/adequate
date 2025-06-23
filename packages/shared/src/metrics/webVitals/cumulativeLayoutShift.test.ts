import {
  cls,
  reportToPrometheus,
} from '@shared/metrics/webVitals/cumulativeLayoutShift';
import { Gauge } from 'prom-client';

jest.mock('prom-client', () => {
  const labelsMock = jest.fn().mockReturnValue({
    set: jest.fn(),
  });
  return {
    Gauge: jest.fn().mockImplementation(() => ({
      labels: labelsMock,
    })),
  };
});

describe('cumulativeLayoutShift', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // it('should create a Gauge with correct parameters', () => {
  //     expect(Gauge).toHaveBeenCalledWith({
  //         name: 'web_vitals_cls',
  //         help: 'cumulative layout shift',
  //         labelNames: ['navigationType', 'rating'],
  //     });
  // });

  it('should call cls.labels().set() with correct arguments', () => {
    const details = {
      navigationType: 'navigate',
      rating: 'good',
      value: 0.01,
    };
    reportToPrometheus(details);

    // @ts-ignore
    const labelsMock = cls.labels as jest.Mock;
    expect(labelsMock).toHaveBeenCalledWith('navigate', 'good');
    expect(labelsMock().set).toHaveBeenCalledWith(0.01);
  });

  it('should handle errors gracefully', () => {
    // @ts-ignore
    const labelsMock = cls.labels as jest.Mock;
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
});
