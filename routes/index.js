const express = require("express");
const router = express.Router();

// /**
//  * GET /
//  **/

router.get("/", function (req, res, next) {
  res.send({ message: "Welcome to the AuthAuth homepage! Try /users" });
});

module.exports = router;
