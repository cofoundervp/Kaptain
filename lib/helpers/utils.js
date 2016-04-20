'use strict';

const randomstring = require('randomstring');

function generateRandomToken(length) {
    return randomstring.generate(length);
}

module.exports = {
    generateToken: generateRandomToken
};
