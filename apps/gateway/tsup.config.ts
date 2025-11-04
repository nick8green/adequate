import { defineConfig } from 'tsup';

export default defineConfig({
  bundle: true,
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['cjs'],
  target: 'node24',
  dts: false,
  clean: true,
  sourcemap: true,
  tsconfig: './tsconfig.json',
  esbuildOptions(options) {
    options.alias = {
      '@gateway': './src',
      '@shared': '../../packages/shared/src',
    };
  },
});
