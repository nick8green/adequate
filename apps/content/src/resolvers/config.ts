import { Config } from '@content/graph/generated/types';
import repo, { ConfigRepository } from '@content/repository/Config';

export const getConfig = async (): Promise<Config> => {
  const siteConfig: ConfigRepository[] = await repo.getAll();
  const config: Config = {
    description: '',
    keywords: [],
    language: 'en',
    separator: '',
    title: '',
  };

  for (const { name, value } of siteConfig) {
    switch (name) {
      case 'SITE_LANGUAGE':
        config.language = value;
        break;
      case 'SITE_OWNER':
        config.owner = value;
        break;
      case 'SITE_TITLE':
        config.title = value;
        break;
      case 'SITE_DESCRIPTION':
        config.description = value;
        break;
      case 'SITE_KEYWORD':
        if (value && !config.keywords?.includes(value)) {
          config.keywords?.push(value);
        }
        break;
      case 'BRAND':
        config.brand = value;
        break;
      case 'THEME':
        config.theme = value;
        break;
      case 'TITLE_SEPARATOR':
        config.separator = value;
        break;
      default:
        throw new Error(`unknown config name: ${name}`);
    }
  }
  return config;
};
