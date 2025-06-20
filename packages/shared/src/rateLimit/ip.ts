import { NextRequest } from 'next/server';

export const getIp = (request: NextRequest) =>
  request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
  request.headers.get('x-real-ip') ??
  '127.0.0.1';
