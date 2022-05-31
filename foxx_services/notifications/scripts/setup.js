'use strict';
const db = require('@arangodb').db;

const notifications = module.context.collectionName("notifications");

if (!db._collection(notifications)) {
  db._createDocumentCollection(notifications);
}
