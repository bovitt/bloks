'use strict';
const createRouter = require('@arangodb/foxx/router');
const router = createRouter();

const crypto = require('@arangodb/crypto')
const joi = require("joi");
const aql = require('@arangodb').aql;
const db = require('@arangodb').db;

module.context.use(router);

