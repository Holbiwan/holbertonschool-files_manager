// File: server.js

import express from 'express';
import routes from './routes/index';

const app = express();
const PORT = process.env.PORT || 5000;

// Use the routes from the routes/index.js file
app.use(routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
