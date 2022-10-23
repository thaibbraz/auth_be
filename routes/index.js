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
  // async function isOverLimit(ip) {
  //   let ipRes;
  //   try {
  //     // increment number of requests
  //     ipRes = await client.incr(ip);
  //   } catch (err) {
  //     console.error("isOverLimit: could not increment key");
  //     throw err;
  //   }

  //   client.exists(req.headers.user, (err, reply) => {
  //     if (err) {
  //       console.log("Redis not working...");
  //       system.exit(0);
  //     }

  //     if (reply === 1) {
  //       // user exists
  //       // check time interval
  //       client.get(req.headers.user, (err, reply) => {
  //         let data = JSON.parse(reply);
  //         let currentTime = moment().unix();
  //         let difference = (currentTime - data.startTime) / (60 * 60);
  //         console.log("difference", difference);
  //         console.log("currentTime", currentTime);
  //         console.log("data:", data.count);
  //         console.log("ip:", ipRes);

  //         if (difference > 60) {
  //           if (data.count > 200) {
  //             // client.expire(ip, 200);
  //             // return res.json({
  //             //   error: 1,
  //             //   message: "throttled limit exceeded...",
  //             // });.
  //             return true;
  //           }
  //           // update the count and allow the request
  //           data.count = ipRes;
  //           client.set(req.headers.user, JSON.stringify(data));
  //           // allow request
  //           next();
  //         }
  //       });
  //     } else {
  //       // add new user
  //       let body = {
  //         count: 1,
  //         startTime: moment().unix(),
  //       };
  //       client.set(req.headers.user, JSON.stringify(body));
  //       // allow request
  //       next();
  //     }
  //   });
  // }
  // // check rate limit
  // let overLimit = await isOverLimit(req.ip);

  // if (overLimit) {
  //   res.status(429).send("Too many requests - try again later");
  //   return;
  // }
  // allow access to resources
  res.send("Accessed the precious resources!");
});

module.exports = router;
