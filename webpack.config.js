var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var bourbonPath = require('node-bourbon').includePaths;
var neatPaths = require("node-neat").includePaths.map(function(sassPath) {
  return "includePaths[]=" + sassPath;
}).join("&");

module.exports = {
  devtool: 'source-map',
  entry: [
    'webpack-hot-middleware/client?path=http://localhost:8080/__webpack_hmr',
    path.join(__dirname, 'app', 'scripts', 'index.js'),
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/static/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true,
      __DEV__: false
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('app.css')
  ],
  module: {
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        include: path.join(__dirname, '/app'),
        loader: 'eslint-loader'
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel', 'eslint-loader'],
        include: path.join(__dirname, '/app'),
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        include: path.join(__dirname, '/app'),
        loader: ExtractTextPlugin.extract(
          'style-loader',
          'css-loader!sass-loader?includePaths[]=' + bourbonPath + '&' + neatPaths
          )
      },
      {
        test: /\.(png|jpg|gif|woff|woff2)$/,
        loader: 'url-loader?limit=8192',
        include: path.join(__dirname, '/app')
      }
    ]
  },
  progress: true,
  resolve: {
    extensions: ['', '.js', '.jsx','.json'],
    modulesDirectories: [
      'app',
      'node_modules'
    ]
  }
};
