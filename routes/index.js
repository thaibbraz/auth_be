const express = require("express");
const router = express.Router();
const { redisRateLimiter } = require("../middleware/guards");

// /**
//  * GETS /
//  **/

router.get("/", redisRateLimiter, async (req, res, next) => {
  res.send({
    message: "Welcome to the homepage! Try ´/users´ for private routes",
  });
});

// /**
//  * POSTS /
//  **/

router.post("/", redisRateLimiter, async (req, res, next) => {
  // allow access to resources
  res.send("Accessed the precious resources!");
});

module.exports = router;
