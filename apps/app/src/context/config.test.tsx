import { render } from '@testing-library/react';
import React, { useContext } from 'react';

import { ConfigContext, ConfigProvider, SiteConfig } from './config';

const testConfig: SiteConfig = {
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
  title: 'N8G Adequate',
  brand: 'n8g',
  description: 'Basic framework for building a web application',
  keywords: [
    'framework',
    'web',
    'application',
    'typescript',
    'react',
    'nextjs',
  ],
  theme: 'light',
};

describe('ConfigContext', () => {
  it('provides the default config values', () => {
    let contextValue: SiteConfig | undefined;
    const TestComponent = () => {
      contextValue = useContext(ConfigContext);
      return null;
    };

    render(
      <ConfigProvider config={testConfig}>
        <TestComponent />
      </ConfigProvider>,
    );

    expect(contextValue).toBeDefined();
    expect(contextValue?.title).toBe('N8G Adequate');
    expect(contextValue?.lang).toBe('en');
    expect(contextValue?.owner).toBe('Nick Green');
    expect(contextValue?.navigation).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ url: '/', label: 'Home' }),
        expect.objectContaining({ url: '/about', label: 'About' }),
        expect.objectContaining({ url: '/contact', label: 'Contact' }),
        expect.objectContaining({
          url: '/blog',
          label: 'Blog',
          children: expect.arrayContaining([
            expect.objectContaining({ url: '/blog/post-1', label: 'Post 1' }),
            expect.objectContaining({ url: '/blog/post-2', label: 'Post 2' }),
            expect.objectContaining({ url: '/blog/post-3', label: 'Post 3' }),
          ]),
        }),
      ]),
    );
    expect(contextValue?.keywords).toEqual(
      expect.arrayContaining([
        'framework',
        'web',
        'application',
        'typescript',
        'react',
        'nextjs',
      ]),
    );
    expect(contextValue?.description).toBe(
      'Basic framework for building a web application',
    );
  });

  it('renders children', () => {
    const { getByText } = render(
      <ConfigProvider config={testConfig}>
        <div>Child Element</div>
      </ConfigProvider>,
    );
    expect(getByText('Child Element')).toBeInTheDocument();
  });
});
