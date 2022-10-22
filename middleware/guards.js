const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/**
 * Guards are the middleware to "protect" routes.
 **/

/**
 * Make sure the user is logged in
 **/

function ensureUserLoggedIn(req, res, next) {
  let token = _getToken(req);

  try {
    // Throws error on invalid/missing token
    jwt.verify(token, SECRET_KEY);
    // If we get here, a valid token was passed
    next();
  } catch (err) {
    res.status(401).send({ error: "Unauthorized" });
  }
}
