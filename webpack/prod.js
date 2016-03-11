var path = require('path')
var webpack = require('webpack')

module.exports = {

  entry: './src/storyboard',

  resolve: {
    modulesDirectories: ['node_modules', 'src']
  },

  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel', exclude: /node_modules/ }
    ]
  },

  output: {
    libraryTarget: 'umd',
    library: 'Storyboard',
    umdNamedDefine: true,
    path: path.resolve(__dirname, '../dist'),
    filename: 'storyboard.min.js'
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true,
        warnings: false
      }
    })
  ]

}
