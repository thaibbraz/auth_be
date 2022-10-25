var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const { ensureUserLoggedIn } = require("../middleware/guards");
const { redisRateLimiter } = require("../middleware/rateLimiter");

require("dotenv").config();

router.get("/", redisRateLimiter, ensureUserLoggedIn, async (req, res) => {
  res.send({ message: "Here is your Members Only content from the server..." });
});

router.post("/login", redisRateLimiter, async (req, res) => {
  let { username } = req.body;
  let user = { name: username };

  // Create token containing user name
  let token = jwt.sign(user, process.env.SECRET_KEY);

  res.json({ accessToken: token });
});

module.exports = router;
