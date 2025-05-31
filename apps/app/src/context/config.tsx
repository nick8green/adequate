/**
 * https://dev.to/codingbrowny/using-context-providers-in-nextjs-server-components-2gk4
 */
'use client';
import { createContext, FC, PropsWithChildren } from 'react';

export type Link = {
  url: string;
  label: string;
  children?: Link[];
};

export type SiteConfig = {
  description?: string;
  keywords?: string[];
  lang: 'en';
  navigation: Link[];
  owner?: string;
  separator?: string;
  title: string;
};

const defaultConfig: SiteConfig = {
  description: 'Basic framework for building a web application',
  keywords: [
    'framework',
    'web',
    'application',
    'typescript',
    'react',
    'nextjs',
  ],
  lang: 'en',
  navigation: [
    { url: '/', label: 'Home' },
    { url: '/about', label: 'About' },
    { url: '/contact', label: 'Contact' },
    {
      url: '/blog',
      label: 'Blog',
      children: [
        { url: '/blog/post-1', label: 'Post 1' },
        { url: '/blog/post-2', label: 'Post 2' },
        { url: '/blog/post-3', label: 'Post 3' },
      ],
    },
  ],
  owner: 'Nick Green',
  separator: ' | ',
  title: 'N8G Adequate',
};

export const ConfigContext = createContext<SiteConfig>(defaultConfig);

export const ConfigProvider: FC<PropsWithChildren> = ({ children }) => (
  <ConfigContext.Provider value={defaultConfig}>
    {children}
  </ConfigContext.Provider>
);
