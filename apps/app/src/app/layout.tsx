import '../../public/styles/variables.css';
import '../../public/styles/base.css';
import '@nick8green/components/dist/index.css';

import { getConfig } from '@app/actions/config';
import WebVitals from '@app/components/webVitals';
import { ConfigProvider, SiteConfig } from '@app/context/config';
import {
  Footer,
  Header,
  Navigation,
  SocialMediaList,
  // SocialMediaPlatform,
} from '@nick8green/components';
import Script from 'next/script';
import type { FC, PropsWithChildren } from 'react';

export const generateMetadata = async () => {
  const config: SiteConfig = await getConfig();
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
  };
};

const Layout: FC<PropsWithChildren> = async ({ children }) => {
  const config: SiteConfig = await getConfig();

  return (
    <html lang={config.language || 'en'}>
      <head>
        {process.env.NODE_ENV === 'development' && (
          <Script
            id='development-styles'
            strategy='beforeInteractive'
            dangerouslySetInnerHTML={{
              __html: `
              const link = document.createElement('link');
              link.rel = 'stylesheet';
              link.href = '/styles/development.css';
              document.head.appendChild(link);
            `,
            }}
          />
        )}
      </head>
      <body data-theme={config.theme} data-brand={config.brand}>
        <WebVitals />
        <ConfigProvider config={config}>
          <Header title={config.title}>
            <Navigation type='main' links={config.navigation.header} />
          </Header>
          <section
            id='main'
            className='container fadeIn shiftInFromLeft shiftInFromTop'
          >
            {children}
          </section>
          <Footer
            copyright={{
              owner: config.owner ?? 'Nick Green',
              year: new Date().getFullYear(),
            }}
            links={[
              {
                label: 'Home',
                url: '/',
              },
            ]}
          >
            <SocialMediaList
              socials={
                [
                  // {
                  //   handle: 'Facebook Profile',
                  //   platform: SocialMediaPlatform.Facebook,
                  //   url: '#',
                  // },
                  // {
                  //   handle: 'Instagram Profile',
                  //   platform: SocialMediaPlatform.Instagram,
                  //   url: '#',
                  // },
                  // {
                  //   handle: 'LinkedIn Profile',
                  //   platform: SocialMediaPlatform.LinkedIn,
                  //   url: '#',
                  // },
                  // {
                  //   handle: 'Twitter Handle',
                  //   platform: SocialMediaPlatform.X,
                  //   url: '#',
                  // },
                ]
              }
            />
          </Footer>
        </ConfigProvider>
      </body>
    </html>
  );
};

export default Layout;
