import path from 'path';
import StyleDictionary from 'style-dictionary';
import { scopedCssVariables } from './formatters/scopes.js';

StyleDictionary.registerFormat({
  name: 'custom/css/scoped',
  format: scopedCssVariables,
});

const input = process.env.TOKENS_DIR ?? path.join(process.cwd(), 'tokens');
console.log(`Input path for tokens: ${input}`);
const buildPath = path.resolve(
  process.env.STYLES_DIR ?? path.join(process.cwd(), 'build'),
);
console.log(`Output path for CSS variables: ${buildPath}`);

const source = [
  path.join(input, 'global/**/*.json'), // lowest priority
  path.join(input, 'components/**/*.json'),
  path.join(input, 'themes/*.json'), // light.json, dark.json
];

if (process.env.BRAND) {
  source.push(path.join(input, 'themes', process.env.BRAND, '**/*.json'));
  console.log(`Using theme: ${process.env.BRAND}`);
}

console.log(
  `Source files:\n${source.map((file, i) => `    ${i + 1}: ${path.resolve(file)}`).join('\n')}`,
);

export default {
  source,
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath,
      files: [
        // {
        //   destination: 'debug.css',
        //   format: 'css/variables',
        //   options: {
        //     showFileHeader: true,
        //   },
        // },
        {
          destination: 'variables.css',
          format: 'custom/css/scoped',
          options: {
            showFileHeader: true,
          },
        },
      ],
    },
  },
};

// const brands = ['brandA', 'brandB'];
// const themes = ['light', 'dark'];

// module.exports = {
//   buildAllPlatforms() {
//     brands.forEach(brand => {
//       themes.forEach(theme => {
//         const sd = require('style-dictionary').extend({
//           source: [
//             'tokens/globals/**/*.json',
//             'tokens/components/**/*.json',
//             `tokens/${brand}/${theme}.overrides.json`
//           ],
//           platforms: {
//             css: {
//               transformGroup: 'css',
//               buildPath: `styles/${brand}/`,
//               files: [{
//                 destination: `${theme}.css`,
//                 format: 'css/variables',
//                 options: {
//                   selector: `[data-theme="${theme}"]`
//                 }
//               }]
//             }
//           }
//         });
//         sd.buildPlatform('css');
//       });
//     });
//   }
// };
