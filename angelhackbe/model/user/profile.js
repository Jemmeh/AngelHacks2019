'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const debug = require('debug')('backend:profile');
const createError = require('http-errors');

const profileSchema = mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
  username: {type: String, required: true },
  image: String,
  country: { type: String, uppercase: true },
  createdOn: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
});

const Profile = module.exports = mongoose.model('profile', profileSchema);