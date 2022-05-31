'use strict';
const db = require('@arangodb').db;

const scripts = module.context.collectionName("scripts");

if (!db._collection(scripts)) {
  db._createDocumentCollection(scripts);
}
