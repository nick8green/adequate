import fs from 'fs';
import path from 'path';

import { flatten, generateCSS, generateCssVariables } from './generate-css';

jest.mock('fs');
jest.mock('path');

describe('flatten', () => {
  it('flattens a nested object', () => {
    const input = {
      color: {
        primary: '#fff',
        secondary: '#000',
        nested: {
          value: 'test',
        },
      },
      spacing: {
        small: '4px',
      },
    };
    expect(flatten(input)).toEqual({
      'color-primary': '#fff',
      'color-secondary': '#000',
      'color-nested-value': 'test',
      'spacing-small': '4px',
    });
  });

  it('handles empty object', () => {
    expect(flatten({})).toEqual({});
  });

  it('handles non-nested object', () => {
    expect(flatten({ a: '1', b: '2' })).toEqual({ a: '1', b: '2' });
  });
});

describe('generateCssVariables', () => {
  it('generates CSS variables for a theme', () => {
    const tokens = { 'color-primary': '#fff', 'spacing-small': '4px' };
    const themeName = 'light-theme';
    const expected = `.light-theme {\n  --color-primary: #fff;\n  --spacing-small: 4px;\n}\n`;
    expect(generateCssVariables(tokens, themeName)).toBe(expected);
  });

  it('handles empty tokens', () => {
    expect(generateCssVariables({}, 'empty-theme')).toBe(
      `.empty-theme {\n\n}\n`,
    );
  });
});

describe('generateCSS', () => {
  const mockReaddirSync = fs.readdirSync as jest.Mock;
  const mockReadFileSync = fs.readFileSync as jest.Mock;
  const mockWriteFileSync = fs.writeFileSync as jest.Mock;
  const mockExistsSync = fs.existsSync as jest.Mock;
  const mockMkdirSync = fs.mkdirSync as jest.Mock;
  const mockJoin = path.join as jest.Mock;
  const mockBasename = path.basename as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockJoin.mockImplementation((...args: string[]) => args.join('/'));
    mockBasename.mockImplementation((file: string) =>
      file.replace('.json', ''),
    );
  });

  it('generates CSS from JSON files and writes output', () => {
    mockReaddirSync.mockReturnValue(['light.json', 'dark.json']);
    mockReadFileSync
      .mockReturnValueOnce(JSON.stringify({ color: { primary: '#fff' } }))
      .mockReturnValueOnce(JSON.stringify({ color: { primary: '#000' } }));
    mockExistsSync.mockReturnValue(false);

    generateCSS('inputDir', 'outDir', 'out.css');

    expect(mockReaddirSync).toHaveBeenCalledWith('inputDir');
    expect(mockReadFileSync).toHaveBeenCalledWith(
      'inputDir/light.json',
      'utf-8',
    );
    expect(mockReadFileSync).toHaveBeenCalledWith(
      'inputDir/dark.json',
      'utf-8',
    );
    expect(mockMkdirSync).toHaveBeenCalledWith('outDir', { recursive: true });
    expect(mockWriteFileSync).toHaveBeenCalledWith(
      'outDir/out.css',
      expect.stringContaining('.light-theme'),
    );
    expect(mockWriteFileSync).toHaveBeenCalledWith(
      'outDir/out.css',
      expect.stringContaining('.dark-theme'),
    );
  });

  it('does not create directory if it exists', () => {
    mockReaddirSync.mockReturnValue([]);
    mockExistsSync.mockReturnValue(true);

    generateCSS('inputDir', 'outDir', 'out.css');

    expect(mockMkdirSync).not.toHaveBeenCalled();
  });
});
