import path from 'path';

import { generateCSS } from './generate-css';

(() => {
  const inputDirectory =
    process.env.TOKENS_DIR ?? path.join(__dirname, '../../..');
  const outputDirectory =
    process.env.STYLES_DIR ?? path.join(__dirname, '../../../public/styles');
  const outputFile = 'theme.css';

  console.log(`Generating CSS from tokens in ${inputDirectory}...`); // eslint-disable-line no-console
  // eslint-disable-next-line no-console
  console.log(
    `Output will be written to ${path.join(outputDirectory, outputFile)}`,
  );

  generateCSS(inputDirectory, outputDirectory, outputFile);
})();
