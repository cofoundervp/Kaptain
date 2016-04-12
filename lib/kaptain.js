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
    constructor(db_uri, config) {
        if (!config) {
            config = db_uri;
            db_uri = config['db_uri'];
        }

        let datasource;
        if (config.datasource) {
            datasource = config.datasource;
        } else if (db_uri) {
            let driver = db_uri.split('://')[0];
            let Datasource = require(path.join(__dirname, DATASOURCE_DIR, driver));
            datasource = new Datasource(db_uri, config);
        }

        if (!datasource) {
            throw new Error('No datasource specified');
        }

        this.datasource = datasource;
        this.app = new Koa();

        // api and client sub dirs should export a class that has an `app` property
        let api = new Api(this.datasource);


        this.app.use(mount('/api', api.app));

        if (config.client) {
            if (config.client === true) { // Use built-in ui
                let client = new Client(this.datasource);
                let client_middleware = (ctx, next) => {
                    // Currently, `client` uses express instead of koa...
                    // source: https://github.com/koajs/koa/issues/622
                    // stop koa future processing (NOTE not sure it is un-doc feature or not?)
                    ctx.respond = false;
                    // pass req and res to express
                    client.app(ctx.req, ctx.res);
                };
                this.app.use(mount('/app', {
                    middleware: [client_middleware]
                }));
            } else {
                // Otherwise, config.client is a koa app
                this.app.use(mount('/app', config.client));
            }

            // Redirect / to /app
            this.app.use((ctx, next) => {
                if (ctx.path === '/') {
                    ctx.redirect('/app');
                } else {
                    return next();
                }
            });
        } else {
            this.app.use((ctx, next) => {
                if (ctx.path === '/') {
                    ctx.response.body = '<h1>Welcome to Kaptain</h1>';
                } else {
                    return next();
                }
            });
        }
    }

    listen(port, cb) {
        this.server = this.app.listen(port, cb);
        return this.server;
    }

    close() {
        this.server.close();
    }
}

module.exports = Kaptain;
