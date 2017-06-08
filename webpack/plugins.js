const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = [
  new HtmlWebpackPlugin({
    inject: true,
    template: path.resolve('./demo/index.html')
  }),
  new ExtractTextPlugin({
    filename: 'index.css',
  })
];
