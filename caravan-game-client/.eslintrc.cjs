module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  extends: [
    'airbnb',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'airbnb-typescript', // must be below `@typescript-eslint/*`, e.g. for disabling @typescript-eslint/require-await
    'plugin:prettier/recommended',
    'plugin:mobx/recommended',
    'plugin:eslint-comments/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
  plugins: ['react-refresh', '@typescript-eslint', 'react-hooks', 'mobx'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'react/no-danger': 'error',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-key': [
      'error',
      {
        checkFragmentShorthand: true,
      },
    ],
    'react/jsx-no-bind': [
      'error',
      {
        ignoreRefs: true,
        allowArrowFunctions: true,
        allowFunctions: true,
        allowBind: false,
        ignoreDOMComponents: true,
      },
    ],
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/member-ordering': [
      'error',
      { default: ['constructor', 'field', 'method', 'signature'] },
    ],
    'no-console': [
      'error',
      {
        allow: ['info', 'warn', 'error'],
      },
    ],
    'func-names': [
      'error',
      'as-needed',
      {
        generators: 'never',
      },
    ],
    'jsx-a11y/label-has-associated-control': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': [
      'error',
      {
        additionalHooks: 'useDelayedEffect',
      },
    ],
    'consistent-return': 'off',
    'no-underscore-dangle': ['error', { allowAfterThis: true, allow: ['__'] }],
    '@typescript-eslint/no-use-before-define': [
      'error',
      { functions: false, classes: true, variables: true },
    ],
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-ignore': 'allow-with-description',
      },
    ],
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
      },
      {
        selector: 'function',
        format: ['camelCase', 'PascalCase'],
      },
      {
        selector: 'parameter',
        format: ['camelCase', 'PascalCase', 'snake_case'],
        leadingUnderscore: 'allowSingleOrDouble',
      },
      {
        selector: 'method',
        format: ['camelCase'],
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
      {
        selector: 'typeParameter',
        format: ['PascalCase'],
        prefix: ['T'],
      },
    ],
    'mobx/missing-observer': 'off',
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',
    'react/require-default-props': 'off',
    'no-restricted-syntax': [
      'error',
      {
        selector: [
          'CallExpression[callee.name="autorun"] > ArrowFunctionExpression[async="true"]',
          'CallExpression[callee.name="autorun"] > FunctionExpression[async="true"]',
        ].join(', '),
        message: 'autorun() only accepts synchronous functions',
      },
      {
        selector: [
          'MethodDefinition[value.async="true"] Decorator[expression.object.name="action"]',
          'MethodDefinition[value.async="true"] Decorator[expression.name="action"]',
          'PropertyDefinition[value.type="ArrowFunctionExpression"][value.async="true"] Decorator[expression.object.name="action"]',
          'PropertyDefinition[value.type="ArrowFunctionExpression"][value.async="true"] Decorator[expression.name="action"]',
        ].join(', '),
        message: '@action must be synchronous function',
      },
      {
        selector: 'ImportDeclaration[source.value="remeda"] ImportSpecifier',
        message: 'Use "import * as R from \'remeda\';" instead',
      },
    ],
    curly: ['error', 'all'],
    'eslint-comments/disable-enable-pair': ['error', { allowWholeFile: true }],
  },
  settings: {
    'import/resolver': {
      alias: {
        '@model': ['./src/model/*'],
      },
    },
  },
};
