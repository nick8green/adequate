jest.mock('@nick8green/components', () => ({
  Loader: jest.fn(() => <div data-testid='mock-loader' />),
  LoaderType: { SPINNER: 'SPINNER' },
}));

import { Loader } from '@app/app/loading';
import { render } from '@testing-library/react';

const { Loader: LoaderComponent, LoaderType } = jest.requireMock(
  '@nick8green/components',
);

describe('Loader', () => {
  it('renders LoaderComponent with correct props', () => {
    render(<Loader />);
    expect(LoaderComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: LoaderType.SPINNER,
        visible: true,
      }),
      undefined,
    );
  });

  it('renders the mocked loader', () => {
    const { getByTestId } = render(<Loader />);
    expect(getByTestId('mock-loader')).toBeInTheDocument();
  });
});
