import fs from 'fs';
import path from 'path';

/**
 * Recursively flattens a nested object into a single-level object with
 * keys representing the path to each value, joined by hyphens.
 *
 * @param obj - The object to flatten.
 * @param prefix - The prefix to prepend to each key (used internally for recursion).
 * @returns A flat object with hyphenated keys and string values.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const flatten = (obj: any, prefix = ''): Record<string, string> => {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      const newKey = prefix ? `${prefix}-${key}` : key;
      if (typeof value === 'object') {
        Object.assign(acc, flatten(value, newKey));
      } else {
        acc[newKey] = value as string;
      }
      return acc;
    },
    {} as Record<string, string>,
  );
};

/**
 * Generates a combined CSS file with CSS variables from JSON theme files.
 *
 * Reads all `.json` files from the specified input directory, flattens their contents,
 * and generates CSS variable declarations for each theme. The resulting CSS is written
 * to the specified output file within the given directory.
 *
 * @param input - The path to the directory containing JSON theme files.
 * @param directory - The output directory where the CSS file will be written.
 * @param file - The name of the output CSS file.
 */
export const generateCSS = (input: string, directory: string, file: string) => {
  const output = path.join(directory, file);
  const files = fs
    .readdirSync(input)
    .filter((file: string) => file.endsWith('.json'));
  let content = '';

  files.forEach((file: string) => {
    const token = path.basename(file, '.json');
    const data = JSON.parse(fs.readFileSync(path.join(input, file), 'utf-8'));
    const flatData = flatten(data);
    content += generateCssVariables(flatData, `${token}-theme`);
  });

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
  fs.writeFileSync(output, content);
};

/**
 * Generates a CSS class string containing CSS custom properties (variables) based on the provided tokens.
 *
 * @param tokens - An object where each key-value pair represents a CSS variable name and its value.
 * @param themeName - The name of the CSS class to be generated (without the leading dot).
 * @returns A string representing a CSS class with the specified variables.
 *
 * @example
 * ```typescript
 * const tokens = { colorPrimary: '#fff', fontSize: '16px' };
 * const css = generateCssVariables(tokens, 'my-theme');
 * // .my-theme {
 * //   --colorPrimary: #fff;
 * //   --fontSize: 16px;
 * // }
 * ```
 */
export const generateCssVariables = (
  tokens: Record<string, string>,
  themeName: string,
): string => {
  const lines = Object.entries(tokens).map(
    ([key, value]) => `  --${key}: ${value};`,
  );
  return `.${themeName} {\n${lines.join('\n')}\n}\n`;
};
