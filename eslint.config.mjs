import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: ['**/*.js', '**/*.cjs', '**/*.mjs'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },

    linterOptions: {
      env: {
        es2021: true,
        node: true,
      },
    },

    plugins: {
      prettier: require('eslint-plugin-prettier'),
      'unused-imports': require('eslint-plugin-unused-imports'),
    },

    extends: ['airbnb-base', 'prettier'],

    rules: {
      'prettier/prettier': 'error',

      // 🔴 Remove imports não usados
      'unused-imports/no-unused-imports': 'error',

      // ⚠️ Remove variáveis não usadas (mas deixa ignorar com "_")
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
]);
