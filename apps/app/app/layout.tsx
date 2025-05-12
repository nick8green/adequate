import type { FC, PropsWithChildren } from "react";

type SiteConfig = {
    description?: string;
    keywords?: string[];
    lang: 'en';
    owner?: string;
    separator?: string;
    title: string;
};

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const config: SiteConfig = {
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
    owner: 'Nick Green',
    separator: ' | ',
    title: 'N8G Adequate',
  };

  return (
    <html lang={config.lang}>
      <body>
        <header>
            <h1>{config.title}</h1>
        </header>
        {children}
        <footer>
            <p>&copy; {config.owner} {new Date().getFullYear()}. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
};

export default Layout;
