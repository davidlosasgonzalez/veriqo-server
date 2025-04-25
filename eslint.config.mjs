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

        // Orden de imports profesional.
        'import/order': [
            'error',
            {
                groups: [
                    ['builtin', 'external'],
                    ['internal', 'sibling', 'parent'],
                    'index',
                ],
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true,
                },
            },
        ],

        // Espaciado limpio entre bloques lógicos.
        'padding-line-between-statements': [
            'error',

            // Siempre línea en blanco después de const/let/var.
            {
                blankLine: 'always',
                prev: ['const', 'let', 'var'],
                next: '*',
            },

            // Pero no entre constantes consecutivas ni entre const y for.
            {
                blankLine: 'never',
                prev: ['const', 'let', 'var'],
                next: ['const', 'let', 'var', 'for'],
            },

            // Línea en blanco antes de return, if, for, try.
            {
                blankLine: 'always',
                prev: '*',
                next: ['return', 'if', 'for', 'try'],
            },

            // Después de bloques.
            {
                blankLine: 'always',
                prev: ['block', 'block-like'],
                next: '*',
            },

            // Entre funciones.
            {
                blankLine: 'always',
                prev: 'function',
                next: '*',
            },
            {
                blankLine: 'always',
                prev: '*',
                next: 'function',
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
