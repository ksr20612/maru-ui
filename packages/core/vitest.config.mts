import baseConfig from '@maru-ui/config-vitest/vitest.base.mjs';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  ...baseConfig,
  test: {
    ...baseConfig.test,
  },
});
