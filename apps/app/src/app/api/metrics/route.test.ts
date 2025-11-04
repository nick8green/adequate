import { jest } from '@jest/globals';

// apps/app/src/app/api/metrics/route.test.ts

jest.mock('@shared/metrics', () => {
  return {
    register: {
      registerMetric: jest.fn(),
    },
  };
});

jest.mock('@shared/metrics/collect', () => {
  return {
    __esModule: true,
    default: jest.fn(() => 'COLLECT_RETURN'),
  };
});

jest.mock('@shared/metrics/serve', () => {
  return {
    __esModule: true,
    next: jest.fn(() => 'SERVE_RETURN'),
  };
});

jest.mock('@shared/metrics/pageTransition', () => {
  return {
    __esModule: true,
    default: {
      pageTransition: { id: 'pageTransitionMock' },
    },
  };
});

jest.mock('@shared/metrics/responseTime', () => {
  return {
    __esModule: true,
    default: {
      responseTime: { id: 'responseTimeMock' },
    },
  };
});

jest.mock('@shared/metrics/webVitals/cumulativeLayoutShift', () => {
  return {
    __esModule: true,
    default: { id: 'clsMock' },
  };
});

jest.mock('@shared/metrics/webVitals/firstContentfulPaint', () => {
  return {
    __esModule: true,
    default: { id: 'fcpMock' },
  };
});
jest.mock('@shared/metrics/webVitals/firstInputDelay', () => {
  return {
    __esModule: true,
    default: { id: 'fidMock' },
  };
});
jest.mock('@shared/metrics/webVitals/interactionToNextPaint', () => {
  return {
    __esModule: true,
    default: { id: 'inpMock' },
  };
});
jest.mock('@shared/metrics/webVitals/largestContentfulPaint', () => {
  return {
    __esModule: true,
    default: { id: 'lcpMock' },
  };
});
jest.mock('@shared/metrics/webVitals/timeToFirstBite', () => {
  return {
    __esModule: true,
    default: { id: 'ttfbMock' },
  };
});

describe('apps/app/src/app/api/metrics/route', () => {
  beforeEach(() => {
    jest.resetModules();
    // re-apply mocks after resetModules (jest.mock calls above are hoisted and remain effective)
  });

  it('registers responseTime and pageTransition metrics on import', async () => {
    const metricsModule = jest.requireMock('@shared/metrics');
    const responseTimeModule = jest.requireMock('@shared/metrics/responseTime');
    const pageTransitionModule = jest.requireMock(
      '@shared/metrics/pageTransition',
    );

    // import module under test (executes top-level registration)
    await import('./route');

    expect(metricsModule.register.registerMetric).toHaveBeenCalledTimes(2);
    expect(metricsModule.register.registerMetric).toHaveBeenCalledWith(
      responseTimeModule.responseTime,
    );
    expect(metricsModule.register.registerMetric).toHaveBeenCalledWith(
      pageTransitionModule.pageTransition,
    );
  });

  it('exports GET and POST wired to serve and collect with /metrics and supported metrics', async () => {
    const collectModule = jest.requireMock('@shared/metrics/collect');
    const serveModule = jest.requireMock('@shared/metrics/serve');

    // obtain all mocked metric modules to assert identity
    const cls = jest.requireMock(
      '@shared/metrics/webVitals/cumulativeLayoutShift',
    );
    const fcp = jest.requireMock(
      '@shared/metrics/webVitals/firstContentfulPaint',
    );
    const fid = jest.requireMock('@shared/metrics/webVitals/firstInputDelay');
    const inp = jest.requireMock(
      '@shared/metrics/webVitals/interactionToNextPaint',
    );
    const lcp = jest.requireMock(
      '@shared/metrics/webVitals/largestContentfulPaint',
    );
    const ttfb = jest.requireMock('@shared/metrics/webVitals/timeToFirstBite');
    const responseTimeModule = jest.requireMock('@shared/metrics/responseTime');
    const pageTransitionModule = jest.requireMock(
      '@shared/metrics/pageTransition',
    );

    // import module under test
    const route = await import('./route');

    // ensure serve (GET) was called with '/metrics' and its return exported
    expect(serveModule.next).toHaveBeenCalledWith('/metrics');
    expect(route.GET).toBe('SERVE_RETURN');

    // ensure collect (POST) was called with '/metrics' and the supportedMetrics object
    expect(collectModule.default).toHaveBeenCalledTimes(1);
    const collectCallArgs = (collectModule.default as jest.Mock).mock.calls[0];
    expect(collectCallArgs[0]).toBe('/metrics');

    const supportedMetricsArg = collectCallArgs[1];
    // keys expected on supported metrics
    expect(supportedMetricsArg).toBeDefined();
    expect(supportedMetricsArg.cls).toBe(cls);
    expect(supportedMetricsArg.fcp).toBe(fcp);
    expect(supportedMetricsArg.fid).toBe(fid);
    expect(supportedMetricsArg.inp).toBe(inp);
    expect(supportedMetricsArg.lcp).toBe(lcp);
    expect(supportedMetricsArg.ttfb).toBe(ttfb);
    expect(supportedMetricsArg.responsetime).toBe(responseTimeModule);
    expect(supportedMetricsArg.pagetransition).toBe(pageTransitionModule);

    // ensure route.POST is the return value from collect
    expect(route.POST).toBe('COLLECT_RETURN');
  });
});
