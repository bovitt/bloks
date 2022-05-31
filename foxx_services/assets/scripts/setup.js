'use strict';
const db = require('@arangodb').db;

const connections = module.context.collectionName("connections");

if (!db._collection(connections)) {
  db._createDocumentCollection(connections);
}
