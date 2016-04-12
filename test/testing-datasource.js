'use strict';

module.exports = class Testing {
    constructor(data) {
        this.db = data;
    }

    get tables() {
        return Promise.resolve(Object.keys(this.db));
    }

    getTable(name) {
        let table = this.db[name];
        if (table) return Promise.resolve(new Table(table));
        else return Promise.reject('Table not found');
    }
};

class Table {
    constructor(source) {
        this.source = source;
    }

    get records() {
        return Promise.resolve(this.source);
    }

    get keys() {
        return ['id'];
    }

    find(query) {
        if (query === null || query === undefined) {
            query = {};
        }
        if (typeof query == 'object') {
            if (Object.keys(query).length == 0) {
                return this.records;
            } else {
                return Promise.reject('Unsupported action');
            }
        } else {
            let id = parseInt(query, 10);
            let data = this.source.filter(record => record.id == id);
            if (data) return Promise.resolve(data[0]);
            else return Promise.resolve(null);
        }
    }
}