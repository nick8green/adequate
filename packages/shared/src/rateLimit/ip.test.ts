import { getIp } from '@shared/rateLimit/ip';

const mockHeaders = (headers: Record<string, string | undefined>) => ({
  get: (key: string) => headers[key.toLowerCase()],
});

const mockRequest = (headers: Record<string, string | undefined>) =>
  ({ headers: mockHeaders(headers) }) as any; // eslint-disable-line @typescript-eslint/no-explicit-any

describe('getIp', () => {
  it('returns the first IP from x-forwarded-for header', () => {
    const req = mockRequest({ 'x-forwarded-for': '1.2.3.4, 5.6.7.8' });
    expect(getIp(req)).toBe('1.2.3.4');
  });

  it('trims whitespace from x-forwarded-for', () => {
    const req = mockRequest({ 'x-forwarded-for': ' 9.8.7.6  , 5.4.3.2' });
    expect(getIp(req)).toBe('9.8.7.6');
  });

  it('returns x-real-ip if x-forwarded-for is not present', () => {
    const req = mockRequest({ 'x-real-ip': '10.0.0.1' });
    expect(getIp(req)).toBe('10.0.0.1');
  });

  it('returns 127.0.0.1 if no headers are present', () => {
    const req = mockRequest({});
    expect(getIp(req)).toBe('127.0.0.1');
  });

  it('returns 127.0.0.1 if headers are undefined', () => {
    const req = { headers: { get: () => undefined } } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    expect(getIp(req)).toBe('127.0.0.1');
  });
});
