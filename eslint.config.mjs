import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'
import importHelpersPlugin from 'eslint-plugin-import-helpers'
import unicornPlugin from 'eslint-plugin-unicorn'

export default [
  {
    ignores: ['dist', 'node_modules', 'coverage', '**/*.md', 'docker', 'uploads', '.husky'],
  },
  {
    files: ['**/*.{ts,js}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.eslint.json'],
      },
      globals: {
        process: 'readonly',
        console: 'readonly',
        Express: 'readonly',
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.eslint.json',
        },
        node: {
          extensions: ['.js', '.ts'],
        },
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      'import-helpers': importHelpersPlugin,
      unicorn: unicornPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      ...tsPlugin.configs['recommended-requiring-type-checking'].rules,
      ...importPlugin.configs.recommended.rules,
      ...importPlugin.configs.typescript.rules,
      ...unicornPlugin.configs.recommended.rules,

      'arrow-body-style': ['error', 'as-needed'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': 'off',
      'no-useless-catch': 'off',
      'quote-props': ['error', 'as-needed'],
      'sort-imports': 'off',

      'import/consistent-type-specifier-style': ['error', 'prefer-inline'],
      'import/extensions': ['error', 'ignorePackages', { js: 'never', ts: 'never' }],
      'import/no-default-export': 'error',
      'import/no-duplicates': 'warn',
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      'import/prefer-default-export': 'off',

      'import-helpers/order-imports': [
        'warn',
        {
          newlinesBetween: 'always',
          groups: [
            '/node/',
            'module',
            '/^app/',
            '/^infra/',
            '/^services/',
            '/^lib/',
            '/^functions/',
            '/^dtos/',
            '/^helpers/',
            '/^utils/',
            '/^constants/',
            ['parent', 'sibling', 'index'],
          ],
          alphabetize: {
            order: 'asc',
            ignoreCase: true,
          },
        },
      ],

      'padding-line-between-statements': [
        'warn',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: '*', next: 'try' },
        { blankLine: 'always', prev: 'try', next: '*' },
        { blankLine: 'always', prev: '*', next: 'block-like' },
        { blankLine: 'always', prev: 'block-like', next: '*' },
        { blankLine: 'always', prev: '*', next: 'throw' },
      ],

      'unicorn/filename-case': [
        'warn',
        {
          cases: {
            kebabCase: true,
            pascalCase: true,
          },
        },
      ],
      'unicorn/no-null': 'off',
      'unicorn/prevent-abbreviations': [
        'warn',
        {
          replacements: {
            args: false,
            env: false,
            props: false,
            ref: false,
          },
        },
      ],

      '@typescript-eslint/consistent-indexed-object-style': 'warn',
      '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
      '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
      '@typescript-eslint/naming-convention': [
        'warn',
        {
          selector: 'default',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
          filter: { regex: '^_.*$', match: false },
        },
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE'],
          filter: { regex: '^(mailQueue|user_id|user_email)$', match: false },
        },
        {
          selector: 'variable',
          types: ['boolean'],
          format: ['PascalCase'],
          prefix: ['is', 'should', 'has', 'can', 'did', 'will'],
        },
        {
          selector: 'parameter',
          format: ['camelCase', 'snake_case'],
          filter: { regex: '^_.*$', match: false },
        },
        {
          selector: 'interface',
          format: ['PascalCase'],
        },
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        {
          selector: 'objectLiteralProperty',
          format: null,
        },
        {
          selector: 'typeProperty',
          format: null,
        },
        {
          selector: 'memberLike',
          modifiers: ['private'],
          format: ['camelCase'],
          leadingUnderscore: 'forbid',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
    },
  },
  {
    files: ['**/*.js'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      'no-undef': 'off',
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.test.ts', '**/*.spec.tsx', '**/*.test.tsx'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
  {
    files: ['prisma/**'],
    rules: {
      'import/no-default-export': 'off',
    },
  },
]
