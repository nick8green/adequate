import { NextFunction, Request, Response } from 'express';

export const cors = (req: Request, res: Response, next: NextFunction) => {
  const allowedOrigin: string[] = process.env.DOMAIN?.split(',').map((domain) =>
    domain.trim(),
  ) ?? ['http://localhost:3000'];
  const origin: string = req.headers.origin ?? '';

  console.debug(`[${process.env.APP_NAME}] Request received from: ${origin}`, req.headers);
  // 1. No ‘Access-Control-Allow-Origin’ Header
  if (allowedOrigin.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    // eslint-disable-next-line no-console
    console.error(`[${process.env.APP_NAME}] Origin mismatch: ${origin} vs ${allowedOrigin}`);
  }

  // 2. Credentials Not Allowed
  res.header('Access-Control-Allow-Credentials', 'true');

  // 3. Method Not Allowed
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  // 4. No ‘Access-Control-Allow-Headers’ Header
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 5. Preflight Request Handling (OPTIONS request)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
};
