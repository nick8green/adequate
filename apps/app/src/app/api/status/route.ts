import handler from '@shared/routes/status';

export const GET = handler('/status');

export const revalidate = 5; // Revalidate every 5 seconds
