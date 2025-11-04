import sitemap from '@app/app/sitemap';

/**
 * apps/app/src/app/sitemap.test.ts
 *
 * Jest tests for sitemap.ts
 *
 * Notes:
 * - Mocks @app/lib/graphql/client.getServerClient to return configurable pages (pagesMock).
 * - Tests cover URL generation, lastModified formatting, priority calculation (including parent-child),
 *   error when parent missing, and sorting HEADER before FOOTER.
 */

let pagesMock: any[] = [];

jest.mock('@app/lib/graphql/client', () => {
  return {
    getServerClient: () => ({
      query: jest
        .fn()
        .mockImplementation(() =>
          Promise.resolve({ data: { pages: { pages: pagesMock } } }),
        ),
    }),
  };
});

describe('sitemap', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    pagesMock = [];
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('returns correct url, priority and a formatted lastModified string when HOST is https', async () => {
    process.env.HOST = 'https://nick8green.co.uk';

    pagesMock = [
      {
        id: '1',
        slug: '',
        meta: {
          audit: [{ timestamp: new Date().toISOString() }],
          navigation: [{ type: 'HEADER', priority: 1 }],
        },
      },
    ];

    const result = await sitemap();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);
    expect(result[0].url).toBe('https://nick8green.co.uk');
    expect(typeof result[0].lastModified).toBe('string');
    expect(result[0].lastModified).toMatch(/^\d{4}-\d{1,2}-\d{1,2}$/);
    // header navigation yields priority 0.9
    expect(result[0].priority).toBeCloseTo(0.9);
  });

  it('computes parent and child priorities correctly', async () => {
    process.env.HOST = 'http://example.com';

    pagesMock = [
      {
        id: 'parent',
        slug: 'parent',
        meta: {
          // no navigation, no parent -> default priority 0.6
          audit: [{ timestamp: new Date().toISOString() }],
        },
      },
      {
        id: 'child',
        slug: 'child',
        meta: {
          parent: { id: 'parent' },
          audit: [{ timestamp: new Date().toISOString() }],
        },
      },
    ];

    const result = await sitemap();

    const parentEntry = result.find(
      (r) => r.url === 'http://example.com/parent',
    );
    const childEntry = result.find((r) => r.url === 'http://example.com/child');

    expect(parentEntry).toBeDefined();
    expect(childEntry).toBeDefined();

    // parent default 0.6, child = parent - 0.1 => 0.5
    expect(parentEntry!.priority).toBeCloseTo(0.6);
    expect(childEntry!.priority).toBeCloseTo(0.5);
  });

  it('rejects when a page references a non-existent parent', async () => {
    process.env.HOST = 'http://example.com';

    pagesMock = [
      {
        id: 'orphan',
        slug: 'orphan',
        meta: {
          parent: { id: 'does-not-exist' },
          audit: [{ timestamp: new Date().toISOString() }],
        },
      },
    ];

    await expect(sitemap()).rejects.toThrow('page parent not found');
  });

  it('sorts HEADER pages before FOOTER pages', async () => {
    process.env.HOST = 'http://site.test';

    pagesMock = [
      {
        id: 'footer-page',
        slug: 'footer',
        meta: {
          navigation: [{ type: 'FOOTER', priority: 2 }],
          audit: [{ timestamp: new Date().toISOString() }],
        },
      },
      {
        id: 'header-page',
        slug: 'header',
        meta: {
          navigation: [{ type: 'HEADER', priority: 1 }],
          audit: [{ timestamp: new Date().toISOString() }],
        },
      },
    ];

    const result = await sitemap();

    const urls = result.map((r) => r.url);
    // header page should come before footer page
    expect(urls.indexOf('http://site.test/header')).toBeLessThan(
      urls.indexOf('http://site.test/footer'),
    );
  });
});
