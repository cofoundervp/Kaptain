'use strict';

const Kaptain = module.exports = require('./lib/kaptain');

if (!module.parent) {
    // NOTE: dotenv will look for .env file in the same directory with it
    // Optionally, we can also import environment variables before starting node app without using dotenv
    require('dotenv').config({silent: true});

    var db_config = {};

    const kaptain = new Kaptain(process.env.DB_DRIVER, process.env.DB_URI, db_config);

    kaptain.listen(process.env.SERVER_PORT || 8080);
}