/**
 * Application Router Setup
 *
 * This file defines all the API routes for the application using Express.js.
 * It connects endpoints to their corresponding controller methods.
 */

const express = require('express');
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');
const AuthController = require('../controllers/AuthController');
const FilesController = require('../controllers/FilesController');

// Create a new router instance
const router = express.Router();

// Route to get the status of Redis and MongoDB services
router.get('/status', AppController.getStatus);

// Route to get statistics about the number of users and files
router.get('/stats', AppController.getStats);

// Route to create a new user
router.post('/users', UsersController.postNew);

// Route to authenticate a user and create a session
router.get('/connect', AuthController.getConnect);

// Route to disconnect a user and terminate their session
router.get('/disconnect', AuthController.getDisconnect);

// Route to get information about the current authenticated user
router.get('/users/me', UsersController.getMe);

// Route to upload a new file
router.post('/files', FilesController.postUpload);

// Route to get information about a specific file by ID
router.get('/files/:id', FilesController.getShow);

// Route to list all files
router.get('/files', FilesController.getIndex);

// Route to publish a file, making it public
router.put('/files/:id/publish', FilesController.putPublish);

// Route to unpublish a file, making it private
router.put('/files/:id/unpublish', FilesController.putUnpublish);

// Route to download the file content by ID
router.get('/files/:id/data', FilesController.getFile);

// Route to get the publish state of a file (possibly redundant)
router.get('/files/:id/publish', FilesController.getFile);

// Export the router to be used in server.js
module.exports = router;
