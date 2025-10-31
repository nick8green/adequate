import { getPageData } from '@app/actions/page';
import PageRoute, { generateMetadata } from '@app/app/[[...slug]]/page';
import Page from '@app/components/Page';
import { reportToPrometheus as httpRequestCount } from '@shared/metrics/httpRequestCount';
import { render } from '@testing-library/react';
import { ResolvingMetadata } from 'next';
import * as Navigation from 'next/navigation';
import React from 'react';

// Mock dependencies
jest.mock('@app/components/Page', () => jest.fn(() => <div>Mocked Page</div>));
jest.mock('@shared/metrics/httpRequestCount', () => ({
  reportToPrometheus: jest.fn(),
}));
jest.mock('@app/actions/page', () => ({
  getPageData: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));

describe('generateMetadata', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns the correct metadata', async () => {
    (getPageData as jest.Mock).mockResolvedValue({
      meta: {
        title: 'Adequate',
        description: 'Basic framework for building a web application',
      },
    });
    const metadata = await generateMetadata(
      { params: Promise.resolve({ slug: ['about'] }) },
      Promise.resolve({} as ResolvingMetadata),
    );
    const data = {
      title: 'Adequate',
      description: 'Basic framework for building a web application',
    };
    expect(metadata).toEqual({
      ...data,
      openGraph: data,
    });
  });
});

describe('PageRoute', () => {
  const mockSlug = ['foo', 'bar'];
  const mockParams = Promise.resolve({ slug: mockSlug });
  const mockSearchParams = Promise.resolve({ q: 'test' });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls httpRequestCount with correct arguments', async () => {
    (getPageData as jest.Mock).mockResolvedValue({
      meta: {
        title: 'Adequate',
        description: 'Basic framework for building a web application',
      },
      slug: 'about',
      structure: [],
      type: 'PAGE',
    });
    await PageRoute({ params: mockParams, searchParams: mockSearchParams });
    expect(httpRequestCount).toHaveBeenCalledWith({
      method: 'GET',
      route: '/foo/bar',
      statusCode: '200',
    });
  });

  it('calls notFound if getPage throws "Page not found"', async () => {
    (getPageData as jest.Mock).mockRejectedValueOnce(
      new Error('Page not found'),
    );
    const notFoundMock = Navigation.notFound as jest.Mock;

    const result = await PageRoute({
      params: Promise.resolve({ slug: ['missing'] }),
      searchParams: Promise.resolve({}),
    });

    expect(getPageData).toHaveBeenCalledWith('missing');
    expect(notFoundMock).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it('rethrows error if getPage throws error other than "Page not found"', async () => {
    const error = new Error('Some other error');
    (getPageData as jest.Mock).mockRejectedValueOnce(error);
    const notFoundMock = Navigation.notFound as jest.Mock;

    await expect(
      PageRoute({
        params: Promise.resolve({ slug: ['error'] }),
        searchParams: Promise.resolve({}),
      }),
    ).rejects.toThrow('Some other error');

    expect(getPageData).toHaveBeenCalledWith('error');
    expect(notFoundMock).not.toHaveBeenCalled();
  });

  it('renders Page with correct props', async () => {
    (Page as jest.Mock).mockImplementation(({ slug, params }) => (
      <div>
        slug: {slug.join(',')}, params: {JSON.stringify(params)}
      </div>
    ));

    // Render the async component
    const { findByText } = render(
      await PageRoute({ params: mockParams, searchParams: mockSearchParams }),
    );

    expect(
      await findByText('slug: foo,bar, params: {"q":"test"}'),
    ).toBeInTheDocument();
  });

  it('handles empty slug gracefully', async () => {
    const emptySlugParams = Promise.resolve({ slug: [] });
    await PageRoute({
      params: emptySlugParams,
      searchParams: mockSearchParams,
    });
    expect(httpRequestCount).toHaveBeenCalledWith({
      method: 'GET',
      route: '/',
      statusCode: '200',
    });
  });

  it('handles undefined slug gracefully', async () => {
    const undefinedSlugParams = Promise.resolve({ slug: undefined as any }); // eslint-disable-line @typescript-eslint/no-explicit-any
    await PageRoute({
      params: undefinedSlugParams,
      searchParams: mockSearchParams,
    });
    expect(httpRequestCount).toHaveBeenCalledWith({
      method: 'GET',
      route: '/undefined',
      statusCode: '200',
    });
  });
});
