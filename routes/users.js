var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const { ensureUserLoggedIn } = require("../middleware/guards");
require("dotenv").config();

// Example:

router.get("/", ensureUserLoggedIn, (req, res) => {
  res.send({ message: "Here is your Members Only content from the server..." });
});

router.post("/login", (req, res) => {
  let { username } = req.body;
  let user = { name: username };

  // Create token containing user name
  let token = jwt.sign(user, process.env.SECRET_KEY);

  res.json({ accessToken: token });
});

module.exports = router;
