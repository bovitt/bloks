'use strict';
const db = require('@arangodb').db;

const messages = module.context.collectionName("messages");

if (!db._collection(messages)) {
  db._createDocumentCollection(messages);
}
