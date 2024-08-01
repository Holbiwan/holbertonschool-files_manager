/**
 * Main Script for Testing Redis Client
 *
 * This script tests the basic functionality of the Redis client, including
 * checking the connection status and performing basic get/set operations.
 */

import redisClient from './utils/redis'; // Import the custom Redis client

(async () => {
  // Check if the Redis client is connected
  console.log(redisClient.isAlive());

  // Attempt to get the value of 'myKey' from Redis
  console.log(await redisClient.get('myKey'));

  // Set 'myKey' in Redis with a value of 12 and expiration of 5 seconds
  await redisClient.set('myKey', 12, 5);

  // Retrieve the value of 'myKey' again
  console.log(await redisClient.get('myKey'));

  // Wait for 10 seconds and check the value of 'myKey' again
  setTimeout(async () => {
    console.log(await redisClient.get('myKey'));
  }, 10000); // Wait for 10,000 milliseconds (10 seconds)
})();

