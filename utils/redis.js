/**
 * Redis Client Module
 *
 * This module provides a simple wrapper around the Redis client, offering
 * methods to interact with a Redis database. It includes functionality to
 * check connection status, get, set, and delete keys with asynchronous support.
 */

const redis = require('redis');

// Define a RedisClient class to handle Redis operations
class RedisClient {
  constructor() {
    // Create a new Redis client instance
    this.client = redis.createClient();

    // Handle error events emitted by the Redis client
    this.client.on('error', (error) =>
      console.error(`Redis client error: ${error}`)
    );
  }

  /**
   * Check if the Redis client is connected
   * @returns {boolean} True if the client is connected, false otherwise
   */
  isAlive() {
    return this.client.connected;
  }

  /**
   * Get the value of a key from Redis
   * @param {string} key - The key to retrieve from Redis
   * @returns {Promise<string|null>} A promise that resolves to the value of the key, or null if not found
   */
  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, reply) => {
        if (err) reject(err);
        else resolve(reply);
      });
    });
  }

  /**
   * Set a key-value pair in Redis with an expiration time
   * @param {string} key - The key to set in Redis
   * @param {string} value - The value to set for the key
   * @param {number} duration - The expiration time in seconds
   * @returns {Promise<string>} A promise that resolves to the Redis response
   */
  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.setex(key, duration, value, (err, reply) => {
        if (err) reject(err);
        else resolve(reply);
      });
    });
  }

  /**
   * Delete a key from Redis
   * @param {string} key - The key to delete from Redis
   * @returns {Promise<number>} A promise that resolves to the number of keys removed
   */
  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, reply) => {
        if (err) reject(err);
        else resolve(reply);
      });
    });
  }
}

// Instantiate the RedisClient class
const redisClient = new RedisClient();

// Export the instance for use in other parts of the application
module.exports = redisClient;
