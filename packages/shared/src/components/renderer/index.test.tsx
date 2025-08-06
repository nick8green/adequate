import { render, screen } from '@testing-library/react';
import React from 'react';

import Renderer, { PageElement } from './index';

jest.mock('@shared/components/banner', () => ({
  Banner: (
    { children, ...props }: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  ) => (
    <div data-testid='Banner' {...props}>
      {children}
    </div>
  ),
}));
jest.mock('@nick8green/components', () => ({
  Markdown: (
    { children, ...props }: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  ) => (
    <div data-testid='Markdown' {...props}>
      {children}
    </div>
  ),
}));

describe('Renderer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering components', () => {
    const testCase: PageElement[] = [
      {
        type: 'Banner',
        props: { 'data-banner': 'banner-prop' },
        content: 'Banner Content',
      },
      {
        type: 'Markdown',
        props: { 'data-md': 'md-prop' },
        content: 'Markdown Content',
      },
    ];

    testCase.forEach((element) => {
      it(`renders ${element.type} component`, () => {
        render(<Renderer structure={[element]} />);
        const component = screen.getByTestId(element.type);
        expect(component).toBeInTheDocument();
        expect(component).toHaveTextContent(element.content);
      });
    });
  });

  it('renders Markdown by default if type is missing', () => {
    const structure: PageElement[] = [
      {
        props: { 'data-md': 'md-prop' },
        content: 'Default Markdown Content',
      },
    ];
    render(<Renderer structure={structure} />);
    const markdown = screen.getByTestId('Markdown');
    expect(markdown).toBeInTheDocument();
    expect(markdown).toHaveAttribute('data-md', 'md-prop');
    expect(markdown).toHaveTextContent('Default Markdown Content');
  });

  it('renders component without content', () => {
    const structure: PageElement[] = [
      {
        type: 'Banner',
        props: { 'data-banner': 'banner-prop' },
      },
    ];
    render(<Renderer structure={structure} />);
    const banner = screen.getByTestId('Banner');
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveAttribute('data-banner', 'banner-prop');
    expect(banner).toBeEmptyDOMElement();
  });

  it('throws error if component type does not exist', () => {
    const structure: PageElement[] = [
      {
        type: 'NonExistent',
        props: {},
        content: 'Should not render',
      },
    ];
    // Suppress error output for this test
    jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Renderer structure={structure} />)).toThrow(
      'component "NonExistent" not found!',
    );
    (console.error as jest.Mock).mockRestore(); // eslint-disable-line no-console
  });

  it('renders multiple elements', () => {
    const structure: PageElement[] = [
      { type: 'Banner', props: { id: 'b1' }, content: 'Banner 1' },
      { type: 'Markdown', props: { id: 'm1' }, content: 'Markdown 1' },
    ];
    render(<Renderer structure={structure} />);
    expect(screen.getByTestId('Banner')).toHaveTextContent('Banner 1');
    expect(screen.getByTestId('Markdown')).toHaveTextContent('Markdown 1');
  });
});
