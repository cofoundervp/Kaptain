'use strict';

/**
 * Modules requirements
 */
const path = require('path');
const Koa = require('koa');
const mount = require('koa-mount');

const Api = require('./api');
const Client = require('./client/server.js');

const DATASOURCE_DIR = 'datasources';

class Kaptain {
    constructor(driver, host, database, port, config) {
        let Datasource = require(path.join(__dirname, DATASOURCE_DIR, driver));
        this.datasource = new Datasource(host, database, port, config);
        this.app = new Koa();

        // api and client sub dirs should export a class that has an `app` property
        let api = new Api(this.datasource),
            client = new Client(this.datasource);

        this.app.use(mount('/api', api.app));

        // Currently, `client` uses express instead of koa...
        let client_middleware = (ctx, next) => {
            // source: https://github.com/koajs/koa/issues/622
            // stop koa future processing (NOTE not sure it is un-doc feature or not?)
            ctx.respond = false;
            // pass req and res to express
            client.app(ctx.req, ctx.res);
        };
        // client_middleware.middleware = true;
        this.app.use(mount('/app', {
            middleware: [client_middleware]
        }));

        // Redirect / to /app
        this.app.use((ctx, next) => {
            if (ctx.path === '/') {
                ctx.redirect('/app');
            } else {
                return next();
            }
        });
    }

    listen(port) {
        port = port || 80;
        this.app.listen(port);
    }
}

module.exports = Kaptain;
