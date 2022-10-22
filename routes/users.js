var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
// Example:

let posts = [
  {
    username: "User 1",
    title: "Post 1",
  },
  {
    username: "User 2",
    title: "Post 2",
  },
];

/**
 * Get all users
 **/

router.get("/posts", (req, res) => {
  res.json(posts);
});

router.get("/login", (req, res) => {
  let { username, password } = req.body;
  let user = { name: username };

  // Create token containing user name
  let token = jwt.sign(user, process.env.SECRET_KEY);
  res.json({ accessToken: token });
});

module.exports = router;
