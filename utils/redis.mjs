// Import the Redis module using ES module syntax
import redis from 'redis';

class RedisClient {
  constructor() {
    // Create a new Redis client
    this.client = redis.createClient();
    this.client.on('error', (error) => console.error(`Redis client error: ${error}`));
  }

  // Check if the Redis client is connected
  isAlive() {
    return this.client.connected;
  }

  // Get a value from Redis
  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, reply) => {
        if (err) reject(err);
        else resolve(reply);
      });
    });
  }

  // Set a value in Redis with an expiration
  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.setex(key, duration, value, (err, reply) => {
        if (err) reject(err);
        else resolve(reply);
      });
    });
  }

  // Delete a key from Redis
  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, reply) => {
        if (err) reject(err);
        else resolve(reply);
      });
    });
  }
}

// Export the RedisClient instance as the default export
export default new RedisClient();
