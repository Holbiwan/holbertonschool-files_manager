import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import controllerRouting from './routes/index';

/**
 * This project is a summary of back-end concepts:
 * authentication, NodeJS, MongoDB, Redis,
 * pagination and background processing.
 *
 * The objective was to build a simple platform to upload and view files:
 *
 * User authentication via a token
 * List all files
 * Upload a new file
 * Change permission of a file
 * View a file
 * Generate thumbnails for images
 */

const app = express();
const port = process.env.PORT || 5000;

// Middleware for security headers
app.use(helmet());

// Middleware for logging HTTP requests
app.use(morgan('combined'));

// Middleware for CORS
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Route handling
controllerRouting(app);

// Middleware for handling errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
