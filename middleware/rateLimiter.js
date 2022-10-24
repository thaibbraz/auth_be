const moment = require("moment");
const redis = require("ioredis");
const IP = require("ip");
const { getToken, getIp } = require("./helpers");

const redisClient = redis.createClient({
  port: process.env.REDIS_PORT || 6379,
  host: process.env.REDIS_HOST || "localhost",
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

let WINDOW_SIZE_IN_HOURS = 24;
let MAX_WINDOW_REQUEST_COUNT = 100;
let WINDOW_LOG_INTERVAL_IN_HOURS = 1;

const redisRateLimiter = async (req, res, next) => {
  const ipAddress = getIp(req);
  redisClient.on("connect", function () {
    console.log("connected");
  });
  try {
    // check that redis client exists
    if (!redisClient) {
      throw new Error("Redis client does not exist!");
    }
    // let key = await redisClient.get(req.ip);

    let key = getToken(req);

    if (key == "") {
      key = ipAddress;
      WINDOW_SIZE_IN_HOURS = 10;
      MAX_WINDOW_REQUEST_COUNT = 100;
      WINDOW_LOG_INTERVAL_IN_HOURS = 1;
    } else {
      WINDOW_SIZE_IN_HOURS = 10;
      MAX_WINDOW_REQUEST_COUNT = 200;
      WINDOW_LOG_INTERVAL_IN_HOURS = 1;
    }
    let record = await redisClient.get(key);

    // fetch records of current user using IP address, returns null when no record is found

    const currentRequestTime = moment();
    console.log("key: ", key);
    console.log("record: ", record);
    //  if no record is found , create a new record for user and store to redis
    if (record == null) {
      let newRecord = [];
      let requestLog = {
        requestTimeStamp: currentRequestTime.unix(),
        requestCount: 1,
      };
      newRecord.push(requestLog);
      await redisClient.set(key, JSON.stringify(newRecord));
      next();
    }
    // if record is found, parse it's value and calculate number of requests users has made within the last window
    let data = JSON.parse(record);
    let windowStartTimestamp = moment()
      .subtract(WINDOW_SIZE_IN_HOURS, "hours")
      .unix();
    let requestsWithinWindow = data.filter((entry) => {
      return entry.requestTimeStamp > windowStartTimestamp;
    });
    console.log("requestsWithinWindow", requestsWithinWindow);
    let totalWindowRequestsCount = requestsWithinWindow.reduce(
      (accumulator, entry) => {
        return accumulator + entry.requestCount;
      },
      0
    );

    // if number of requests made is greater than or equal to the desired maximum, return error
    if (totalWindowRequestsCount >= MAX_WINDOW_REQUEST_COUNT) {
      res
        .status(429)
        .send(
          `You have exceeded the ${MAX_WINDOW_REQUEST_COUNT} requests in ${WINDOW_SIZE_IN_HOURS} hrs limit!`
        );
    } else {
      // if number of requests made is less than allowed maximum, log new entry
      let lastRequestLog = data[data.length - 1];
      let potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime
        .subtract(WINDOW_LOG_INTERVAL_IN_HOURS, "hours")
        .unix();
      //  if interval has not passed since last request log, increment counter
      if (
        lastRequestLog.requestTimeStamp >
        potentialCurrentWindowIntervalStartTimeStamp
      ) {
        lastRequestLog.requestCount++;
        data[data.length - 1] = lastRequestLog;
      } else {
        //  if interval has passed, log new entry for current user and timestamp
        data.push({
          requestTimeStamp: currentRequestTime.unix(),
          requestCount: 1,
        });
      }
      await redisClient.set(key, JSON.stringify(data));
      next();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  redisRateLimiter,
};
