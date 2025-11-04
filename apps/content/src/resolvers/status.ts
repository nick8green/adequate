import { AppStatus, State } from '@content/graph/generated/types';

export const getState = async (): Promise<State> => {
  return {
    status: AppStatus.Ok,
    message: 'Service is running',
    version: process.env.VERSION ?? 'development',
  };
};
