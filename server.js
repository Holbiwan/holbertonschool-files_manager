/**
 * Express Server Setup
 *
 * This file initializes and configures an Express server application.
 * It sets up middleware, routes, and error handling, and starts the server
 * on the specified port.
 */

// Import Express framework for building web applications
const express = require('express');

// Import the router containing API route definitions
const routes = require('./routes');

// Create an instance of an Express application
const app = express();

// Define the port on which the server will listen for requests
// Use the PORT environment variable if available, otherwise default to 5000
const PORT = process.env.PORT || 5000;

// Middleware to parse incoming JSON requests and place the parsed data in req.body
app.use(express.json());

// Use the imported routes for handling requests
app.use(routes);

// Handle 404 errors for any routes that were not matched
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Start the server and listen for incoming connections on the defined port
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
