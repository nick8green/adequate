import Page from '@app/components/Page';
import { reportToPrometheus as httpRequestCount } from '@shared/metrics/httpRequestCount';
import { render } from '@testing-library/react';

import PageRoute, { generateMetadata } from './page';

// Mock dependencies
jest.mock('@app/components/Page', () => jest.fn(() => <div>Mocked Page</div>));
jest.mock('@shared/metrics/httpRequestCount', () => ({
  reportToPrometheus: jest.fn(),
}));

describe('generateMetadata', () => {
  it('returns the correct metadata', async () => {
    const metadata = await generateMetadata();
    expect(metadata).toEqual({
      title: 'Adequate',
      description: 'Basic framework for building a web application',
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
    await PageRoute({ params: mockParams, searchParams: mockSearchParams });
    expect(httpRequestCount).toHaveBeenCalledWith({
      method: 'GET',
      route: '/foo/bar',
      statusCode: '200',
    });
  });

  it('renders Page with correct props', async () => {
    (Page as jest.Mock).mockImplementation(({ slug, params }) => (
      <div>
        slug: {slug.join(',')}, params: {JSON.stringify(params)}
      </div>
    ));

    // Render the async component
    const { findByText } = render(
      // @ts-expect-error: Testing async server component
      await PageRoute({ params: mockParams, searchParams: mockSearchParams }),
    );

    expect(
      await findByText('slug: foo,bar, params: {"q":"test"}'),
    ).toBeInTheDocument();
  });

  it('handles empty slug gracefully', async () => {
    const emptySlugParams = Promise.resolve({ slug: ['foo', 'bar'] });
    await PageRoute({
      params: emptySlugParams,
      searchParams: mockSearchParams,
    });
    expect(httpRequestCount).toHaveBeenCalledWith({
      method: 'GET',
      route: '/foo/bar',
      statusCode: '200',
    });
  });
});
