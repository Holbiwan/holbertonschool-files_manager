const redis = require('redis');

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.client.on('error', (error) => console.error(`Redis client error: ${error}`));
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    return this.handleRedisOperation('get', key);
  }

  async set(key, value, duration) {
    return this.handleRedisOperation('setex', key, duration, value);
  }

  async del(key) {
    return this.handleRedisOperation('del', key);
  }

  handleRedisOperation(method, ...args) {
    return new Promise((resolve, reject) => {
      this.client[method](...args, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
