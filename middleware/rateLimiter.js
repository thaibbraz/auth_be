const moment = require("moment");
const redis = require("ioredis");
const IP = require("ip");
const { getToken, getIp } = require("./helpers");

const redisClient = redis.createClient({
  port: process.env.REDIS_PORT || 6379,
  host: process.env.REDIS_HOST || "localhost",
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

let WINDOW_SIZE_IN_HOURS = 1;
let MAX_WINDOW_REQUEST_COUNT = 200;
let WINDOW_LOG_INTERVAL_IN_HOURS = 1;

function requestCounter(data, totalWindowRequestsCount, currentRequestTime) {
  if (totalWindowRequestsCount >= MAX_WINDOW_REQUEST_COUNT) {
    res
      .status(429)
      .send(
        `You have exceeded the ${MAX_WINDOW_REQUEST_COUNT} requests in ${WINDOW_SIZE_IN_HOURS} hrs limit!`
      );
  } else {
    // if number of requests made is less than allowed maximum, log new entry
    let lastRequestLog = data[data.length - 1];
    let potentialWindowInterval = currentRequestTime
      .subtract(WINDOW_LOG_INTERVAL_IN_HOURS, "hours")
      .unix();
    //  if interval has not passed since last request log, increment counter
    if (lastRequestLog.requestTimeStamp > potentialWindowInterval) {
      lastRequestLog.requestCount++;
      data[data.length - 1] = lastRequestLog;
    } else {
      //  if interval has passed, log new entry for current user and timestamp
      data.push({
        requestTimeStamp: currentRequestTime.unix(),
        requestCount: 1,
      });
    }
    // await redisClient.set(key, JSON.stringify(data));
  }
  return data;
}
function requestsNumberCalculator(data) {
  let windowStartTimestamp = moment()
    .subtract(WINDOW_SIZE_IN_HOURS, "hours")
    .unix();
  let requestsWithinWindow = data.filter((entry) => {
    return entry.requestTimeStamp > windowStartTimestamp;
  });

  let totalWindowRequestsCount = requestsWithinWindow.reduce(
    (accumulator, entry) => {
      return accumulator + entry.requestCount;
    },
    0
  );
  console.log("requestsWithinWindow", requestsWithinWindow);
  return totalWindowRequestsCount;
}

const redisRateLimiter = async (req, res, next) => {
  // check that redis client exists
  if (!redisClient) {
    throw new Error("Redis client does not exist!");
  }

  redisClient.on("connect", function () {
    console.log("connected");
  });
  try {
    let key = getToken(req);
    // If request doesn't contain a token, it extracts the ip from the user
    if (key == "") {
      key = getIp(req);
      console.log("ip", getIp(req));
      WINDOW_SIZE_IN_HOURS = 1;
      MAX_WINDOW_REQUEST_COUNT = 100;
      WINDOW_LOG_INTERVAL_IN_HOURS = 1;
    }

    // fetch records of current user using IP address or token, returns null when no record is found
    let record = await redisClient.get(key);

    // Store the request moment
    const currentRequestTime = moment();

    //if no record is found , create a new record for user and store to Redis
    if (record == null) {
      let newRecord = [];
      let requestLog = {
        requestTimeStamp: currentRequestTime.unix(),
        requestCount: 1,
      };
      newRecord.push(requestLog);

      // visualize requests
      let requestsWithinWindow = newRecord.filter((entry) => {
        return (
          entry.requestTimeStamp >
          moment().subtract(WINDOW_SIZE_IN_HOURS, "hours").unix()
        );
      });
      console.log("requestsWithinWindow", requestsWithinWindow);
      await redisClient.set(key, JSON.stringify(newRecord));
    } else {
      // if record is found, parse it's value and calculate number of requests users has made within the last window
      let data = JSON.parse(record);
      let totalWindowRequestsCount = requestsNumberCalculator(data);

      // if number of requests made is greater than or equal to the desired maximum, return error
      if (totalWindowRequestsCount >= MAX_WINDOW_REQUEST_COUNT) {
        res
          .status(429)
          .send(
            `You have exceeded the ${MAX_WINDOW_REQUEST_COUNT} requests in ${WINDOW_SIZE_IN_HOURS} hrs limit!`
          );
      } else {
        requestCounter(data, totalWindowRequestsCount, currentRequestTime);
        await redisClient.set(key, JSON.stringify(data));
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  redisRateLimiter,
};
