const path = require('path');
const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const WooCommerceDependencyExtractionWebpackPlugin = require('@woocommerce/dependency-extraction-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const defaultRules = defaultConfig.module.rules.filter((rule) => {
  return String(rule.test) !== String(/\.(sc|sa)ss$/);
});

module.exports = {
  ...defaultConfig,
  entry: {
    'w3w-autosuggest-blocks-edit': path.resolve(__dirname, 'src', 'edit.js'),
    'w3w-autosuggest-blocks-frontend': path.resolve(
      __dirname,
      'src',
      'frontend.js'
    ),
    'w3w-autosuggest-order-confirmed': path.resolve(
      __dirname,
      'src',
      'order-confirmed.js'
    ),
  },
  output: {
    path: path.resolve(__dirname, '../w3w-autosuggest/public/blocks'),
    filename: '[name].js',
  },
  module: {
    ...defaultConfig.module,
    rules: [
      ...defaultRules,
      {
        test: /\.(sc|sa)ss$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { importLoaders: 1 } },
          { loader: 'sass-loader' },
        ],
      },
    ],
  },
  plugins: [
    // Filter out WordPress's default DependencyExtractionWebpackPlugin
    // since we're using WooCommerce's version instead
    ...defaultConfig.plugins.filter(
      (plugin) =>
        plugin.constructor.name !== 'DependencyExtractionWebpackPlugin'
    ),
    new WooCommerceDependencyExtractionWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: `[name].css`,
    }),
  ],
};
