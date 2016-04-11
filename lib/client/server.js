'use strict';

var path = require('path');
var webpack = require('webpack');
var express = require('express');
var config = require('./webpack.config');
var open = require('open');

var compiler = webpack(config);

module.exports = class Client {
  constructor(datasource) {
    var app = this.app = express();
    this.datasource = datasource;

    app.use(require('webpack-dev-middleware')(compiler, {
      contentBase: 'http://localhost:8080',
      quiet: true,
      noInfo: true,
      hot: true,
      inline: true,
      lazy: false,
      publicPath: config.output.publicPath,
      headers: {'Access-Control-Allow-Origin': '*'},
      stats: {colors: true}
    }));

    app.use(require('webpack-hot-middleware')(compiler));

    app.get('*', function (req, res) {
      res.sendFile(path.join(__dirname, 'app/index.html'));
    });

    //app.listen(8080, 'localhost', function (err, result) {
    //  if (err) {
    //    console.log(err);
    //  }
    //
    //  open('http://localhost:8080/');
    //  console.log('Listening at localhost:8080');
    //});
  }
};
