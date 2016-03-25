// var path = require('path');
// var webpack = require('webpack');
// var express = require('express');
// var config = require('./webpack.config');

// var app = express();
// var compiler = webpack(config);

// app.use(require('webpack-dev-middleware')(compiler, {
//   noInfo: true,
//   publicPath: config.output.publicPath,
//   historyApiFallback: true
// }));

// app.use(require('webpack-hot-middleware')(compiler));

// app.get('*', function(req, res) {
//   res.sendFile(path.join(__dirname, 'app/index.html'));
// });

// app.listen(8080, 'localhost', function (err, result) {
//   if (err) {
//     console.log(err);
//   }

//   console.log('Listening at localhost:8080');
// });

/*eslint no-console:0 */
'use strict';

require('core-js/fn/object/assign');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');
const open = require('open');

new WebpackDevServer(
  webpack(config), {
    contentBase: './app/',
    historyApiFallback: true,
    hot: true,
    port: 8080,
    publicPath: '/static/',
    noInfo: false,
    stats: { colors: true}
  })
  .listen(8080, 'localhost', (err) => {
    if (err) {
      console.log(err);
    }
    console.log('Listening at localhost:8080');
    console.log('Opening your system browser...');
    open('http://localhost:8080/webpack-dev-server/');
  });
