'use client';
import '../public/styles/variables.css';
import '../public/styles/base.css';
import '@nick8green/components/dist/index.css';

import WebVitals from '@app/components/webVitals';
import { ConfigContext, ConfigProvider, SiteConfig } from '@app/context/config';
import {
  Footer,
  Header,
  Navigation,
  SocialMediaList,
  SocialMediaPlatform,
} from '@nick8green/components';
import { type FC, type PropsWithChildren, useContext } from 'react';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const brand = 'n8g';
  const theme = ''; // This can be set dynamically based on user preference or system settings
  const { lang, navigation, owner, title }: SiteConfig =
    useContext(ConfigContext);

  return (
    <html lang={lang}>
      <head>
        <link rel='stylesheet' href='/styles/theme.css' />
      </head>
      <body data-theme={theme} data-brand={brand}>
        <WebVitals />
        <ConfigProvider>
          <Header title={title}>
            <Navigation links={navigation} />
          </Header>
          {children}
          <Footer
            copyright={{
              owner: owner ?? 'Nick Green',
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
              socials={[
                {
                  handle: 'Facebook Profile',
                  platform: SocialMediaPlatform.Facebook,
                  url: '#',
                },
                {
                  handle: 'Instagram Profile',
                  platform: SocialMediaPlatform.Instagram,
                  url: '#',
                },
                {
                  handle: 'LinkedIn Profile',
                  platform: SocialMediaPlatform.LinkedIn,
                  url: '#',
                },
                {
                  handle: 'Twitter Handle',
                  platform: SocialMediaPlatform.X,
                  url: '#',
                },
              ]}
            />
          </Footer>
        </ConfigProvider>
      </body>
    </html>
  );
};

export default Layout;
