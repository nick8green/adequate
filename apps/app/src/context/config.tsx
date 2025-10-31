'use client';

export type Link = {
  url: string;
  label: string;
  children?: Link[];
};

export type SiteConfig = {
  description?: string;
  keywords?: string[];
  lang: string;
  navigation: Link[];
  owner?: string;
  title: string;
  brand: string;
  theme?: string;
};

const defaultConfig: SiteConfig = {
  lang: 'en',
  navigation: [],
  owner: 'Nick 8 Green',
  title: 'N8G Adequate',
  brand: 'n8g',
};

import { createContext, FC, PropsWithChildren, useContext } from 'react';

export const ConfigContext = createContext<SiteConfig>(defaultConfig);

export const useConfig = () => useContext(ConfigContext);

export const ConfigProvider: FC<PropsWithChildren<{ config: SiteConfig }>> = ({
  config,
  children,
}) => {
  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
};

export default ConfigProvider;
