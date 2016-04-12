'use strict';

const Koa = require('koa');
const Router = require('koa-router');

const Tables = require('./tables');

module.exports = class Api {
    /**
     * @constructor Api
     * @param datasource
     */
    constructor(datasource) {
        let api = this;

        this.datasource = datasource;
        this.app = new Koa();

        this.app.use((ctx, next) => {
            return next().catch(err => {
                ctx.response.status = err.status || 500;
                ctx.response.body = (err.expose ? err.message : null) || 'Internal Server Error';
            });
        });

        let router = new Router();

        let tablesRouter = new Tables(this.datasource);
        router.use('/tables', tablesRouter.routes(), tablesRouter.allowedMethods());

        this.app.use(router.routes(), router.allowedMethods());
    }
};