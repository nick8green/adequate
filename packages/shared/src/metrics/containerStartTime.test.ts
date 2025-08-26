import { Gauge } from 'prom-client';

jest.mock('prom-client', () => {
  const labelsMock = jest.fn().mockReturnValue({ set: jest.fn() });
  return {
    Gauge: jest.fn().mockImplementation(() => ({
      labels: labelsMock,
      setToCurrentTime: jest.fn(),
    })),
  };
});

describe('containerStartTime', () => {
  let containerStartTime: Gauge;
  let GaugeMock: jest.Mock;

  beforeEach(() => {
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    GaugeMock = require('prom-client').Gauge as jest.Mock;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    ({ containerStartTime } = require('./containerStartTime'));
  });

  it('should create a Gauge with correct parameters', () => {
    expect(GaugeMock).toHaveBeenCalledWith({
      name: 'container_start_time_seconds',
      help: 'Time when the container started in seconds since epoch',
      labelNames: ['container_name'],
    });
  });

  it('should call setToCurrentTime on the Gauge instance', () => {
    expect(containerStartTime.setToCurrentTime).toHaveBeenCalled();
  });
});
