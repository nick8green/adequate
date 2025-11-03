import { withMetrics } from '@shared/metrics/withMetrics';
import { cookies } from 'next/headers';
import { NextResponse as Response } from 'next/server';

export type Adapter = {
  description: string;
  name?: string;
  status: ServiceStatus;
};
type Adapters = { [key: string]: Adapter };

export type ServiceStatus = 'UP' | 'DOWN' | 'DEGRADED' | 'MAINTENANCE';

type Switch = {
  name: string;
  value: string;
};

export const endpoint = (
  path: string,
  adapters: { [key: string]: () => Promise<Adapter> } = {},
) =>
  withMetrics(async (): Promise<Response> => {
    let code = 200;
    const switches: Switch[] = [];

    const response = {
      adapters: {},
      currentTime: new Date().toISOString(),
      description: 'application is up and running',
      status: 'UP' as ServiceStatus,
      startTime: new Date().toISOString(),
      switches,
      uptime: 0,
      version: process.env.VERSION ?? 'development',
    };

    try {
      response.adapters = await getAdapters(adapters);

      const [status, description] = await getServiceStatus(response.adapters);
      response.status = status;
      response.description = description;

      const [startTime, currentTime, uptime] = getUptime();
      response.startTime = startTime;
      response.currentTime = currentTime;
      response.uptime = uptime;

      response.switches = await getSwitches();
    } catch (e) {
      console.error('error fetching status:', e); // eslint-disable-line no-console
      code = 500;
      response.status = 'DOWN';
      response.description = 'there is an issue with the application';
    }
    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' },
      status: code,
    });
  }, path);

export const getAdapters = async (adapters: {
  [key: string]: () => Promise<Adapter>;
}): Promise<Adapters> => {
  const results: Adapters = {};
  for (const [key, getAdapter] of Object.entries(adapters)) {
    results[key] = await getAdapter();
  }
  return results;
};

export const getServiceStatus = async (
  adapters: Adapters,
): Promise<[ServiceStatus, string]> => {
  let status: ServiceStatus = 'UP';
  const issues: string[] = [];

  try {
    const resp = await fetch(
      process.env['__NEXT_PRIVATE_ORIGIN'] ?? 'http://localhost:3000',
    );
    if (resp.status !== 200 || resp.ok !== true) {
      // eslint-disable-next-line no-console
      console.error(
        'error fetching self status:',
        resp.status,
        resp.statusText,
      );
      return ['DOWN', 'application is down'];
    }
  } catch (e) {
    console.error('error fetching service status:', e); // eslint-disable-line no-console
    return ['DOWN', 'application is down'];
  }

  for (const [key, adapter] of Object.entries(adapters)) {
    if (adapter.status === 'UP') {
      continue;
    }
    status = 'DEGRADED';
    issues.push(
      `${key} is ${adapter.status === 'MAINTENANCE' ? 'in maintenance' : adapter.status.toLowerCase()}`,
    );
  }

  // to do: logic for determining maintenance

  return [
    status,
    issues.length > 0 ? issues.join(', ') : 'service is up and running',
  ];
};

export const getSwitches = async (): Promise<Switch[]> => {
  const switches: Switch[] = [];
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  for (const cookie of allCookies) {
    if (!cookie.name.startsWith('switch_')) {
      continue;
    }
    const name = cookie.name.replace('switch_', '');
    const value = cookie.value === 'true' ? 'on' : 'off';
    switches.push({ name, value });
  }
  return switches;
};

export const getUptime = (): [string, string, number] => {
  const now = new Date();
  const uptime = process.uptime();
  const start = new Date(now.getTime() - uptime * 1000);

  return [start.toISOString(), now.toISOString(), uptime];
};

export default endpoint;
