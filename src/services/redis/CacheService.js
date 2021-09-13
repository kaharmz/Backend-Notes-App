/* eslint-disable no-underscore-dangle */
const redis = require('redis');

class CacheService {
  constructor() {
    this._client = redis.createClient({
      host: process.env.REDIS_SERVER,
    });
    this._client.on_connect('error', (error) => {
      console.log(error);
    });
  }

  // SET
  set(key, value, expirationInSecond = 3600) {
    return new Promise((resolve, reject) => {
      this._client.set(key, value, 'EX', expirationInSecond, (error, ok) => {
        if (error) {
          return reject(error);
        }
        return resolve(ok);
      });
    });
  }

  // GET
  get(key) {
    return new Promise((resolve, reject) => {
      this._client.get(key, (error, reply) => {
        if (error) {
          return reject(new Error('Cache tidak ditemukan'));
        }
        return resolve(reply.toString());
      });
    });
  }

  // DELETE
  delete(key) {
    return new Promise((resolve, reject) => {
      this._client.del(key, (error, count) => {
        if (error) {
          return reject(error);
        }
        return resolve(count);
      });
    });
  }
}

module.exports = CacheService;
