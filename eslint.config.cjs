const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const prettierPlugin = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');

module.exports = tseslint.config({
    files: ['**/*.ts'],
    extends: [
        eslint.configs.recommended,
        ...tseslint.configs.recommended,
        ...tseslint.configs.stylistic,
        prettierConfig,
    ],
    plugins: {
        prettier: prettierPlugin,
    },
    rules: {
        '@typescript-eslint/no-explicit-any': 'warn',
    },
});
