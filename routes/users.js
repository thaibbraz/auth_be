var express = require("express");
var router = express.Router();

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

module.exports = router;
