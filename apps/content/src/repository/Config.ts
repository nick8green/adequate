import DataLoader from '@content/repository/DataLoader';

export type ConfigRepository = {
  name: string;
  value: string;
};

class Config extends DataLoader<ConfigRepository, ConfigRepository, object> {
  constructor() {
    super('config');
  }
}

const repo = new Config();
export default repo;
