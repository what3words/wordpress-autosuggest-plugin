module.exports = {
  extends: [
    'plugin:@wordpress/eslint-plugin/recommended',
    'plugin:prettier/recommended',
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
      },
    },
  },
  rules: {
    'prettier/prettier': 'error',
    'import/no-unresolved': [
      'error',
      {
        ignore: [
          '^@woocommerce/blocks-checkout$',
          '^@woocommerce/block-data$',
          '^@wordpress/',
        ],
      },
    ],
  },
};
