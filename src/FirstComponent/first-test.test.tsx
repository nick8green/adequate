import { render, screen } from '@testing-library/react';

import FirstComponent from '.';

test('Example 1 renders successfully', () => {
  render(<FirstComponent />);

  const element = screen.getByText(/first test/i);

  expect(element).toBeInTheDocument();
});

test('demo', () => {
  expect(2).toEqual(2);
});
