const express = require("express");
const router = express.Router();
const { ensureUserLoggedIn } = require("../middleware/guards");

// /**
//  * GET /
//  **/

router.get("/", function (req, res, next) {
  res.send({ message: "Welcome to the AuthAuth homepage! Try /users" });
});

module.exports = router;
