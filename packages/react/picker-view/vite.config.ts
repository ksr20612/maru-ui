import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
  },
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        hook: resolve(__dirname, 'src/hook/index.ts'),
      },
      name: 'MaruUIPickerView',
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'mjs' : 'js'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) return 'picker-view.css';
          return '[name][extname]';
        },
      },
    },
    minify: 'esbuild',
    sourcemap: true,
  },
  plugins: [
    dts({
      entryRoot: resolve(__dirname, 'src'),
      include: ['src/index.ts', 'src/hook/index.ts', 'src/hook/**', 'src/components/**'],
      rollupTypes: true,
    }),
  ],
});
