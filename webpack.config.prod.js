const path = require('path');
const url = require('url');
const webpack = require('webpack');

const pkg = require('./package.json');
const resolve = require('./webpack/resolve');
const rules = require('./webpack/rules');
const plugins = require('./webpack/plugins');

const publicPath = url.parse(pkg.homepage).pathname;

module.exports = {
  devtool: 'source-map',

  entry: [
    './demo/src/index.js'
  ],

  output: {
    publicPath,
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
  },

  resolve,

  module: {
    rules: [
      ...rules, {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
          }]
        })
      }
    ],
  },

  plugins: [
    ...plugins,
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],
};
