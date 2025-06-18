// import { NextResponse as Response } from 'next/server';
// import client from '@app/utilities/prometheus';

// // Export a middleware function to expose a /metrics endpoint
// export const GET = async (): Promise<Response> => {
//   return new Response(await client.metrics(), {
//     headers: {
//       'Cache-Control': 'no-store',
//       'Content-Type': client.contentType,
//     },
//   });
// };

// export const revalidate = 0;
