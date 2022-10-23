const express = require("express");
const router = express.Router();
const { ensureUserLoggedIn } = require("../middleware/guards");

// /**
//  * GETS /
//  **/

router.get("/", function (req, res, next) {
  res.send({ message: "Welcome to the homepage! Try /users" });
});

// /**
//  * POSTS /
//  **/

// Connect with Redis client
const redis = require("ioredis");
const client = redis.createClient({
  port: process.env.REDIS_PORT || 6379,
  host: process.env.REDIS_HOST || "localhost",
});
client.on("connect", function () {
  console.log("connected");
});

router.post("/", async (req, res) => {
  async function isOverLimit(ip) {
    let res;
    try {
      // increment number of requests
      res = await client.incr(ip);
    } catch (err) {
      console.error("isOverLimit: could not increment key");
      throw err;
    }
    console.log(`${ip} has value: ${res}`);
    if (res > 10) {
      return true;
    }
    client.expire(ip, 10);
  }
  // check rate limit
  let overLimit = await isOverLimit(req.ip);

  if (overLimit) {
    res.status(429).send("Too many requests - try again later");
    return;
  }
  // allow access to resources
  res.send("Accessed the precious resources!");
});

module.exports = router;
