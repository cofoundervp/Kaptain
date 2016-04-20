'use strict';

const redis = require('promise-redis')(),

client = redis.createClient();

client.on("error", function (err) {
    console.error(err);
});

function setRedisKey(key, userId) {
	return client.set(key.toString(), userId.toString()).then(() => {
		client.expire(key.toString(), 2*60);
	});
}

function getRedisKey(key) {
	return client.get(key.toString());
}

module.exports = {
    getKey: getRedisKey,
    setKey: setRedisKey
};
