import path from 'path';

const input = process.env.TOKENS_DIR ?? path.join(process.cwd(), 'tokens');
console.log(`Input path for tokens: ${input}`);
const buildPath = path.resolve(
  process.env.STYLES_DIR ?? path.join(process.cwd(), 'build'),
);
console.log(`Output path for CSS variables: ${buildPath}`);

const source = [
  path.join(input, 'global/**/*.json'), // lowest priority
  path.join(input, 'components/**/*.json'),
  path.join(input, 'themes', '*.json'), // light.json, dark.json
];

if (process.env.THEME) {
  source.push(path.join(input, 'themes', process.env.THEME, '**/*.json'));
  console.log(`Using theme: ${process.env.THEME}`);
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
        {
          destination: 'variables.css',
          format: 'css/variables',
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
