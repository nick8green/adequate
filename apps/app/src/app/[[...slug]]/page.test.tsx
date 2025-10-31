import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import React from 'react';

jest.mock('@app/actions/page', () => ({
  getPageData: jest.fn(),
}));

jest.mock('@shared/metrics/httpRequestCount', () => ({
  reportToPrometheus: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MockBlog = jest.fn((props: any) =>
  React.createElement('blog-mock', props),
);
jest.mock('@app/components/Blog', () => ({
  __esModule: true,
  default: MockBlog,
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MockPage = jest.fn((props: any) =>
  React.createElement('page-mock', props),
);
jest.mock('@app/components/Page', () => ({
  __esModule: true,
  default: MockPage,
}));

jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => 'NOT_FOUND_RETURN'),
}));

describe('app/[[...slug]]/page', () => {
  const getPageData = jest.requireMock('@app/actions/page')
    .getPageData as jest.Mock;
  const httpRequestCount = jest.requireMock('@shared/metrics/httpRequestCount')
    .reportToPrometheus as jest.Mock;
  const notFound = jest.requireMock('next/navigation').notFound as jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();
    // clear mock implementations between tests
    getPageData.mockReset();
    httpRequestCount.mockReset();
    MockBlog.mockClear();
    MockPage.mockClear();
    notFound.mockClear();
  });

  it('generateMetadata returns defaults when no meta present', async () => {
    getPageData.mockResolvedValue(undefined);

    const mod = await import('./page');
    const meta = await mod.generateMetadata({
      params: Promise.resolve({ slug: ['some', 'path'] }),
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    expect(meta.title).toBe('N8G Adequate');
    expect(meta.description).toBe(
      'Basic framework for building a web application',
    );
    expect(meta.openGraph?.title).toBe('N8G Adequate');
    expect(meta.openGraph?.description).toBe(
      'Basic framework for building a web application',
    );
    expect(getPageData).toHaveBeenCalledWith('some/path');
  });

  it('generateMetadata returns values from page data', async () => {
    getPageData.mockResolvedValue({
      meta: { title: 'My Title', description: 'My Desc' },
    });

    const mod = await import('./page');
    const meta = await mod.generateMetadata({
      params: Promise.resolve({ slug: ['x'] }),
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    expect(meta.title).toBe('My Title');
    expect(meta.description).toBe('My Desc');
    expect(meta.openGraph?.title).toBe('My Title');
    expect(meta.openGraph?.description).toBe('My Desc');
    expect(getPageData).toHaveBeenCalledWith('x');
  });

  it('PageRoute calls httpRequestCount and returns notFound when data is missing', async () => {
    getPageData.mockResolvedValue(undefined);

    const mod = await import('./page');
    await mod.default({
      params: Promise.resolve({ slug: ['missing'] }),
      searchParams: Promise.resolve({}),
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    expect(httpRequestCount).toHaveBeenCalledWith({
      method: 'GET',
      route: '/missing',
      statusCode: '200',
    });
    expect(notFound).toHaveBeenCalled();
  });

  it('PageRoute returns Blog component for BLOG type with correct props', async () => {
    const posts = [{ id: 'p1' }];
    getPageData.mockResolvedValue({
      type: 'BLOG',
      structure: posts,
      title: 'Blog Title',
    });

    const mod = await import('./page');
    const result = await mod.default({
      params: Promise.resolve({ slug: ['blog', 'post'] }),
      searchParams: Promise.resolve({ q: '1' }),
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    // The component returned should be the mocked Blog (component function)
    expect(result.type).toBe(MockBlog);
    expect(result.props.posts).toBe(posts);
    expect(result.props.slug).toEqual(['blog', 'post']);
    expect(result.props.params).toEqual({ q: '1' });
    expect(result.props.title).toBe('Blog Title');

    expect(httpRequestCount).toHaveBeenCalledWith({
      method: 'GET',
      route: '/blog/post',
      statusCode: '200',
    });
  });

  it('PageRoute returns Page component for PAGE type with structure prop', async () => {
    const structure = [{ kind: 'elem' }];
    getPageData.mockResolvedValue({
      type: 'PAGE',
      structure,
      title: 'Page Title',
    });

    const mod = await import('./page');
    const result = await mod.default({
      params: Promise.resolve({ slug: ['a', 'b'] }),
      searchParams: Promise.resolve({ foo: 'bar' }),
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    expect(result.type).toBe(MockPage);
    expect(result.props.structure).toBe(structure);
    expect(result.props.slug).toEqual(['a', 'b']);
    expect(result.props.params).toEqual({ foo: 'bar' });
    expect(httpRequestCount).toHaveBeenCalledWith({
      method: 'GET',
      route: '/a/b',
      statusCode: '200',
    });
  });

  it('PageRoute returns notFound when getPageData throws "Page not found"', async () => {
    getPageData.mockImplementationOnce(() => {
      throw new Error('Page not found');
    });

    const mod = await import('./page');
    await mod.default({
      params: Promise.resolve({ slug: ['x'] }),
      searchParams: Promise.resolve({}),
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    expect(notFound).toHaveBeenCalled();
  });

  it('PageRoute rethrows unknown errors from getPageData', async () => {
    getPageData.mockImplementationOnce(() => {
      throw new Error('unexpected');
    });

    const mod = await import('./page');

    await expect(
      mod.default({
        params: Promise.resolve({ slug: ['err'] }),
        searchParams: Promise.resolve({}),
      } as any), // eslint-disable-line @typescript-eslint/no-explicit-any
    ).rejects.toThrow('unexpected');
  });
});
