const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {

  entry: './dev/demo',

  resolve: {
    modulesDirectories: ['node_modules', 'src']
  },

  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
      { test: /\.(png|jpg)$/, loader: 'file' },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css'),
        exclude: /node_modules/
      }
    ]
  },

  output: {
    path: path.resolve(__dirname, '../demo'),
    filename: 'demo-[hash].min.js'
  },

  plugins: [
    new ExtractTextPlugin('styles-[hash].css'),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true,
        warnings: false
      }
    }),
    new HtmlWebpackPlugin({
      template: 'dev/index.html',
      minify: { collapseWhitespace: true },
      inject: false
    })
  ]

}
