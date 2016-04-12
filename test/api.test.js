'use strict';

const test = require('tape');
const request = require('supertest');
const Kaptain = require('../');

const Datasource = require('./testing-datasource');

const datastore = {
    table1: [
        {id: 1, name: 'Vinh Dang', gender: 'male'},
        {id: 2, name: 'James Kenaley', gender: 'male'},
        {id: 3, name: 'Tu Duong', gender: 'female'}
    ]
};

test('Should raise error without datasource', t => {
    t.throws(() => {
        let kaptain = new Kaptain({client: false});
    }, 'Should throw an exception');
    t.end();
});

test('should be able to listen/close the api', t => {
    let kaptain = new Kaptain({
        datasource: new Datasource(datastore),
        client: false
    });
    kaptain.listen();
    setTimeout(() => {
        kaptain.close();
        t.error(null, 'No error');
        t.end();
    }, 1000);
});

test("shouldn't redirect without client passed in", t => {
    let kaptain = new Kaptain({
        datasource: new Datasource(datastore),
        client: false
    });
    request(kaptain.listen())
        .get('/')
        .expect(200)
        .end((err, res) => {
            kaptain.close();
            t.error(err, 'No error');
            t.end();
        });
});

test('should return list of tables', t => {
    let kaptain = new Kaptain({
        datasource: new Datasource(datastore),
        client: false
    });
    request(kaptain.listen())
        .get('/api/tables')
        .expect(200)
        .end((err, res) => {
            kaptain.close();
            let data = res.body;
            t.assert(data instanceof Array);
            t.equal(data.length, 1);
            t.equal(data[0], 'table1');
            t.end();
        });
});

test('should return error on invalid table', t => {
    let kaptain = new Kaptain({
        datasource: new Datasource(datastore),
        client: false
    });
    request(kaptain.listen())
        .get('/api/tables/undefined')
        .end((err, res) => {
            kaptain.close();
            t.assert(res.statusCode >= 400);
            t.end();
        });
});

test('should return the table records', t => {
    let kaptain = new Kaptain({
        datasource: new Datasource(datastore),
        client: false
    });
    request(kaptain.listen())
        .get('/api/tables/table1')
        .expect(200)
        .end((err, res) => {
            kaptain.close();
            let data = res.body;
            t.assert(data instanceof Array);
            t.deepEquals(data, [
                {id: 1, name: 'Vinh Dang', gender: 'male'},
                {id: 2, name: 'James Kenaley', gender: 'male'},
                {id: 3, name: 'Tu Duong', gender: 'female'}
            ]);
            t.end();
        });
});

test('should return record with matched id', t => {
    let kaptain = new Kaptain({
        datasource: new Datasource(datastore),
        client: false
    });
    request(kaptain.listen())
        .get('/api/tables/table1/3')
        .expect(200)
        .end((err, res) => {
            kaptain.close();
            let data = res.body;
            t.deepEquals(data, {id: 3, name: 'Tu Duong', gender: 'female'});
            t.end();
        });
});