'use strict';

const Kaptain = module.exports = require('./lib/kaptain');

if (!module.parent) {
    console.log('Running as independent module. Starting Kaptain...');
    // NOTE: dotenv will look for .env file in the same directory with it
    // Optionally, we can also import environment variables before starting node app without using dotenv
    require('dotenv').config({silent: true});

    var config = {
        client: true // use built-in kaptain UI
    };

    const kaptain = new Kaptain(process.env.DB_URI, config);

    kaptain.listen(process.env.SERVER_PORT || 8080, function() {
        var server = this;
        var port = server.address().port;
        console.log('Listening on port %s', port);
    });
}