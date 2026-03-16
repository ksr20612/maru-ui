import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { glob } from 'glob';

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
  },
  build: {
    lib: {
      entry: glob.sync(resolve(__dirname, 'src/**/*.ts'), {
        ignore: ['node_modules/**', 'dist/**', '**/*.test.ts', '**/*.spec.ts'],
      }),
      name: 'MaruUIReactHooks',
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'mjs' : 'js'}`,
    },
    rollupOptions: {
      external: ['react'],
      output: {
        globals: {
          react: 'React',
        },
      },
    },
    minify: 'esbuild',
    sourcemap: true,
  },
  plugins: [
    dts({
      entryRoot: resolve(__dirname, 'src'),
      include: ['src/index.ts', 'src/**/*'],
      rollupTypes: true,
    }),
  ],
});
