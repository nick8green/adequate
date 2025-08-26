/* eslint-disable @typescript-eslint/no-require-imports */

jest.mock('prom-client');
jest.mock('@shared/metrics/containerStartTime');
jest.mock('@shared/metrics/webVitals/cumulativeLayoutShift');
jest.mock('@shared/metrics/webVitals/firstContentfulPaint');
jest.mock('@shared/metrics/webVitals/firstInputDelay');
jest.mock('@shared/metrics/webVitals/interactionToNextPaint');
jest.mock('@shared/metrics/webVitals/largestContentfulPaint');
jest.mock('@shared/metrics/webVitals/timeToFirstBite');

const reportHttpRequestCount = jest.fn();
const reportResponseTime = jest.fn();
const withMetricsMock = jest.fn();

jest.mock('@shared/metrics/httpRequestCount', () => ({
  reportToPrometheus: reportHttpRequestCount,
  httpRequestCounter: {},
}));

jest.mock('@shared/metrics/responseTime', () => ({
  reportToPrometheus: reportResponseTime,
  responseTime: {},
}));

jest.mock('@shared/metrics/withMetrics', () => ({
  withMetrics: withMetricsMock,
}));

describe('metrics/index', () => {
  let registerMetricMock: jest.Mock;
  let RegistryMock: jest.Mock;
  let collectDefaultMetricsMock: jest.Mock;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    registerMetricMock = jest.fn();
    RegistryMock = jest.fn().mockImplementation(() => ({
      registerMetric: registerMetricMock,
    }));
    collectDefaultMetricsMock = jest.fn();

    const promClient = require('prom-client');
    promClient.Registry.mockImplementation(RegistryMock);
    promClient.collectDefaultMetrics.mockImplementation(
      collectDefaultMetricsMock,
    );

    // Stub web vitals and base metric modules after mocks
    require('@shared/metrics/containerStartTime').containerStartTime = {};
    require('@shared/metrics/webVitals/cumulativeLayoutShift').cls = {};
    require('@shared/metrics/webVitals/firstContentfulPaint').fcp = {};
    require('@shared/metrics/webVitals/firstInputDelay').fid = {};
    require('@shared/metrics/webVitals/interactionToNextPaint').inp = {};
    require('@shared/metrics/webVitals/largestContentfulPaint').lcp = {};
    require('@shared/metrics/webVitals/timeToFirstBite').ttfb = {};
  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('should create a new Registry and collect default metrics', () => {
    require('./index');
    expect(RegistryMock).toHaveBeenCalledTimes(1);
    expect(collectDefaultMetricsMock).toHaveBeenCalledWith(
      expect.objectContaining({ register: expect.any(Object) }),
    );
  });

  it('should register all metrics', () => {
    require('./index');
    expect(registerMetricMock).toHaveBeenCalledTimes(9);

    const containerStartTimeModule = require('@shared/metrics/containerStartTime');
    const httpRequestCountModule = require('@shared/metrics/httpRequestCount');
    const responseTimeModule = require('@shared/metrics/responseTime');
    const cumulativeLayoutShiftModule = require('@shared/metrics/webVitals/cumulativeLayoutShift');
    const firstContentfulPaintModule = require('@shared/metrics/webVitals/firstContentfulPaint');
    const firstInputDelayModule = require('@shared/metrics/webVitals/firstInputDelay');
    const interactionToNextPaintModule = require('@shared/metrics/webVitals/interactionToNextPaint');
    const largestContentfulPaintModule = require('@shared/metrics/webVitals/largestContentfulPaint');
    const timeToFirstBiteModule = require('@shared/metrics/webVitals/timeToFirstBite');

    expect(registerMetricMock).toHaveBeenCalledWith(
      containerStartTimeModule.containerStartTime,
    );
    expect(registerMetricMock).toHaveBeenCalledWith(
      httpRequestCountModule.httpRequestCounter,
    );
    expect(registerMetricMock).toHaveBeenCalledWith(
      responseTimeModule.responseTime,
    );
    expect(registerMetricMock).toHaveBeenCalledWith(
      cumulativeLayoutShiftModule.cls,
    );
    expect(registerMetricMock).toHaveBeenCalledWith(
      firstContentfulPaintModule.fcp,
    );
    expect(registerMetricMock).toHaveBeenCalledWith(firstInputDelayModule.fid);
    expect(registerMetricMock).toHaveBeenCalledWith(
      interactionToNextPaintModule.inp,
    );
    expect(registerMetricMock).toHaveBeenCalledWith(
      largestContentfulPaintModule.lcp,
    );
    expect(registerMetricMock).toHaveBeenCalledWith(timeToFirstBiteModule.ttfb);
  });

  it('should export httpRequestCount and responseTime reportToPrometheus', () => {
    const { httpRequestCount, responseTime } = require('./index');
    expect(httpRequestCount).toBe(reportHttpRequestCount);
    expect(responseTime).toBe(reportResponseTime);
  });

  it('should export withMetrics', () => {
    const { withMetrics } = require('./index');
    expect(withMetrics).toBe(withMetricsMock);
  });

  it('should export register as Registry instance', () => {
    const { register } = require('./index');
    expect(register).toBeDefined();
    expect(typeof register.registerMetric).toBe('function');
  });
});
