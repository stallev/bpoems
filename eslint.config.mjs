import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import tseslint from '@typescript-eslint/eslint-plugin';
import importplugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import reactplugin from 'eslint-plugin-react';
import reacthooks from 'eslint-plugin-react-hooks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// TypeScript and React rules from .eslintrc.json
const typescriptReactRules = {
  plugins: {
    '@typescript-eslint': tseslint,
    react: reactplugin,
    'react-hooks': reacthooks,
    import: importplugin,
  },
  rules: {
    // TypeScript rules
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',

    // React rules
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // Import rules
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index'],
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],

    // General rules
    'no-console': [
      'warn',
      {
        allow: ['error'],
      },
    ],
    eqeqeq: 'error',
    'no-unused-expressions': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {},
    },
  },
};

// Prettier integration
const prettierConfig = {
  plugins: {
    prettier: prettier,
  },
  rules: {
    'prettier/prettier': 'error',
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
  },
};

// Files to ignore (replaces .eslintignore)
const ignoresConfig = {
  ignores: [
    // Generated files
    'src/generated/**',
    '.next/**',
    'out/**',
    'build/**',
    'dist/**',

    // Node modules
    'node_modules/**',

    // Environment variables
    '.env',
    '.env.*',
    '!.env.example',

    // Package files
    'package-lock.json',
    'yarn.lock',
    'pnpm-lock.yaml',

    // Prisma
    'prisma/migrations/**',

    // Public directory
    'public/**',

    // Cache directories
    '.turbo',
    '.cache',
    '.swc',

    // Testing
    'coverage/**',
  ],
};

const eslintConfig = [
  ignoresConfig,
  ...compat.extends(
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended'
  ),
  typescriptReactRules,
  prettierConfig,
];

export default eslintConfig;

