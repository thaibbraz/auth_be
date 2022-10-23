const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

// const redis = require("redis");
// const redisClient = redis.createClient();
const moment = require("moment");

// Connect with Redis client
const redis = require("ioredis");
const redisClient = redis.createClient({
  port: process.env.REDIS_PORT || 6379,
  host: process.env.REDIS_HOST || "localhost",
});
redisClient.on("connect", function () {
  console.log("connected");
});

// async function isOverLimit(req, res, next) {
//   // let res;
//   let ip = res.ip;

redisClient.get(req.headers.user, (err, reply) => {
  let data = JSON.parse(reply);
  let currentTime = moment().unix();

  console.log("currentTime: ", currentTime);
  console.log("data.startTime: ", data.startTime);
  // console.log("data.count: ", data.count);

  let difference = (currentTime - data.startTime) / 60;
  console.log("difference: ", difference);
});

//   try {
//     // increment number of requests
//     res = await redisClient.incr(ip);
//   } catch (err) {
//     console.error("isOverLimit: could not increment key");
//     throw err;
//   }
//   console.log(`${ip} has value: ${res}`);
//   if (difference >= 1 && res > 10) {
//     return res.status(429).send("Too many requests - try again later");
//   }
//   next();
//   client.expire(ip, 10);
// }
// check rate limit
// let overLimit = await isOverLimit(req.ip);

// if (overLimit) {
//   res.status(429).send("Too many requests - try again later");
//   return;
// }

/**
 * Guards are the middleware to "prote3000\ct" routes.
 **/

/**
 * Make sure the user is logged in
 **/

function ensureUserLoggedIn(req, res, next) {
  let token = _getToken(req);
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

/**
 * Make sure the rate limit is respected
 **/
const rateLimiter = (req, res, next) => {
  let ip = req.ip;
  /// increment number of requests
  // res = await redisClient.incr(ip);
  redisClient.exists(req.headers.user, (err, reply) => {
    if (err) {
      console.log("Redis not working...");
      system.exit(0);
    }

    if (reply === 1) {
      // user exists

      // check time interval
      redisClient.get(req.headers.user, (err, reply) => {
        let data = JSON.parse(reply);
        let currentTime = moment().unix();
        console.log(
          "User Req Header: ",
          req.headers.authorization.split(" ")[1]
        );
        console.log("data", data);
        console.log("currentTime: ", currentTime);
        console.log("data.startTime: ", data.startTime);
        console.log("data.count: ", data.count);

        let difference = (currentTime - data.startTime) / 60;
        console.log("difference: ", difference);
        if (difference >= 1) {
          let body = {
            count: 1,
            startTime: moment().unix(),
          };
          redisClient.set(req.headers.user, JSON.stringify(body));
          // allow the request
          next();
        }
        if (difference < 1) {
          if (data.count > 3) {
            return res.json({
              error: 1,
              message: "throttled limit exceeded...",
            });
          }
          // update the count and allow the request
          data.count++;
          redisClient.set(req.headers.user, JSON.stringify(data));
          // allow request

          next();
        }
      });
    } else {
      // add new user
      let body = {
        count: 1,
        token: req.headers.authorization.split(" ")[1],
        startTime: moment().unix(),
      };
      redisClient.set(req.headers.user, JSON.stringify(body));
      // allow request
      next();
    }
  });
};

function _getToken(req) {
  // Return '' if header not found
  if (!("authorization" in req.headers)) {
    return "";
  }

  // Split header into 'Bearer' and token
  let authHeader = req.headers["authorization"];
  let [str, token] = authHeader.split(" ");

  return str === "Bearer" ? token : "";
}

module.exports = {
  ensureUserLoggedIn,
  rateLimiter,
};
