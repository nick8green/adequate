import { getPage } from '@shared/data';
import { render, screen } from '@testing-library/react';
import { notFound } from 'next/navigation';
import React from 'react';

import Page from './index';

// Mocks
jest.mock('@shared/components/renderer', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ structure }: any) => (
    <div data-testid='renderer'>{JSON.stringify(structure)}</div>
  ),
}));
jest.mock('@shared/data', () => ({
  getPage: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));

describe('Page', () => {
  const mockStructure = [{ type: 'text', content: 'Hello' }];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Renderer with structure from getPage', async () => {
    (getPage as jest.Mock).mockResolvedValueOnce(mockStructure);

    // Page is an async component, so we need to await its promise
    const PageComponent = await Page({ params: {}, slug: ['home'] });

    render(PageComponent);

    expect(getPage).toHaveBeenCalledWith(['home'], {});
    expect(screen.getByTestId('renderer')).toHaveTextContent(
      JSON.stringify(mockStructure),
    );
  });

  it('calls notFound if getPage throws "Page not found"', async () => {
    (getPage as jest.Mock).mockRejectedValueOnce(new Error('Page not found'));
    (notFound as jest.Mock).mockReturnValue(null);

    const result = await Page({ params: {}, slug: ['missing'] });

    expect(getPage).toHaveBeenCalledWith(['missing'], {});
    expect(notFound).toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('rethrows error if getPage throws error other than "Page not found"', async () => {
    const error = new Error('Some other error');
    (getPage as jest.Mock).mockRejectedValueOnce(error);

    await expect(Page({ params: {}, slug: ['error'] })).rejects.toThrow(
      'Some other error',
    );
    expect(getPage).toHaveBeenCalledWith(['error'], {});
    expect(notFound).not.toHaveBeenCalled();
  });
});
