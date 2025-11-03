import handler, { Adapter, ServiceStatus } from '@shared/routes/status';

const adapters = {
  backend: async (): Promise<Adapter> => {
    const name = 'gateway';

    if (!process.env.GRAPHQL_ENDPOINT) {
      return {
        description: 'no application specified',
        name,
        status: 'DOWN',
      };
    }

    let status: ServiceStatus = 'UP';
    let description = 'backend is up and running';

    try {
      const resp = await fetch(`${process.env.GRAPHQL_ENDPOINT}/status`);
      if (resp.status !== 200 || resp.ok !== true) {
        throw new Error(resp.statusText);
      }
    } catch (e) {
      console.error('error fetching backend status:', e); // eslint-disable-line no-console
      description = 'backend is down';
      status = 'DOWN';
    }

    return { description, name, status };
  },
};

export const GET = handler('/status', adapters);

export const revalidate = 5; // Revalidate every 5 seconds
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
