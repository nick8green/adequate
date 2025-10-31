import Page from '@app/components/Page';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Mocks
jest.mock('@shared/components/renderer', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ structure }: any) => (
    <div data-testid='renderer'>{JSON.stringify(structure)}</div>
  ),
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
    // Page is an async component, so we need to await its promise
    const PageComponent = await Page({
      params: {},
      slug: ['home'],
      structure: mockStructure,
    });

    render(PageComponent);

    expect(screen.getByTestId('renderer')).toHaveTextContent(
      JSON.stringify(mockStructure),
    );
  });
});
