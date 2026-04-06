'use strict';
const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  {
    ...js.configs.recommended,
    files: ['angular-typeahead.js', 'test/angular-typeahead.spec.js'],
    languageOptions: {
      ecmaVersion: 5,
      sourceType: 'script',
      globals: {
        ...globals.browser,
        angular: 'readonly',
        jasmine: 'readonly',
        describe: 'readonly',
        xdescribe: 'readonly',
        before: 'readonly',
        beforeEach: 'readonly',
        after: 'readonly',
        afterEach: 'readonly',
        it: 'readonly',
        xit: 'readonly',
        expect: 'readonly',
        spyOn: 'readonly',
        fail: 'readonly',
      },
    },
    rules: {
      'no-undef': 'error',
      'no-unused-vars': ['error', { caughtErrorsIgnorePattern: '^_' }],
      'eqeqeq': ['error', 'always', { null: 'ignore' }],
      'strict': ['error', 'global'],
    },
  },
];
