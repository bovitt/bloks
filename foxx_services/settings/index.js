'use strict';
const createRouter = require('@arangodb/foxx/router');
const router = createRouter();

const crypto = require('@arangodb/crypto')
const joi = require("joi");
const aql = require('@arangodb').aql;
const db = require('@arangodb').db;

module.context.use(router);

const users = module.context.dependencies.auth.users;

router
    .post("/update/username/", function (req, res) {
        const user = users.firstExample({
            username: req.body.username,
        });

        const valid = (user ? user.password : {}) == crypto.sha512(req.body.password);

        if (!valid) {
            res.throw("unauthorized");
        } else {
            if (!user.is_validated) res.throw("account not validated");
            if (req.body.newusername.includes("\\") || req.body.newusername.includes("'") || req.body.newusername.includes('"')) {
                res.throw('Username cannot contain "\\", "\'", or """.');
            }

            const update_query = db._query(aql`
            UPDATE ${user._key} WITH {username: ${req.body.newusername}} IN auth_users
            `);
        }

        res.send("updated: true");
    })
    .body(
        joi
            .object({
                username: joi.string().required(),
                password: joi.string().required(),
                newusername: joi.string().required(),
            })
            .required()
    )
    .response(["text/json"], "Updates a users username.")
    .summary("Takes in a username and credentials to create the new username.")
    .description("Takes in a username and credentials to create the new username. Invalidates previous password reset nonces.");

router
    .post("/update/name/", function (req, res) {
        const user = users.firstExample({
            username: req.body.username,
        });

        const valid = (user ? user.password : {}) == crypto.sha512(req.body.password);

        if (!valid) {
            res.throw("unauthorized");
        } else {
            if (!user.is_validated) res.throw("account not validated");
            if (req.body.newname.includes("\\") || req.body.newname.includes("'") || req.body.newname.includes('"')) {
                res.throw('Username cannot contain "\\", "\'", or """.');
            }

            const update_query = db._query(aql`
            UPDATE ${user._key} WITH {name: ${req.body.newusername}} IN auth_users
            `);
        }

        res.send("updated: true");
    })
    .body(
        joi
            .object({
                username: joi.string().required(),
                password: joi.string().required(),
                newname: joi.string().required(),
            })
            .required()
    )
    .response(["text/json"], "Updates a users name.")
    .summary("Takes in a username and credentials to create the new name.")
    .description("Takes in a username and credentials to create the new name.");

router
    .post("/update/profile/", function (req, res) {
        const user = users.firstExample({
            username: req.body.username,
        });

        const valid = (user ? user.password : {}) == crypto.sha512(req.body.password);

        if (!valid) {
            res.throw("unauthorized");
        } else {
            if (!user.is_validated) res.throw("account not validated");
            if (req.body.profile.includes("\\") || req.body.profile.includes("'") || req.body.profile.includes('"')) {
                res.throw('Username cannot contain "\\", "\'", or """.');
            }

            const update_query = db._query(aql`
            UPDATE ${user._key} WITH {profile: ${req.body.profile}} IN auth_users
            `);
        }

        res.send("updated: true");
    })
    .body(
        joi
            .object({
                username: joi.string().required(),
                password: joi.string().required(),
                profile: joi.string().required(),
            })
            .required()
    )
    .response(["text/json"], "Updates a users profile.")
    .summary("Takes in a username and credentials to add a new profile.")
    .description("Takes in a username and credentials to add a new profile image.");

router
    .post("/update/privilege/", function (req, res) {
        const adminuser = users.firstExample({
            username: req.body.adminusername,
        });

        const valid = (adminuser ? adminuser.password : {}) == crypto.sha512(req.body.adminpassword);

        if (!valid) {
            res.throw("unauthorized");
        } else {
            if (!adminuser.is_validated) res.throw("account not validated");
            if (req.body.newprivilege.includes("\\") || req.body.newprivilege.includes("'") || req.body.newprivilege.includes('"')) {
                res.throw('Username cannot contain "\\", "\'", or """.');
            }

            if (adminuser.privilege == "System Admin") {
                const user = users.firstExample({
                    username: req.body.username,
                });

                if (user) {
                    const update_query = db._query(aql`
                    UPDATE ${user._key} WITH {privilege: ${req.body.newprivilege}} IN auth_users
                    `);

                    res.send("updated: true");
                } else {
                    res.throw("User not found.");
                }
            } else {
                res.send("You must be system admin to use this endpoint.")
            }
        }

    })
    .body(
        joi
            .object({
                adminusername: joi.string().required(),
                adminpassword: joi.string().required(),
                username: joi.string().required(),
                newprivilege: joi.string().required(),
            })
            .required()
    )
    .response(["text/json"], "Updates a users privilege.")
    .summary("Takes in a username and credentials to add a new privilege.")
    .description("Takes in a username and credentials to add a new privilege.");

router
    .post("/update/biography/", function (req, res) {
        const user = users.firstExample({
            username: req.body.username,
        });

        const valid = (user ? user.password : {}) == crypto.sha512(req.body.password);

        if (!valid) {
            res.throw("unauthorized");
        } else {
            if (!user.is_validated) res.throw("account not validated");
            if (req.body.biography.includes("\\") || req.body.biography.includes("'") || req.body.biography.includes('"')) {
                res.throw('Username cannot contain "\\", "\'", or """.');
            }

            const update_query = db._query(aql`
            UPDATE ${user._key} WITH {biography: ${req.body.biography}} IN auth_users
            `);
        }

        res.send("updated: true");
    })
    .body(
        joi
            .object({
                username: joi.string().required(),
                password: joi.string().required(),
                biography: joi.string().required(),
            })
            .required()
    )
    .response(["text/json"], "Updates a users profile.")
    .summary("Takes in a username and credentials to add a new profile.")
    .description("Takes in a username and credentials to add a new profile image.");