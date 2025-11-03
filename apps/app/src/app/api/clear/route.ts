import { getBrowserClient, getServerClient } from '@app/lib/graphql/client';
import { NextResponse } from 'next/server';

export const GET = async () => {
  getBrowserClient()?.clearStore();
  getServerClient()?.clearStore();
  return new NextResponse('Caches cleared', { status: 200 });
};

export const dynamic = 'force-dynamic';
