import copy from 'esbuild-plugin-copy';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['cjs'],
  target: 'node24',
  dts: true,
  clean: true,
  sourcemap: true,
  tsconfig: './tsconfig.json',
  esbuildPlugins: [
    copy({
      assets: [
        {
          from: ['./src/graph/*'],
          to: ['./graph/'],
        },
      ],
    }),
  ],
});
