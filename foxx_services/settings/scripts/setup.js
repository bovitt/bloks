'use strict';
const db = require('@arangodb').db;

const users = module.context.collectionName("users");

if (!db._collection(users)) {
  db._createDocumentCollection(users);
}
