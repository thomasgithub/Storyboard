const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {

  entry: './dev/demo',

  devtool: 'sourcemap',

  resolve: {
    modulesDirectories: ['node_modules', 'src']
  },

  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
      { test: /\.(png|jpg)$/, loader: 'file' },
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
        exclude: /node_modules/
      }
    ]
  },

  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    filename: 'dev.js'
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'dev/index.html',
      inject: false
    })
  ]

}
