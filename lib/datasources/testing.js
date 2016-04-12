'use strict';

var datastore1 = {
    table1: [
        {id: 1, name: 'Vinh Dang', gender: 'male'},
        {id: 2, name: 'James Kenaley', gender: 'male'},
        {id: 3, name: 'Tu Duong', gender: 'female'}
    ]
};

var datastores = {
    db1: datastore1
};

module.exports = class Testing {
    constructor(uri) {
        let components = uri.split('://');
        if (components.length != 2 || components[0] != 'testing') {
            console.error('Db connection error');
            process.exit(1);
        }
        let db = datastores[components[1]];
        if (!db) {
            console.error('Db connection error');
            process.exit(1);
        }

        this.db = db;
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