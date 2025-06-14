import type * as Preset from '@docusaurus/preset-classic';
import type {Config} from '@docusaurus/types';
import {themes as prismThemes} from 'prism-react-renderer';

const config: Config = {
  title: 'Adequate',
  tagline: 'It does a job!',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: process.env.NODE_ENV !== 'production' ? 'http://localhost:3030' : 'https://nick8green.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: process.env.NODE_ENV !== 'production' ? '/' : '/adequate/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'nick8green', // Usually your GitHub org/user name.
  projectName: 'adequate', // Usually your repo name.
  deploymentBranch: 'release', // The branch that GitHub pages will deploy from.
  trailingSlash: false, // Set to true if you want to add a trailing slash to all URLs

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    // Docs from `apps/app`
    // [
    //   '@docusaurus/plugin-content-docs',
    //   {
    //     id: 'app-docs',
    //     path: '../../apps/app/docs',
    //     routeBasePath: 'docs/app', // Appears under /app
    //   },
    // ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Adequate by Nick8Green',
      // logo: {
      //   alt: 'My Site Logo',
      //   src: 'img/logo.svg',
      // },
      items: [
        {
          type: 'docsVersionDropdown',
        },
        {
          type: 'docSidebar',
          sidebarId: 'sidebar',
          position: 'left',
          label: 'Docs',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/nick8green/adequate',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Quick Links',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'Adequate App',
              to: '/docs/app',
            },
            {
              label: 'Adequate Service',
              to: '/docs/service',
            },
            {
              label: 'Adequate Admin',
              to: '/docs/admin',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'x',
              href: "https://x.com/nicogreeniho",
            },
            {
              label: 'linkedin',
              href: "https://www.linkedin.com/in/nick8green/",
            },
            {
              label: 'github',
              href: "https://github.com/nick8green/",
            },
            // {
            //   label: 'Stack Overflow',
            //   href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            // },
            // {
            //   label: 'Discord',
            //   href: 'https://discordapp.com/invite/docusaurus',
            // },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/nick8green/adequate',
            },
            {
              label: 'Feature Request',
              to: 'https://github.com/nick8green/adequate/issues/new?template=feature_request.yml',
            },
            {
              label: 'Report an Issue',
              to: 'https://github.com/nick8green/adequate/issues/new?template=bug_report.yml',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Adequate by Nick8Green. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
