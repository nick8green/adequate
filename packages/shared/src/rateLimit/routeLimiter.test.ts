/**
 * @jest-environment node
 */

import getRateLimiter from '@shared/rateLimit';
import { getIp } from '@shared/rateLimit/ip';
import { NextRequest, NextResponse } from 'next/server';

import limiter from './routeLimiter';

jest.mock('next/server', () => ({
  NextRequest: class {},
  NextResponse: {
    json: jest.fn(),
  },
}));
jest.mock('@shared/rateLimit');
jest.mock('@shared/rateLimit/ip');
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn(),
  },
}));

describe('limiter', () => {
  const mockRequest = {} as NextRequest;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call getIp with the request', async () => {
    (getIp as jest.Mock).mockReturnValue('1.2.3.4');
    (getRateLimiter as jest.Mock).mockReturnValue({
      limit: jest.fn().mockResolvedValue({ success: true }),
    });

    await limiter(mockRequest);

    expect(getIp).toHaveBeenCalledWith(mockRequest);
  });

  it('should call getRateLimiter and limiter.limit with the IP', async () => {
    (getIp as jest.Mock).mockReturnValue('1.2.3.4');
    const limitMock = jest.fn().mockResolvedValue({ success: true });
    (getRateLimiter as jest.Mock).mockReturnValue({ limit: limitMock });

    await limiter(mockRequest);

    expect(getRateLimiter).toHaveBeenCalled();
    expect(limitMock).toHaveBeenCalledWith('1.2.3.4');
  });

  it('should return 429 response if limit is not successful', async () => {
    (getIp as jest.Mock).mockReturnValue('1.2.3.4');
    (getRateLimiter as jest.Mock).mockReturnValue({
      limit: jest.fn().mockResolvedValue({ success: false }),
    });
    const jsonMock = (NextResponse.json as jest.Mock).mockReturnValue(
      'response',
    );

    const result = await limiter(mockRequest);

    expect(jsonMock).toHaveBeenCalledWith(
      { error: 'Too many requests' },
      { status: 429 },
    );
    expect(result).toBe('response');
  });

  it('should return undefined if limit is successful', async () => {
    (getIp as jest.Mock).mockReturnValue('1.2.3.4');
    (getRateLimiter as jest.Mock).mockReturnValue({
      limit: jest.fn().mockResolvedValue({ success: true }),
    });

    const result = await limiter(mockRequest);

    expect(result).toBeUndefined();
    expect(NextResponse.json).not.toHaveBeenCalled();
  });
});
