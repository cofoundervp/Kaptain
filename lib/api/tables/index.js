'use strict';

const Router = require('koa-router');

module.exports = class Tables extends Router {
    constructor(datasource) {
        super();
        this.datasource = datasource;

        this.get('/', (ctx, next) => {
            return this.datasource.tables.then(tables => {
                ctx.response.body = tables;
            });
        });

        let table = new Table(this.datasource);

        this.use('/:tableName', table.routes(), table.allowedMethods());
    }
};

class Table extends Router {
    constructor(datasource) {
        super();
        this.datasource = datasource;

        this.use('/', (ctx, next) => {
            let tableName = ctx.params.tableName;
            return this.datasource.getTable(tableName).then(table => {
                ctx.state.table = table;
                return next();
            });
        })
        .get('/', (ctx, next) => {
            let table = ctx.state.table,
                query = ctx.query;
            return table.find(query).then(data => {
                ctx.response.body = data;
            });
        })
        .get('/:recordId', (ctx, next) => {
            let table = ctx.state.table,
                keys = table.keys;
            if (keys.length != 1) {
                ctx.throw(400, 'Table doesn\'t have a single primary key');
            } else {
                return table.find(ctx.params.recordId).then(data => {
                    if (!data) {
                        ctx.throw(404, 'No record found');
                    }
                    ctx.response.body = data;
                });
            }
        });
    }
}