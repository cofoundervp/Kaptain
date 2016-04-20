"use strict";

const router = require('koa-router')();

const auth = require('../../helpers/passport_auth');
const redis = require('../../helpers/redis');
const speakeasy = require('speakeasy');
const db = require('../../datasources/models');
const mailer = require('../../mailer');

module.exports = router;

router
    .post('1st login', '/login',
        auth.login(),
        ctx => {
            return ctx.state.user.generate1StAuthKey().then(data => {
                return db.users.findById(data.userId)
                .exec()
                .then(user => {
                    if(!user) ctx.throw(404, 'user not found');
                    let token = speakeasy.totp({
                        secret: user.authKey,
                        encoding: 'base32',
                        step: 120
                    });
                    //TODO: {Namcv} Send an email for auth and generate qr code;
                    mailer.sendLoginToken(user.email, {name: user.firstName, token: token});
                    // let otpUrl = 'otpauth://totp/KaptainAuth:' + user.email + '?secret=' + user.authKey + '&period=120&issuer=Kaptain';
                    // let qrImage = 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=' + encodeURIComponent(otpUrl);
                    console.log(token);
                    ctx.body = {
                        key: data.secretKey
                        // qrCode: qrImage
                    }
                })
                .catch(err => {
                    ctx.throw(400, err);
                })
                
            });
        }
    )
    .post('2nd login', '/2falogin',
        ctx => {
            if(!ctx.request.body.key) ctx.throw(400, 'Missing key');
            if(!ctx.request.body.token) ctx.throw(400, 'Missing login token');
            return redis.getKey(ctx.request.body.key.toString()).then(value => {
                if(!value) ctx.throw(400, 'session expired');
                return db.users.findById(value)
                .exec()
                .then(user => {
                    if(!user) ctx.throw(404, 'user not found');
                    let authKey = user.authKey;
                    let verified = speakeasy.totp.verify({
                        secret: authKey,
                        encoding: 'base32',
                        token: ctx.request.body.token,
                        step: 120
                    });
                    console.log(verified);
                    if(verified) {
                        ctx.state.user = user;
                        return ctx.state.user.generateJWT().then(token => {
                            ctx.response.status = 200;
                            ctx.body = {JWT: token};
                        });
                    } else {
                        ctx.response.status = 401;
                    }
                })
                
            })
            .catch(err => {
                ctx.throw(400, err);
            })
        }
    )


