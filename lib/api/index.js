'use strict';

const Koa = require('koa');
const Router = require('koa-router');

module.exports = class Api {
    /**
     * @constructor Api
     * @param datasource
     */
    constructor(datasource) {
        let api = this;

        this.datasource = datasource;
        this.app = new Koa();

        // Boiler-plate code, move it to separate file when developing
        let router = new Router();
        router.get('/tables', (ctx, next) => {
            ctx.response.body = api.datasource.tables;
        });

        this.app.use(router.routes(), router.allowedMethods());
    }
};