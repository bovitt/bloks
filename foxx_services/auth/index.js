'use strict';
const createRouter = require("@arangodb/foxx/router");
const router = createRouter();

const crypto = require("@arangodb/crypto");
const joi = require("joi");
const aql = require("@arangodb").aql;
const db = require("@arangodb").db;

module.context.use(router);

module.context.collection("users").ensureIndex({
    type: "hash",
    unique: true,
    fields: ["username"],
});

const sessions = require("./utils/sessions");
module.context.use(sessions);

const auth = require("./utils/auth");
const users = module.context.collection("users");

if (!users.firstExample({ username: "admin" })) {
    users.save({
        email: "bovitt1@vt.ewsd.org",
        name: "Bradly Ovitt",
        username: "admin",
        password: crypto.sha512("admin222"),
        profile: "https://avatars.dicebear.com/api/avataaars/mkm.svg",
        privilege: "System Admin",
        account_creation_date: Date.now(),
        is_validated: true,
        biography: "System Admin Fucker",
    });
}

router
    .post("/login", function (req, res) {
        const user = users.firstExample({
            username: req.body.username,
        });
        const valid = (user ? user.password : {}) == crypto.sha512(req.body.password);

        if (!valid) res.throw("unauthorized");
        if (!user.is_validated) res.throw("account not validated");

        req.session.uid = user._key;
        req.sessionStorage.save(req.session);
        res.send(
            JSON.stringify({
                username: user.username,
                name: user.name,
                email: user.email,
                profile: user.profile,
                privilege: user.privilege,
                account_creation_date: user.account_creation_date,
                biography: user.biography,
                classes: user.classes,
            })
        );
    })
    .body(
        joi
            .object({
                username: joi.string().required(),
                password: joi.string().required(),
            })
            .required()
    )
    .response(["text/json"], "Basic user information on login")
    .summary("Provides user stored information and authentication.")
    .description("Authenticates the users and provides information about said users.");

router
    .get("/checkusername/:username", function (req, res) {
        const user = users.firstExample({
            username: req.pathParams.username,
        });

        res.send(user ? "{validity: false}" : "{validity: true}");
    })
    .pathParam("username", joi.string().required(), "Username to verify")
    .response(["text/json"], "Username uniqueness check")
    .summary("Checks a username for uniqueness")
    .description("Checks a username for uniqueness");

router
    .post("/signup", function (req, res) {
        const user = users.firstExample({
            username: req.body.username,
        });

        if (user) res.throw("Username is already in use.");

        const email = users.firstExample({
            email: req.body.email,
        });

        if (email) res.throw("An account with your email already exists.");

        users.save({
            email: req.body.email,
            name: req.body.name,
            username: req.body.username,
            password: crypto.sha512(req.body.password),
            profile: req.body.profile,
            privilege: "Mortal",
            account_creation_date: Date.now(),
            is_validated: false,
            biography: `My name is ${req.body.name}.`,
            classes: [],
        });

        res.send("{success: true}");
    })
    .body(
        joi
            .object({
                username: joi.string().required(),
                name: joi.string().required(),
                email: joi.string().required(),
                password: joi.string().required(),
                profile: joi.string().required(),
            })
            .required()
    )
    .response(["text/json"], "Creates a user account.")
    .summary("Creates a user account.")
    .description("Creates a user account.");

const pwd_reset_requests = module.context.collection("pwd_reset_requests");

router
    .post("/forgotpwd", function (req, res) {
        const user = users.firstExample({
            email: req.body.email,
        });

        if (!user) res.throw("No account for this email exists.");

        const reset_nonce = crypto.createNonce();

        pwd_reset_requests.save({
            username: user.username,
            nonce: reset_nonce,
        });

        res.send(`A password reset email has been sent to ${reset_nonce}`);
    })
    .body(
        joi
            .object({
                email: joi.string().required(),
            })
            .required()
    )
    .response(["text/json"], "Forgot Password Functionality")
    .summary("Provides a mechanism to change account password through email.")
    .description("Allows you to reset your password through email in you have forgotten when signing in.");

router
    .post("/resetpwd", function (req, res) {
        const reset_request = pwd_reset_requests.firstExample({
            nonce: req.body.resetnonce,
        });

        const nonce_checked = !crypto.checkAndMarkNonce(req.body.resetnonce);

        if (nonce_checked) res.throw("Invalid reset request.");
        if (!reset_request) res.throw("Invalid reset request.");
        if (req.body.newpwd.includes("\\") || req.body.newpwd.includes("'") || req.body.newpwd.includes('"')) {
            res.throw('Password cannot contain "\\", "\'", or """.');
        }

        const user = users.firstExample({
            username: reset_request.username,
        });

        const reset_query = db._query(aql`
        UPDATE ${user._key} WITH {password: ${req.body.newpwd}} IN auth_users
    `);

        res.send("Password Reset");
    })
    .body(
        joi
            .object({
                resetnonce: joi.string().required(),
                newpwd: joi.string().required(),
            })
            .required()
    )
    .response(["text/json"], "Forgot Reset Functionality")
    .summary("Resets password with forgot password functionality.")
    .description("Takes a password reset nonce and a new password and updates the users password; i.e., the user associated with the nonce.");
