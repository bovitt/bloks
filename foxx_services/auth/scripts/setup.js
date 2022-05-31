'use strict';
const db = require('@arangodb').db;

const users = module.context.collectionName("users");

if (!db._collection(users)) {
  db._createDocumentCollection(users);
}

const sessions = module.context.collectionName("sessions");

if (!db._collection(sessions)) {
  db._createDocumentCollection(sessions);
}

const pwd_reset_requests = module.context.collectionName("pwd_reset_requests");

if (!db._collection(pwd_reset_requests)) {
  db._createDocumentCollection(pwd_reset_requests);
}