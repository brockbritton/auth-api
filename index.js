'use strict';

const { start } = require('./src/server.js');
const { db } = require('./src/auth/models');

db.sync().then(() => {
  start(process.env.PORT || 3001);
});
