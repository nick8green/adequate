import { register } from '@app/instrumentation';
import { registerOTel } from '@vercel/otel';

jest.mock('@vercel/otel', () => ({
  registerOTel: jest.fn(),
}));

describe('register', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should call registerOTel with serviceName from APP_NAME env', () => {
    process.env.APP_NAME = 'custom-app';
    register();
    expect(registerOTel).toHaveBeenCalledWith({ serviceName: 'custom-app' });
  });

  it('should call registerOTel with default serviceName if APP_NAME is not set', () => {
    delete process.env.APP_NAME;
    register();
    expect(registerOTel).toHaveBeenCalledWith({ serviceName: 'adequate-app' });
  });
});
