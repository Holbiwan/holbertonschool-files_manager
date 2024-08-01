/**
 * Main Script for Testing MongoDB Client
 *
 * This script tests the connection and functionality of the MongoDB client.
 * It checks the connection status and retrieves counts of users and files.
 */

import dbClient from './utils/db'; // Import the custom MongoDB client

/**
 * Function to wait for MongoDB connection
 *
 * This function attempts to establish a connection to MongoDB by repeatedly
 * checking the connection status every second. It resolves when the connection
 * is successful and rejects after 10 failed attempts.
 *
 * @returns {Promise<void>} A promise that resolves when the connection is
 * established or rejects if it fails after 10 attempts.
 */
const waitConnection = () =>
  new Promise((resolve, reject) => {
    let i = 0; // Initialize attempt counter

    // Function to repeat the connection check
    const repeatFct = async () => {
      // Wait for 1 second before checking the connection again
      await setTimeout(() => {
        i += 1; // Increment attempt counter

        // Reject promise if 10 attempts are reached without connection
        if (i >= 10) {
          reject();
        } else if (!dbClient.isAlive()) {
          // Check if MongoDB is not connected
          repeatFct(); // Retry connection check
        } else {
          resolve(); // Resolve promise if connection is successful
        }
      }, 1000); // Wait for 1000 milliseconds (1 second)
    };

    repeatFct(); // Initial call to repeatFct to start the connection check loop
  });

// IIFE to test MongoDB client functionality
(async () => {
  // Check if the MongoDB client is connected
  console.log(dbClient.isAlive());

  // Wait for MongoDB connection to be established
  await waitConnection();

  // Confirm the MongoDB client is now connected
  console.log(dbClient.isAlive());

  // Retrieve and log the number of users in the database
  console.log(await dbClient.nbUsers());

  // Retrieve and log the number of files in the database
  console.log(await dbClient.nbFiles());
})();

