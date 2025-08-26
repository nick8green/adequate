import { render, screen } from '@testing-library/react';
import React from 'react';

import { Banner } from './index';

describe('Banner', () => {
  const defaultProps = {
    title: 'Test Title',
    description: 'Test Description',
    image: 'test-image.jpg',
    side: 'left' as const,
  };

  it('renders the title', () => {
    render(<Banner {...defaultProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<Banner {...defaultProps} />);
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders the image with correct src and alt', () => {
    render(<Banner {...defaultProps} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'test-image.jpg');
    expect(img).toHaveAttribute('alt', 'Test Title');
  });

  it('applies the correct side class', () => {
    render(<Banner {...defaultProps} />);
    expect(screen.getByRole('img').parentElement).toHaveClass(
      'banner-image left',
    );
  });

  it('applies the right side class when side is right', () => {
    render(<Banner {...defaultProps} side='right' />);
    expect(screen.getByRole('img').parentElement).toHaveClass(
      'banner-image right',
    );
  });

  it('has the correct structure and classes', () => {
    render(<Banner {...defaultProps} />);
    expect(screen.getByText('Test Title').className).toBe('banner-title');
    expect(screen.getByText('Test Description').className).toBe(
      'banner-description',
    );
    expect(
      screen.getByText('Test Title').closest('.banner'),
    ).toBeInTheDocument();
    expect(screen.getByText('Test Description').parentElement).toHaveClass(
      'banner-content',
    );
  });
});
