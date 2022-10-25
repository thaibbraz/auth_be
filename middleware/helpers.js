const IP = require("ip");

function getToken(req) {
  // Return '' if header not found
  if (!("authorization" in req.headers)) {
    return "";
  }
  // Split header into 'Bearer' and token
  let authHeader = req.headers["authorization"];
  let [str, token] = authHeader.split(" ");

  return str === "Bearer" ? token : "";
}

function getIp(req) {
  // return IP.address();
  return req.ip;
}

module.exports = {
  getToken,
  getIp,
};
