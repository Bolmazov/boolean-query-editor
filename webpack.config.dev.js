const path = require('path');
const webpack = require('webpack');

const resolve = require('./webpack/resolve');
const rules = require('./webpack/rules');

module.exports = {
  devtool: 'cheap-module-source-map',

  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './demo/src/index.js'
  ],

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
  },

  devServer: {
    hot: true,
    contentBase: path.resolve(__dirname, 'build'),
    publicPath: '/',
    port: 3000,
  },

  resolve,

  module: {
    rules: [
      ...rules, {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};
