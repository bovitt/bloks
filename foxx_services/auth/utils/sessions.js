"use strict";

const sessionsMiddleware = require("@arangodb/foxx/sessions");

const sessions = sessionsMiddleware({
  storage: module.context.collection("sessions"),
  transport: "cookie"
});

module.exports = sessions;
