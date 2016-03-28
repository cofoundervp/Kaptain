'use strict';

/**
 * Modules requirements
 */
const path = require('path');
const Koa = require('koa');

const DATASOURCE_DIR = 'datasources';

class Kaptain {
    constructor(driver, host, database, port, config) {
        let Datasource = require(path.join(__dirname, DATASOURCE_DIR, driver));
        this.datasource = new Datasource(host, database, port, config);
        this.app = new Koa();
    }
}

module.exports = Kaptain;
