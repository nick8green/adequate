import { withMetrics } from '@shared/metrics/withMetrics';
import { cookies } from 'next/headers';
import { NextResponse as Response } from 'next/server';

type Adapter = {
  description: string;
  name?: string;
  status: ServiceStatus;
};
type Adapters = { [key: string]: Adapter };

type ServiceStatus = 'UP' | 'DOWN' | 'DEGRADED' | 'MAINTENANCE';

type Switch = {
  name: string;
  value: string;
};

export const endpoint = (path: string = '/status') =>
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
      response.adapters = await getAdapters();

      const [status, description] = await getSerivceStatus(response.adapters);
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
      response.description = 'thre is an issue with the application';
    }
    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' },
      status: code,
    });
  }, path);

export const checkBackend = async (): Promise<Adapter> => {
  if (!process.env.BACKEND_URL) {
    return {
      description: 'no system specified',
      name: 'backend',
      status: 'UP',
    };
  }

  let status: ServiceStatus = 'UP';
  let description = 'backend is up and running';
  const name = process.env.BACKEND_URL.includes('/graphql')
    ? 'graphql'
    : 'rest';

  try {
    const resp = await fetch(process.env.BACKEND_URL);
    if (resp.status !== 200 || resp.ok !== true) {
      throw new Error(resp.statusText);
    }
  } catch (e) {
    console.error('error fetching backend status:', e); // eslint-disable-line no-console
    status = 'DOWN';
    description = 'backend is down';
  }

  return { status, description, name };
};

export const getAdapters = async (): Promise<Adapters> => {
  return {
    backend: await checkBackend(),
  };
};

export const getSerivceStatus = async (
  adapters: Adapters,
): Promise<[ServiceStatus, string]> => {
  let status: ServiceStatus = 'UP';
  const issues: string[] = [];

  try {
    const resp = await fetch(
      process.env['__NEXT_PRIVATE_ORIGIN'] ?? 'http://localhost:3000',
    );
    if (resp.status !== 200 || resp.ok !== true) {
      throw new Error(await resp.text());
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
