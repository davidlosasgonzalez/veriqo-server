import eslintPluginTypescript from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintPluginImport from 'eslint-plugin-import';
import globals from 'globals';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const baseConfig = {
    files: ['**/*.ts'],
    languageOptions: {
        parser: tsParser,
        parserOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            project: [path.join(__dirname, 'tsconfig.json')],
            tsconfigRootDir: __dirname,
        },
        globals: {
            ...globals.node,
            ...globals.es2021,
        },
    },
    plugins: {
        '@typescript-eslint': eslintPluginTypescript,
        import: eslintPluginImport,
    },
    rules: {
        // TypeScript
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-floating-promises': 'warn',
        '@typescript-eslint/no-unsafe-argument': 'warn',
        '@typescript-eslint/explicit-module-boundary-types': 'off',

        // Import order
        'import/order': [
            'error',
            {
                groups: [
                    'builtin',
                    'external',
                    'internal',
                    'parent',
                    'sibling',
                    'index',
                ],
                'newlines-between': 'always',
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true,
                },
            },
        ],
        'import/newline-after-import': ['error', { count: 1 }],

        // Logical spacing
        'padding-line-between-statements': [
            'error',
            {
                blankLine: 'always',
                prev: '*',
                next: ['return', 'if', 'for', 'try'],
            },
            { blankLine: 'always', prev: ['block', 'block-like'], next: '*' },
            { blankLine: 'always', prev: 'function', next: '*' },
            { blankLine: 'always', prev: '*', next: 'function' },
        ],
    },
};

export default [baseConfig];
