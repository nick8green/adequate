import { NextResponse as Response } from 'next/server';

// Export a middleware function to expose a /metrics endpoint
export const GET = async (): Promise<Response> => {
  return new Response(
    'metrics endpoint is not available in this environment yet.',
  );
};

export const revalidate = 0;
