'use strict';

const express = require('express');
const cors = require('cors');
const authRoutes = require('./auth/routes.js');
const server404 = require('../src/error-handlers/404.js');
const server500 = require('../src/error-handlers/500.js');

const v1Routes = require('./routes/v1.js');
const v2Routes = require('./routes/v2.js');

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/auth', authRoutes);
app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);


app.use(server404);
app.use(server500);


module.exports = {
  server: app,
  start: (port) => {
    app.listen(port, () => {
      console.log(`Server Up on ${port}`);
    });
  },
};