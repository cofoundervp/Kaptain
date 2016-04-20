'use strict';

const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const utils = require('../../helpers/utils');
const sessions = require('./sessions');
const config = require('../../config');
const redis = require('../../helpers/redis');
    
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        index: {unique: true}
    },
    encryptedPassword: {
        type: String,
        required: false
    },
    salt: {
        type: String,
        required: false
    },
    firstName: String,
    lastName: String,
    status: String,
    authKey: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
userSchema.index({firstName: 'text', lastName: 'text'});


userSchema.virtual('username').get(function() {
    return this.email;
});

userSchema.statics.findByEmail = function(email, callback) {
    if (email) {
        email = email.toLowerCase();
    }
    return this.findOne({email: email}, callback);
};


userSchema.methods.generateSalt = function() {
    return crypto.randomBytes(64).toString('hex');
};
userSchema.methods.setPassword = function(password) {
    if (!this.salt) {
        this.salt = this.generateSalt();
    }
    this.encryptedPassword = this.encryptPassword(password);
};
userSchema.methods.checkPassword = function(password) {
    return this.encryptedPassword === this.encryptPassword(password);
};
userSchema.methods.encryptPassword = function (password) {
    return crypto.pbkdf2Sync(password, this.salt, 100000, 512, 'sha512').toString('hex');
};
userSchema.methods.generateJWT = function() {
    var sessionKey = utils.generateToken(64);
    var session = new sessions({_id: sessionKey, user: this});
    return session.save().then(() => {
        return new Promise((resolve, reject) => {
            jwt.sign({scopes: ['all'], jti: sessionKey}, config.jwt.key, {
                subject: this._id,
                jwtid: sessionKey,
                issuer: config.jwt.issuer,
                algorithm: config.jwt.algorithm
            }, token => {
                resolve(token);
            });
        });
    });
};
userSchema.methods.generate1StAuthKey = function() {
    var userId = this._id;
    var secretKey = utils.generateToken(32);
    return redis.setKey(secretKey, userId).then(() => {
        return {
            secretKey: secretKey,
            userId: userId
        };
    });
};


/**
 * @class
 * @type {Model<T>}
 */
const users = mongoose.model('User', userSchema);

module.exports = users;
