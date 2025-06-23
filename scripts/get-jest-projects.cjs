const fs = require('fs'); // eslint-disable-line @typescript-eslint/no-require-imports
const path = require('path'); // eslint-disable-line @typescript-eslint/no-require-imports

function findProjects(baseDir) {
  const fullBase = path.resolve(__dirname, '..', baseDir);
  return fs
    .readdirSync(fullBase)
    .filter((name) => {
      const configPath = path.join(fullBase, name, 'jest.config.cjs');
      return fs.existsSync(configPath);
    })
    .map((name) => `${baseDir}/${name}`);
}

const projects = [...findProjects('apps'), ...findProjects('packages')];

const matrix = JSON.stringify({ include: projects.map((p) => ({ path: p })) });
fs.writeFileSync('jest-matrix.json', matrix);
