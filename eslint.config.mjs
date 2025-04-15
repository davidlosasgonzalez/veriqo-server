import { fileURLToPath } from 'url';
import path from 'path';
import tsParser from '@typescript-eslint/parser';
import eslintPluginImport from 'eslint-plugin-import';
import globals from 'globals';
import eslintPluginTypescript from '@typescript-eslint/eslint-plugin';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const baseConfig = {
    files: ['**/*.ts'],
    languageOptions: {
        parser: tsParser,
        globals: {
            ...globals.node,
            ...globals.jest,
        },
        ecmaVersion: 2015,
        sourceType: 'module',
        parserOptions: {
            project: [path.join(__dirname, 'tsconfig.json')],
            tsconfigRootDir: __dirname,
        },
    },
    plugins: {
        import: eslintPluginImport,
        '@typescript-eslint': eslintPluginTypescript,
    },
    rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-floating-promises': 'warn',
        '@typescript-eslint/no-unsafe-argument': 'warn',
        'import/order': [
            'error',
            {
                groups: [
                    ['builtin', 'external'],
                    ['internal', 'sibling', 'parent'],
                    'index',
                ],
                alphabetize: { order: 'asc', caseInsensitive: true },
            },
        ],
    },
};

const testOverrides = {
    files: ['tests/**/*.unit-spec.ts'],
    rules: {
        '@typescript-eslint/unbound-method': 'off',
    },
};

export default [baseConfig, testOverrides];
