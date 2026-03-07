import maruEslint from '@maru-ui/config-eslint';

export default [
  { ignores: ['**/node_modules/**', '**/dist/**', '**/.turbo/**', '**/coverage/**'] },
  ...maruEslint.configs.typescript,
];
