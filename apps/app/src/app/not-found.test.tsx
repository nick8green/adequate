import '@testing-library/jest-dom';

import NotFoundPage from '@app/app/not-found';
import { render, screen } from '@testing-library/react';

jest.mock('next/link', () => {
  const MockLink = ({ href, children }: any) => <a href={href}>{children}</a>; // eslint-disable-line @typescript-eslint/no-explicit-any
  MockLink.displayName = 'MockNextLink';
  return MockLink;
});

describe('NotFound', () => {
  it('renders the Not Found heading', () => {
    render(<NotFoundPage />);
    expect(
      screen.getByRole('heading', { name: /not found/i }),
    ).toBeInTheDocument();
  });

  it('renders the not found message', () => {
    render(<NotFoundPage />);
    expect(
      screen.getByText(/could not find requested resource/i),
    ).toBeInTheDocument();
  });

  it('renders a link to return home', () => {
    render(<NotFoundPage />);
    const link = screen.getByRole('link', { name: /return home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });
});
