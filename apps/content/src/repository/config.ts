import { client } from '@repository/client';

export type ConfigRepository = {
  name: string;
  value: string;
};

let config: ConfigRepository[] | null = null;

const dataType = 'config';

export const getConfig = async (): Promise<ConfigRepository[]> => {
  console.log('Fetching config from repository...'); // eslint-disable-line no-console
  if (config) {
    return config;
  }

  console.log('Cache miss, loading config from repository...'); // eslint-disable-line no-console
  config = await client.get<ConfigRepository>(dataType);

  setTimeout(() => {
    config = null;
  }, 1000);

  return config;
};
