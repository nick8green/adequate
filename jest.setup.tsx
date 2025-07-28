import '@testing-library/jest-dom';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (
    props: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  ) => {
    return <img {...props} />; // eslint-disable-line
  },
}));
