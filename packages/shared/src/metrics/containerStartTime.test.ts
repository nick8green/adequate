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
  let containerStartTime: any;
  let GaugeMock: jest.Mock;

  beforeEach(() => {
    jest.resetModules();
    GaugeMock = require('prom-client').Gauge as jest.Mock;
    // Re-import to get a fresh instance
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
