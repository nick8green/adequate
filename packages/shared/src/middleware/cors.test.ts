import type { NextFunction, Request, Response } from 'express';

import { cors } from './cors';

describe('cors middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;
  let originalDomain: string | undefined;

  beforeEach(() => {
    originalDomain = process.env.DOMAIN;
    req = {
      headers: {},
      method: 'GET',
    };
    res = {
      header: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      end: jest.fn(),
    };
    next = jest.fn();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env.DOMAIN = originalDomain;
    jest.restoreAllMocks();
  });

  it('sets CORS headers for allowed origin from DOMAIN env', () => {
    process.env.DOMAIN = 'https://example.com, http://localhost:3000';
    req.headers.origin = 'https://example.com';

    cors(req as Request, res as Response, next as NextFunction);

    expect(res.header).toHaveBeenCalledWith(
      'Access-Control-Allow-Origin',
      'https://example.com',
    );
    expect(res.header).toHaveBeenCalledWith(
      'Access-Control-Allow-Credentials',
      'true',
    );
    expect(res.header).toHaveBeenCalledWith(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS',
    );
    expect(res.header).toHaveBeenCalledWith(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization',
    );
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.end).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled(); // eslint-disable-line no-console
  });

  it('sets CORS headers for allowed origin with default localhost', () => {
    delete process.env.DOMAIN;
    req.headers.origin = 'http://localhost:3000';

    cors(req as Request, res as Response, next as NextFunction);

    expect(res.header).toHaveBeenCalledWith(
      'Access-Control-Allow-Origin',
      'http://localhost:3000',
    );
    expect(next).toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled(); // eslint-disable-line no-console
  });

  it('logs error and does not set Access-Control-Allow-Origin for disallowed origin', () => {
    process.env.DOMAIN = 'https://example.com';
    req.headers.origin = 'https://notallowed.com';

    cors(req as Request, res as Response, next as NextFunction);

    expect(res.header).not.toHaveBeenCalledWith(
      'Access-Control-Allow-Origin',
      'https://notallowed.com',
    );
    // eslint-disable-next-line no-console
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining(
        'Origin mismatch: https://notallowed.com vs https://example.com',
      ),
    );
    expect(next).toHaveBeenCalled();
  });

  it('handles OPTIONS preflight request and ends response', () => {
    process.env.DOMAIN = 'https://example.com';
    req.headers.origin = 'https://example.com';
    req.method = 'OPTIONS';

    cors(req as Request, res as Response, next as NextFunction);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.end).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('handles missing origin header gracefully', () => {
    process.env.DOMAIN = 'https://example.com';
    req.headers = {};

    cors(req as Request, res as Response, next as NextFunction);

    expect(res.header).not.toHaveBeenCalledWith(
      'Access-Control-Allow-Origin',
      '',
    );
    // eslint-disable-next-line no-console
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('Origin mismatch:  vs https://example.com'),
    );
    expect(next).toHaveBeenCalled();
  });
});
