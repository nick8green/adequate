import '@testing-library/jest-dom';
import 'cross-fetch/polyfill';

import { TextDecoder, TextEncoder } from 'fast-text-encoding';
import { TransformStream } from 'web-streams-polyfill/ponyfill';

// Mock next/image to behave like a native <img>
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    return <img {...props} />; // eslint-disable-line
  },
}));

// Polyfill browser APIs for Node test environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.TransformStream = TransformStream;
