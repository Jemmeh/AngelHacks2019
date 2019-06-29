'use strict';

require('dotenv').config();
const express = require('express');
const debug = require('debug')('backend:server');
const mongoose = require('mongoose');

const allRoutes = require('./routes/allRoutes.js');

const app = express();
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI, { useCreateIndex: true, useNewUrlParser: true, useFindAndModify: false });

app.use(allRoutes);

const server = module.exports = app.listen(PORT, () => {
  debug(`backend is running on: ${PORT}`);
});

server.isRunning = true;
