const express = require("express");
const router = express.Router();
const { redisRateLimiter } = require("../middleware/rateLimiter");

// /**
//  * GETS /
//  **/

router.get("/", redisRateLimiter, async (req, res, next) => {
  try {
    res.send({
      message: "Welcome to the homepage! Try ´/users´ for private routes",
    });
  } catch (error) {
    next(error);
  }
});

// /**
//  * POSTS /
//  **/

router.post("/", redisRateLimiter, async (req, res, next) => {
  // allow access to resources
  try {
    res.send({ message: "Accessed the precious resources!" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
