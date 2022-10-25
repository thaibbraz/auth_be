const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { getToken } = require("./helpers");

/**
 * Guards are the middleware to "protet" routes.
 **/

/**
 * Make sure the user is logged in
 **/

function ensureUserLoggedIn(req, res, next) {
  let token = getToken(req);
  if (token == null) return res.sendStatus(401);

  try {
    // Throws error on invalid/missing token
    jwt.verify(token, SECRET_KEY);
    // If we get here, a valid token was passed
    next();
  } catch (err) {
    res.status(401).send({ error: "Unauthorized" });
  }
}

module.exports = {
  ensureUserLoggedIn,
};
