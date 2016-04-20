'use strict';
const dotenv = require('dotenv');
const path = require('path');

var rootFolder = path.normalize(__dirname + '/../..');
dotenv.load({
    path: `${rootFolder}/.env`
});

var environment = (process.env.NODE_ENV || 'development').toLowerCase();


module.exports = {
    env: environment,
    mongo: {
        uri: process.env.MONGO_URI || 'localhost/kaptain_db',
    },
    jwt: {
        key: process.env.JWT_KEY || 'Kaptain key',
        algorithm: process.env.JWT_ALG || 'HS256',
        issuer: 'kaptain'
    },
    email: {
        server: process.env.MAIL_HOST,
        user: process.env.MAIL_USER,
        password: process.env.MAIL_PASS,
        domain: process.env.MAIL_DOMAIN,
        address: process.env.MAIL_ADDRESS
    }
};