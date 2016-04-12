'use strict';

const mongodb = require('mongodb');
const ObjectID = mongodb.ObjectID;
const MongoClient = mongodb.MongoClient;

module.exports = class Mongodb {
    constructor(uri, config) {
        let client = this;
        MongoClient.connect(uri, (error, _db) => {
            if (error) {
                console.error('Db connection error', error);
                process.exit(1);
            } else {
                console.info('Db connected');
                client.db = _db;
                client.adminDb = _db.admin();

                //client.db.listCollections().toArray((err, collections) => {
                //    if (err) {
                //        console.error('Db tables fetching error', err);
                //        process.exit(1);
                //    } else {
                //        client._tables = collections.reduce((obj, collection) => {
                //            let name = collection.name;
                //            obj[name] = new Table(client.db, name);
                //            return obj;
                //        }, Object.create(null));
                //    }
                //});
            }
        });
        // TODO: Finish constructor
    }

    get tables() {
        //return this._tables;
        return new Promise((resolve, reject) => {
            this.db.listCollections().toArray((err, collections) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(collections.map(c => c.name));
                }
            });
        });
    }

    getTable(name) {
        let table = new Table(this.db, name);
        return table._promise;
    }
};

class Table {
    constructor(db, name) {
        this.db = db;
        this.name = name;
        this._promise = new Promise((resolve, reject) => {
            this.db.collection(name, (error, collection) => {
                if (error) {
                    this.error = error;
                    reject(error);
                } else {
                    this.collection = collection;
                    resolve(this);
                }
            });
        });
    }

    get records() {
        return new Promise((resolve, reject) => {
            if (this.error) {
                reject(this.error);
            } else {
                this.collection.find().toArray((err, data) => {
                    if (err) reject(err);
                    else {
                        resolve(data);
                    }
                });
            }
        });
    }

    get keys() {
        return ['_id'];
    }

    find(query) {
        if (this.error) return Promise.reject(this.error);
        console.log('find query:', query);
        if (query === null || query === undefined) {
            return this.records;
        } else if (typeof query != 'object') {
            // Search on primary key
            // Barf out if table has composite keys -- not the case for mongodb

            // Attempt to convert query to ObjectID if it's a valid one
            if (typeof query == 'string' && ObjectID.isValid(query)) {
                query = new ObjectID(query);
            }
            return this.collection.findOne({_id: query});
        } else {
            return this.collection.find(query).toArray();
        }
    }
}