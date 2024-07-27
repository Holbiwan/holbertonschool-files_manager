import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = createClient({
      url: 'redis://localhost:6379',
    });

    this.client.on('error', (err) => console.error('Redis Client Error', err));
    this.client.connect().catch(console.error);

    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);
  }

  isAlive() {
    return this.client.isOpen;
  }

  async get(key) {
    return this.getAsync(key);
  }

  async set(key, value, duration) {
    await this.setAsync(key, value, 'EX', duration);
  }

  async del(key) {
    await this.delAsync(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;
