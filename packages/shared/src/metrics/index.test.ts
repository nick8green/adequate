import * as containerStartTimeModule from '@shared/metrics/containerStartTime';
import * as httpRequestCountModule from '@shared/metrics/httpRequestCount';
import * as responseTimeModule from '@shared/metrics/responseTime';
import * as cumulativeLayoutShiftModule from '@shared/metrics/webVitals/cumulativeLayoutShift';
import * as firstContentfulPaintModule from '@shared/metrics/webVitals/firstContentfulPaint';
import * as firstInputDelayModule from '@shared/metrics/webVitals/firstInputDelay';
import * as interactionToNextPaintModule from '@shared/metrics/webVitals/interactionToNextPaint';
import * as largestContentfulPaintModule from '@shared/metrics/webVitals/largestContentfulPaint';
import * as timeToFirstBiteModule from '@shared/metrics/webVitals/timeToFirstBite';
import * as promClient from 'prom-client';

jest.mock('prom-client');
jest.mock('@shared/metrics/httpRequestCount');
jest.mock('@shared/metrics/responseTime');
jest.mock('@shared/metrics/containerStartTime');
jest.mock('@shared/metrics/webVitals/cumulativeLayoutShift');
jest.mock('@shared/metrics/webVitals/firstContentfulPaint');
jest.mock('@shared/metrics/webVitals/firstInputDelay');
jest.mock('@shared/metrics/webVitals/interactionToNextPaint');
jest.mock('@shared/metrics/webVitals/largestContentfulPaint');
jest.mock('@shared/metrics/webVitals/timeToFirstBite');
jest.mock('@shared/metrics/withMetrics');

describe('metrics/index', () => {
  let registerMetricMock: jest.Mock;
  let RegistryMock: jest.Mock;
  let collectDefaultMetricsMock: jest.Mock;

  beforeEach(() => {
    registerMetricMock = jest.fn();
    RegistryMock = jest.fn().mockImplementation(() => ({
      registerMetric: registerMetricMock,
    }));
    collectDefaultMetricsMock = jest.fn();

    (promClient.Registry as unknown as jest.Mock).mockImplementation(
      RegistryMock,
    );
    (
      promClient.collectDefaultMetrics as unknown as jest.Mock
    ).mockImplementation(collectDefaultMetricsMock);

    // Provide dummy metric objects for imports
    (containerStartTimeModule as any).containerStartTime = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
    (httpRequestCountModule as any).httpRequestCounter = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
    (responseTimeModule as any).responseTime = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
    (cumulativeLayoutShiftModule as any).cls = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
    (firstContentfulPaintModule as any).fcp = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
    (firstInputDelayModule as any).fid = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
    (interactionToNextPaintModule as any).inp = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
    (largestContentfulPaintModule as any).lcp = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
    (timeToFirstBiteModule as any).ttfb = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('should create a new Registry and collect default metrics', () => {
    require('./index'); // eslint-disable-line @typescript-eslint/no-require-imports
    expect(RegistryMock).toHaveBeenCalledTimes(1);
    expect(collectDefaultMetricsMock).toHaveBeenCalledWith(
      expect.objectContaining({ register: expect.any(Object) }),
    );
  });

  //   it('should register all metrics', () => {
  //     require('./index');
  //     // 3 base metrics + 6 web vitals = 9
  //     expect(registerMetricMock).toHaveBeenCalledTimes(9);
  //     expect(registerMetricMock).toHaveBeenCalledWith((containerStartTimeModule as any).containerStartTime);
  //     expect(registerMetricMock).toHaveBeenCalledWith((httpRequestCountModule as any).httpRequestCounter);
  //     expect(registerMetricMock).toHaveBeenCalledWith((responseTimeModule as any).responseTime);
  //     expect(registerMetricMock).toHaveBeenCalledWith((cumulativeLayoutShiftModule as any).cls);
  //     expect(registerMetricMock).toHaveBeenCalledWith((firstContentfulPaintModule as any).fcp);
  //     expect(registerMetricMock).toHaveBeenCalledWith((firstInputDelayModule as any).fid);
  //     expect(registerMetricMock).toHaveBeenCalledWith((interactionToNextPaintModule as any).inp);
  //     expect(registerMetricMock).toHaveBeenCalledWith((largestContentfulPaintModule as any).lcp);
  //     expect(registerMetricMock).toHaveBeenCalledWith((timeToFirstBiteModule as any).ttfb);
  //   });

  //   it('should export httpRequestCount and responseTime reportToPrometheus', async () => {
  //     (httpRequestCountModule as any).reportToPrometheus = jest.fn();
  //     (responseTimeModule as any).reportToPrometheus = jest.fn();
  //     const index = await import('./index');
  //     expect(index.httpRequestCount).toBe((httpRequestCountModule as any).reportToPrometheus);
  //     expect(index.responseTime).toBe((responseTimeModule as any).reportToPrometheus);
  //   });

  it('should export withMetrics', async () => {
    const withMetrics = jest.fn();
    jest.doMock('@shared/metrics/withMetrics', () => ({ withMetrics }));
    const index = await import('./index');
    expect(index.withMetrics).toBe(withMetrics);
  });

  it('should export register as Registry instance', async () => {
    const index = await import('./index');
    expect(index.register).toBeDefined();
    expect(typeof index.register.registerMetric).toBe('function');
  });
});
