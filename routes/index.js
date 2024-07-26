/* eslint-disable */
import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';

const router = (app) => {
  const paths = express.Router();
  app.use(express.json());
  app.use('/', paths);

  paths.get('/status', AppController.getStatus);
  paths.get('/stats', AppController.getStats);
  paths.post('/users', UsersController.postNew);
  paths.get('/connect', AuthController.getConnect);
  paths.get('/disconnect', AuthController.getDisconnect);
  paths.get('/users/me', UsersController.getMe);
  paths.post('/files', FilesController.postUpload);
  paths.get('/files/:id', FilesController.getShow);
  paths.get('/files', FilesController.getIndex);
  paths.put('/files/:id/publish', FilesController.putPublish);
  paths.put('/files/:id/unpublish', FilesController.putUnpublish);
  paths.get('/files/:id/data', FilesController.getFile);
};

export default router;
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';

/* eslint-disable */
const express = require('express');

const router = (app) => {
  const paths = express.Router();
  app.use(express.json());
  app.use('/', paths);

  paths.get('/status', (request, response) =>
    AppController.getStatus(request, response)
  );
  paths.get('/stats', (request, response) =>
    AppController.getStats(request, response)
  );
  paths.post('/users', (request, response) =>
    UsersController.postNew(request, response)
  );
  paths.get('/connect', (request, response) =>
    AuthController.getConnect(request, response)
  );
  paths.get('/disconnect', (request, response) =>
    AuthController.getDisconnect(request, response)
  );
  paths.get('/users/me', (request, response) =>
    UsersController.getMe(request, response)
  );
  paths.post('/files', (request, response) =>
    FilesController.postUpload(request, response)
  );
  paths.get('/files/:id', (request, response) =>
    FilesController.getShow(request, response)
  );
  paths.get('/files', (request, response) =>
    FilesController.getIndex(request, response)
  );
  paths.put('/files/:id/publish', (request, response) =>
    FilesController.putPublish(request, response)
  );
  paths.put('/files/:id/unpublish', (request, response) =>
    FilesController.putUnpublish(request, response)
  );
  paths.get('/files/:id/data', (request, response) =>
    FilesController.getFile(request, response)
  );
};

module.exports = router;