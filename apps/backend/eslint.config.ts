import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // 1. Global ignores (optional but recommended)
  { ignores: ['dist', 'node_modules', 'build'] },

  // 2. Base JS Recommended
  js.configs.recommended,

  // 3. TS Recommended (This replaces your manual tseslint plugin/extends)
  ...tseslint.configs.recommended,

  // 4. Your custom overrides
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node, // Useful for TypeORM/Backend
      },
      // Essential for TypeORM and ESM
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      semi: ['error', 'always'],
      // Example of a specific TS rule
      '@typescript-eslint/no-explicit-any': 'error',
      // Example: TypeORM often requires decorators
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
    },
  }
);
